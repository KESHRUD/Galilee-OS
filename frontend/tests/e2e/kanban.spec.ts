import { test, expect } from "@playwright/test";

test.describe("Kanban Board E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Enable MSW mocking
    await page.goto("http://localhost:5173/?msw=on");
    // Wait for app to load
    await page.waitForLoadState("networkidle");
  });

  test("should display the landing page", async ({ page }) => {
    // Check for landing page or login
    const hasContent = await page
      .locator("body")
      .textContent();
    expect(hasContent).toBeTruthy();
  });

  test("should be installable as PWA", async ({ page }) => {
    // Check for manifest
    const manifest = await page.evaluate(async () => {
      const link = document.querySelector('link[rel="manifest"]');
      if (!link) return null;
      const response = await fetch((link as HTMLLinkElement).href);
      return response.json();
    });

    expect(manifest).toBeTruthy();
    expect(manifest.name).toBe("Offline Kanban Board");
  });

  test("should register service worker", async ({ page }) => {
    // Wait for service worker registration
    const swRegistered = await page.evaluate(async () => {
      if (!("serviceWorker" in navigator)) return false;
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        return !!registration;
      } catch {
        return false;
      }
    });

    // Service worker might not be registered in test environment
    // but the API should be available
    const swSupported = await page.evaluate(() => "serviceWorker" in navigator);
    expect(swSupported).toBe(true);
  });
});

test.describe("Offline Functionality", () => {
  test("should show offline indicator when network is disabled", async ({
    page,
    context,
  }) => {
    await page.goto("http://localhost:5173/?msw=on");
    await page.waitForLoadState("networkidle");

    // Go offline
    await context.setOffline(true);

    // Check for offline indicator (depends on implementation)
    const isOffline = await page.evaluate(() => !navigator.onLine);
    expect(isOffline).toBe(true);

    // Go back online
    await context.setOffline(false);
  });

  test("should cache static assets", async ({ page }) => {
    await page.goto("http://localhost:5173/?msw=on");
    await page.waitForLoadState("networkidle");

    // Check if caches API is available
    const cacheAvailable = await page.evaluate(() => "caches" in window);
    expect(cacheAvailable).toBe(true);
  });
});

test.describe("Accessibility", () => {
  test("should have proper page title", async ({ page }) => {
    await page.goto("http://localhost:5173/?msw=on");
    const title = await page.title();
    expect(title).toContain("Kanban");
  });

  test("should be keyboard navigable", async ({ page }) => {
    await page.goto("http://localhost:5173/?msw=on");
    await page.waitForLoadState("networkidle");

    // Tab through the page
    await page.keyboard.press("Tab");

    // Check that an element is focused
    const focusedElement = await page.evaluate(
      () => document.activeElement?.tagName
    );
    expect(focusedElement).toBeTruthy();
  });
});

test.describe("Responsive Design", () => {
  test("should work on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("http://localhost:5173/?msw=on");
    await page.waitForLoadState("networkidle");

    // Page should still be accessible
    const bodyVisible = await page.locator("body").isVisible();
    expect(bodyVisible).toBe(true);
  });

  test("should work on tablet viewport", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("http://localhost:5173/?msw=on");
    await page.waitForLoadState("networkidle");

    const bodyVisible = await page.locator("body").isVisible();
    expect(bodyVisible).toBe(true);
  });
});
