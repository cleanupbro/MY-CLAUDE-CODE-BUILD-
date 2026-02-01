import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display hero section with main headline', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Clean Up Bros/i })).toBeVisible();
  });

  test('should have Get Quote button visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Get My Free Quote/i })).toBeVisible();
  });

  test('should have phone number visible', async ({ page }) => {
    await expect(page.getByText('0406 764 585')).toBeVisible();
  });

  test('should navigate to services page', async ({ page }) => {
    await page.getByRole('button', { name: /Services/i }).first().click();
    await expect(page).toHaveURL(/services/i);
  });

  test('should show trust badges', async ({ page }) => {
    await expect(page.getByText(/4.9/)).toBeVisible();
    await expect(page.getByText(/Bond Back/i)).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('should navigate to About page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /About/i }).first().click();
    await expect(page).toHaveURL(/about/i);
  });

  test('should navigate to Reviews page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Reviews/i }).first().click();
    await expect(page).toHaveURL(/reviews/i);
  });

  test('should navigate to Pricing page', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByRole('heading', { name: /Transparent Pricing/i })).toBeVisible();
  });
});
