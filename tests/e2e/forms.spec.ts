import { expect, test } from '@playwright/test'

test('bülleten forması: yanlış e-poçt və uğurlu abunə', async ({ page }) => {
  await page.route('**/api/newsletter', (route) => route.fulfill({ status: 200, json: { ok: true, status: 'pending' } }))
  await page.goto('/az/bulleten')
  const form = page.locator('form').filter({ has: page.locator('input[name="email"]') }).first()
  await form.locator('input[name="email"]').fill('yanlis')
  await form.getByRole('button', { name: 'Abunə ol' }).click()
  await expect(form.getByRole('alert')).toContainText('Düzgün e-poçt')
  await form.locator('input[name="email"]').fill('oxucu@example.com')
  await form.getByRole('button', { name: 'Abunə ol' }).click()
  await expect(page.getByRole('status').first()).toContainText('təsdiq linki')
})

test('B2B sorğu forması: validasiya və göndəriş', async ({ page }) => {
  let sent: Record<string, unknown> | null = null
  await page.route('**/api/leads', async (route) => {
    sent = route.request().postDataJSON()
    await route.fulfill({ status: 200, json: { ok: true, id: 1 } })
  })
  await page.goto('/az/reklam/sorgu?service=sponsored')
  await page.getByRole('button', { name: 'Sorğu göndər' }).click()
  await expect(page.getByRole('alert').first()).toContainText('mütləqdir')
  await page.fill('#company', 'Test MMC')
  await page.fill('#contact', 'Əli Əliyev')
  await page.fill('#email', 'ali@example.com')
  await expect(page.locator('#service')).toHaveValue('sponsored')
  await page.getByRole('button', { name: 'Sorğu göndər' }).click()
  await expect(page.getByRole('status')).toContainText('qəbul edildi')
  expect(sent).toMatchObject({ company: 'Test MMC', service: 'sponsored', locale: 'az' })
})
