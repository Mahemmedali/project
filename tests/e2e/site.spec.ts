import { expect, test } from '@playwright/test'

test('kök URL dilə yönləndirir və ana səhifə açılır', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/(az|en|ru)$/)
  await expect(page.locator('main h2').first()).toBeVisible()
  await expect(page.locator('header').getByRole('link', { name: 'Good Morning Baku' })).toBeVisible()
})

test('dil keçidi lokallaşdırılmış yola aparır', async ({ page }) => {
  await page.goto('/az/reklam')
  await page.getByRole('navigation', { name: 'Dil' }).first().getByRole('link', { name: 'EN' }).click()
  await expect(page).toHaveURL(/\/en\/advertise$/)
  await expect(page.locator('h1')).toContainText('Reach')
})

test('məqalə səhifəsi: meta, mətn, hreflang', async ({ page }) => {
  await page.goto('/az/seher/metroda-yeni-stansiya-sabah-acilir')
  await expect(page.locator('h1')).toContainText('Bakı metrosunda')
  await expect(page.locator('article').first()).toContainText('Nə dəyişəcək?')
  const en = page.locator('link[rel="alternate"][hreflang="en"]')
  await expect(en).toHaveAttribute('href', /\/en\/city\/new-metro-station-opens-tomorrow$/)
  const ld = await page.locator('script[type="application/ld+json"]').first().textContent()
  expect(JSON.parse(ld!)['@type']).toBe('NewsArticle')
})

test('tərcümə olunmayan məqalə 404 verir', async ({ page }) => {
  const res = await page.goto('/ru/ekonomika/ceny-na-rynke-nedelnyj-obzor')
  expect(res?.status()).toBe(404)
})

test('axtarış nəticə qaytarır', async ({ page }) => {
  await page.goto('/az/axtaris?q=metro')
  await expect(page.getByText(/nəticə/)).toBeVisible()
  await expect(page.locator('article').first()).toBeVisible()
})

test('sponsorlu məqalə etiketlənir', async ({ page }) => {
  await page.goto('/az/iqtisadiyyat/kicik-biznes-reqemsal-bank')
  await expect(page.locator('aside', { hasText: 'Tərəfdaş materialı' })).toBeVisible()
  await expect(page.getByText('Sponsor: Baku Bank')).toBeVisible()
})

test('sitemap, robots, RSS', async ({ request }) => {
  const sm = await request.get('/sitemap.xml')
  expect(sm.ok()).toBeTruthy()
  expect(await sm.text()).toContain('<loc>')
  const rb = await request.get('/robots.txt')
  expect(await rb.text()).toContain('Sitemap:')
  const rss = await request.get('/az/rss.xml')
  expect(rss.headers()['content-type']).toContain('rss+xml')
})
