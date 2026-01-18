import { test, expect } from '@playwright/test';

test('has title and start button', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/MIS Active Learning/);

    // Check for main heading
    await expect(page.getByRole('heading', { level: 1 })).toContainText('MIS Active Learning Platform');

    // Click the get started link/button
    await page.click('text=Get Started');

    // Expects to be redirected to sign-in or dashboard
    // Clerk usually redirects to accounts.google.com or similar on dev, or the sign-in page.
    // We just check that we left the home page or hit a sign in url
    await expect(page).toHaveURL(/.*(sign-in|dashboard).*/);
});
