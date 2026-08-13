import { expect, test } from '@playwright/test';

test.describe('Video Studio visual baseline', () => {
  test('renders the storyboard editor and timeline', async ({ page }) => {
    await page.goto('/backoffice/marketing-studio/generador-contenido');
    await expect(page.getByRole('heading', { name: 'Marketing Content Studio' })).toBeVisible();
    await page.getByRole('button', { name: /Generador de Video/ }).click();
    await expect(page.getByText('Timeline', { exact: true })).toBeVisible();
    await expect(page).toHaveScreenshot('video-studio-editor.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});