import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/Lorena Răuță/)

    // Navbar (S1) renders with the branded section anchors.
    await expect(page.getByRole('navigation', { name: 'Principal' })).toBeVisible()
    await expect(page.locator('h2').first()).toHaveText('Hero')
  })
})
