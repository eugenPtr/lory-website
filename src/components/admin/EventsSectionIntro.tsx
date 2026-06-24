'use client'

import React, { useEffect, useState } from 'react'

// Inline editor for the `events-section` global, rendered above the Events list so the
// section intro (eyebrow/heading) and the events themselves live on one admin page.
// The global is hidden from the nav; this is its only edit surface. Talks to Payload's
// REST API for the global (cookie-authenticated, same origin).
type State = { eyebrow: string; hideEyebrow: boolean; heading: string }

const ENDPOINT = '/api/globals/events-section'

export const EventsSectionIntro: React.FC = () => {
  const [state, setState] = useState<State>({ eyebrow: '', hideEyebrow: false, heading: '' })
  const [status, setStatus] = useState<'loading' | 'idle' | 'saving' | 'saved' | 'error'>(
    'loading',
  )

  useEffect(() => {
    let active = true
    fetch(`${ENDPOINT}?depth=0`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (!active) return
        setState({
          eyebrow: data?.eyebrow ?? '',
          hideEyebrow: Boolean(data?.hideEyebrow),
          heading: data?.heading ?? '',
        })
        setStatus('idle')
      })
      .catch(() => active && setStatus('error'))
    return () => {
      active = false
    }
  }, [])

  const save = async () => {
    setStatus('saving')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      })
      setStatus(res.ok ? 'saved' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div
      style={{
        marginBottom: 'var(--base, 1.5rem)',
        padding: 'var(--base, 1.5rem)',
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: 'var(--style-radius-m, 4px)',
        background: 'var(--theme-elevation-50)',
      }}
    >
      <h3 style={{ margin: '0 0 1rem' }}>Intro secțiune</h3>

      <div className="field-type text" style={{ marginBottom: '1rem' }}>
        <label className="field-label" htmlFor="events-intro-eyebrow">
          Eyebrow
        </label>
        <input
          id="events-intro-eyebrow"
          className="field-type__wrap"
          style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
          value={state.eyebrow}
          disabled={status === 'loading'}
          onChange={(e) => setState((s) => ({ ...s, eyebrow: e.target.value }))}
        />
        <div className="field-description">Eticheta mică deasupra titlului.</div>
      </div>

      <div className="field-type checkbox" style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={state.hideEyebrow}
            disabled={status === 'loading'}
            onChange={(e) => setState((s) => ({ ...s, hideEyebrow: e.target.checked }))}
          />
          Hide Eyebrow
        </label>
        <div className="field-description">Ascunde eticheta.</div>
      </div>

      <div className="field-type text" style={{ marginBottom: '1rem' }}>
        <label className="field-label" htmlFor="events-intro-heading">
          Heading
        </label>
        <input
          id="events-intro-heading"
          style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
          value={state.heading}
          disabled={status === 'loading'}
          onChange={(e) => setState((s) => ({ ...s, heading: e.target.value }))}
        />
        <div className="field-description">Titlu opțional al secțiunii.</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          type="button"
          className="btn btn--style-primary"
          onClick={save}
          disabled={status === 'loading' || status === 'saving'}
        >
          {status === 'saving' ? 'Se salvează…' : 'Salvează intro'}
        </button>
        {status === 'saved' && <span style={{ color: 'var(--theme-success-500)' }}>Salvat ✓</span>}
        {status === 'error' && (
          <span style={{ color: 'var(--theme-error-500)' }}>Eroare la salvare</span>
        )}
      </div>
    </div>
  )
}
