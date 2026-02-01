import { test, expect } from '@playwright/test';

const suburbs = [
  'liverpool',
  'cabramatta',
  'casula',
  'moorebank',
  'prestons',
  'bankstown',
];

test.describe('Suburb Landing Pages', () => {
  for (const suburb of suburbs) {
    test(`should load ${suburb} landing page correctly`, async ({ page }) => {
      await page.goto(`/cleaning-services-${suburb}`);
      
      // Check the heading contains the suburb name
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toContainText(new RegExp(suburb, 'i'));
      
      // Check for postcode badge
      await expect(page.getByText(/Serving/i)).toBeVisible();
      
      // Check for Get Quote button
      await expect(page.getByRole('button', { name: /Get Free Quote/i })).toBeVisible();
      
      // Check trust signals are visible
      await expect(page.getByText(/4.9 Google Rating/i)).toBeVisible();
      await expect(page.getByText(/100% Bond Back/i)).toBeVisible();
    });
  }

  test('should have working quote buttons on Liverpool page', async ({ page }) => {
    await page.goto('/cleaning-services-liverpool');
    
    // Click End of Lease button
    await page.getByRole('button', { name: /End of Lease/i }).first().click();
    
    // Should navigate to residential quote form
    await expect(page).toHaveURL(/residential/i);
  });
});
