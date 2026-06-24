import localFont from 'next/font/local'

// IvyOra Display — display titles & subtitles (elegant italic serif). PRD §4.
export const ivyOra = localFont({
  src: [
    { path: '../../../Fonts/ivyora-display/IvyOraDisplay-Light.woff2', weight: '300', style: 'normal' },
    { path: '../../../Fonts/ivyora-display/IvyOraDisplay-LightItalic.woff2', weight: '300', style: 'italic' },
    { path: '../../../Fonts/ivyora-display/IvyOraDisplay-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../../Fonts/ivyora-display/IvyOraDisplay-RegularItalic.woff2', weight: '400', style: 'italic' },
    { path: '../../../Fonts/ivyora-display/IvyOraDisplay-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../../Fonts/ivyora-display/IvyOraDisplay-MediumItalic.woff2', weight: '500', style: 'italic' },
    { path: '../../../Fonts/ivyora-display/IvyOraDisplay-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../../../Fonts/ivyora-display/IvyOraDisplay-BoldItalic.woff2', weight: '700', style: 'italic' },
  ],
  variable: '--ff-ivyora',
  display: 'swap',
})

// Inter — predominant body & UI. Variable font (100–900). PRD §4.
export const inter = localFont({
  src: [
    { path: '../../../Fonts/Inter/Inter-VariableFont_opsz,wght.ttf', weight: '100 900', style: 'normal' },
    { path: '../../../Fonts/Inter/Inter-Italic-VariableFont_opsz,wght.ttf', weight: '100 900', style: 'italic' },
  ],
  variable: '--ff-inter',
  display: 'swap',
})

// NOTE: Times (font-times) ships only as Times.ttc, which next/font/local
// cannot load (no font-collection support). font-times uses the universally
// available system Times stack instead — see styles.css @theme.
