const { test, expect } = require('@playwright/test');

const REAL_API = 'https://jftwauzwqh.us-east-1.awsapprunner.com';

test('displays login page on initial load', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('[data-testid="login-form"]');
  await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
  await expect(page.locator('[data-testid="username-input"]')).toBeVisible();
  await expect(page.locator('[data-testid="password-input"]')).toBeVisible();
  await page.screenshot({ path: 'e2e/screenshots/login-page.png' });
});

test('rejects invalid credentials', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('[data-testid="login-form"]');
  await page.locator('[data-testid="username-input"] input').fill('wronguser');
  await page.locator('[data-testid="password-input"] input').fill('wrongpass');
  await page.locator('[data-testid="login-button"]').click();
  await expect(page.getByText('Invalid username or password')).toBeVisible();
  await page.screenshot({ path: 'e2e/screenshots/login-error.png' });
});

test('successful login and dashboard display', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('[data-testid="login-form"]');
  await page.locator('[data-testid="username-input"] input').fill('admin');
  await page.locator('[data-testid="password-input"] input').fill('admin123');
  await page.locator('[data-testid="login-button"]').click();
  await page.waitForSelector('[data-testid="dashboard"]');
  await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
  await expect(page.getByText('Outback Steakhouse')).toBeVisible();
  await expect(page.getByText('Buca di Beppo')).toBeVisible();
  await expect(page.getByText('IHOP')).toBeVisible();
  await expect(page.getByText('Chipotle')).toBeVisible();
  await expect(page.locator('[data-testid="vote-count-outback"]')).toBeVisible();
  await expect(page.locator('[data-testid="vote-count-bucadibeppo"]')).toBeVisible();
  await expect(page.locator('[data-testid="vote-count-ihop"]')).toBeVisible();
  await expect(page.locator('[data-testid="vote-count-chipotle"]')).toBeVisible();
  await page.screenshot({ path: 'e2e/screenshots/dashboard.png' });
});

test('cast a vote and see updated count', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('[data-testid="login-form"]');
  await page.locator('[data-testid="username-input"] input').fill('admin');
  await page.locator('[data-testid="password-input"] input').fill('admin123');
  await page.locator('[data-testid="login-button"]').click();
  await page.waitForSelector('[data-testid="dashboard"]');
  // Read initial vote count for Chipotle from the real backend
  const initialCount = await page.locator('[data-testid="vote-count-chipotle"]').textContent();
  const initialNum = parseInt(initialCount, 10);
  // Click the vote button for Chipotle
  await page.locator('[data-testid="vote-button-chipotle"]').click();
  // Wait for the count to update (should be at least initialNum + 1)
  await expect(page.locator('[data-testid="vote-count-chipotle"]')).not.toHaveText(
    String(initialNum),
    { timeout: 10000 }
  );
  // Verify the count actually increased
  const updatedCount = await page.locator('[data-testid="vote-count-chipotle"]').textContent();
  const updatedNum = parseInt(updatedCount, 10);
  expect(updatedNum).toBeGreaterThan(initialNum);
  await page.screenshot({ path: 'e2e/screenshots/after-vote.png' });
});

test('logout returns to login page', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('[data-testid="login-form"]');
  await page.locator('[data-testid="username-input"] input').fill('admin');
  await page.locator('[data-testid="password-input"] input').fill('admin123');
  await page.locator('[data-testid="login-button"]').click();
  await page.waitForSelector('[data-testid="dashboard"]');
  await page.locator('[data-testid="logout-button"]').click();
  await page.waitForSelector('[data-testid="login-form"]');
  await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
  await page.screenshot({ path: 'e2e/screenshots/after-logout.png' });
});
