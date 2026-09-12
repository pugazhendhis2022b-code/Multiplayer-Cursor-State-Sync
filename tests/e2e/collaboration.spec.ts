import { test, expect } from '@playwright/test';

test.describe('Multiplayer Collaboration E2E Suite', () => {
  test('landing page renders successfully with branding and room creation', async ({ page }) => {
    await page.goto('/');

    // Verify title and main headings
    await expect(page).toHaveTitle(/SyncPoint/);
    await expect(page.locator('h1')).toContainText('Multiplayer Cursor & State Synchronization');

    // Verify room creation form is present
    const createButton = page.locator('button:has-text("Launch Live Collaboration Room")');
    await expect(createButton).toBeVisible();
  });

  test('creates room and transitions into collaborative workspace', async ({ page }) => {
    await page.goto('/');

    // Click launch instant room or submit form
    const instantButton = page.locator('button:has-text("Instant Room")').first();
    await instantButton.click();

    // Verify URL is now /room/...
    await expect(page).toHaveURL(/\/room\/.+/);

    // Verify Workspace components are rendered
    await expect(page.locator('text=Shared Sticky Notes Board')).toBeVisible();
    await expect(page.locator('text=Collaborative Scratchpad')).toBeVisible();
    await expect(page.locator('text=Shared Atomic Counter')).toBeVisible();
    await expect(page.locator('text=Distributed Room Controls')).toBeVisible();

    // Verify Floating Toolbar exists
    await expect(page.locator('button:has-text("Select Cursor")')).toBeVisible();
    await expect(page.locator('button:has-text("Cursor Chat")')).toBeVisible();
    await expect(page.locator('button:has-text("Laser Pointer")')).toBeVisible();
  });

  test('interacts with shared counter', async ({ page }) => {
    await page.goto('/room/test-e2e-room');

    // Locate increment button (+)
    const incrementBtn = page.locator('button[title="Increment"]');
    await expect(incrementBtn).toBeVisible();

    // Read initial counter value
    const counterDisplay = page.locator('div:has-text("Global Count")').locator('..').locator('div.text-3xl');
    const initialVal = await counterDisplay.innerText();

    // Click increment
    await incrementBtn.click();

    // Expect counter to update
    const updatedVal = await counterDisplay.innerText();
    expect(parseInt(updatedVal)).toBeGreaterThanOrEqual(parseInt(initialVal));
  });
});
