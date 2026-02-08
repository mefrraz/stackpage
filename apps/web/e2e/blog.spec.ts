
import { test, expect } from '@playwright/test';

// Configuration
const BASE_URL = 'http://localhost:3000'; // Or https://getstackpage.vercel.app
const EMAIL = process.env.TEST_EMAIL || 'test@example.com';
const PASSWORD = process.env.TEST_PASSWORD || 'password';

test('Blog Creation Flow', async ({ page }) => {
    // 1. Login
    await page.goto(BASE_URL + '/login');
    await page.fill('input[type="email"]', EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button:has-text("Entrar")');

    // Wait for dashboard
    await expect(page).toHaveURL(/.*dashboard/);

    // 2. Create New Site
    await page.click('a[href="/dashboard/new"]');
    const siteName = `Test Blog ${Date.now()}`;
    await page.fill('input[placeholder="Nome do Site"]', siteName);
    await page.fill('input[placeholder="Subdomínio"]', `test-${Date.now()}`);
    await page.click('button:has-text("Criar Site")');

    // Wait for editor
    await expect(page).toHaveURL(/.*\/editor\/.*/);

    // 3. Create New Page (Post)
    await page.click('button:has-text("Post")'); // In sidebar
    await page.fill('input[placeholder="Título..."]', 'Hello World');
    await page.click('button:has-text("OK")');

    // 4. Add Content
    await page.click('button:has-text("Hero")'); // Add block
    await page.click('text=Novo Hero'); // Select block

    // Edit properties
    await page.fill('input[value="Novo Hero"]', 'My First Automatic Post');
    await page.fill('textarea', 'Created via Playwright test.');

    // 5. Publish
    await page.click('button:has-text("Publicar")');

    // 6. Verify URL
    const [newPage] = await Promise.all([
        page.waitForEvent('popup'),
        page.click('button[title="Ver no site"]')
    ]);

    await newPage.waitForLoadState();
    expect(await newPage.title()).toContain('My First Automatic Post');

    console.log('Blog created successfully!');
    console.log('URL:', newPage.url());
});
