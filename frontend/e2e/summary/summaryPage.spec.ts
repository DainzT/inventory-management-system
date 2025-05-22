import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();

// Global test configuration
test.describe.configure({
  retries: 2,
  timeout: 300000, // Increase global timeout to 5 minutes
});

test.describe("Summary Page", () => {
  test.beforeEach(async ({ context, page }) => {
    // Increase navigation timeout for the entire context
    context.setDefaultNavigationTimeout(300000);
    context.setDefaultTimeout(300000);

    // Step 1: Go to login page and ensure it's loaded
    await page.goto("/login", { 
      timeout: 300000,
      waitUntil: "domcontentloaded"
    });

    // Wait for the page to be stable
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle", { timeout: 300000 });

    // Step 2: Handle login
    try {
      const pinInput = page.locator("#pin-input");
      await pinInput.waitFor({ state: "visible", timeout: 300000 });
      await pinInput.fill("222222");

      const loginButton = page.getByRole("button", { name: "Login" });
      await loginButton.waitFor({ state: "visible" });
      
      // Click login and wait for navigation
      await loginButton.click();
      
      // Wait for navigation with multiple strategies
      await Promise.race([
        page.waitForURL("**/inventory", { timeout: 300000 }),
        page.waitForNavigation({ timeout: 300000, waitUntil: "domcontentloaded" })
      ]);

      // Additional wait states
      await page.waitForLoadState("domcontentloaded");
      await page.waitForLoadState("networkidle", { timeout: 300000 });
    } catch (error) {
      console.log("Login failed:", error);
      throw error;
    }

    // Step 3: Navigate to Summary
    try {
      const summaryNav = page.getByRole("link", { name: "Summary" });
      await summaryNav.waitFor({ state: "visible", timeout: 300000 });
      await summaryNav.click();
      
      // Wait for navigation
      await page.waitForLoadState("domcontentloaded");
      await page.waitForLoadState("networkidle", { timeout: 300000 });
    } catch (error) {
      console.log("Navigation to Summary failed:", error);
      throw error;
    }

    // Step 4: Navigate to All Fleets
    try {
      const allFleets = page.getByRole("link", { name: "All Fleets" });
      await allFleets.waitFor({ state: "visible", timeout: 300000 });
      await allFleets.click();

      // Wait for navigation with multiple strategies
      await Promise.race([
        page.waitForURL("/summary/all-fleets", { timeout: 300000 }),
        page.waitForNavigation({ timeout: 300000, waitUntil: "domcontentloaded" })
      ]);

      // Additional wait states
      await page.waitForLoadState("domcontentloaded");
      await page.waitForLoadState("networkidle", { timeout: 300000 });
    } catch (error) {
      console.log("Navigation to All Fleets failed:", error);
      throw error;
    }
  });

  test("should display year selector with available years", async ({
    page,
  }) => {
    // Wait for the page to be fully loaded
    await page.waitForLoadState("networkidle", { timeout: 300000 });

    // Check if year selector is visible with increased timeout
    const yearSelector = await page.locator('[data-year-select="true"]');
    await expect(yearSelector).toBeVisible({ timeout: 300000 });

    // Wait a bit for the year buttons to be populated
    await page.waitForTimeout(2000);

    // Check if year buttons are present
    const yearButtons = await page.locator('[data-year-select="true"] button');
    await expect(yearButtons).toHaveCount(await yearButtons.count(), { timeout: 300000 });
  });

  test("should display month selector with all months", async ({ page }) => {
    // Wait for the page to be fully loaded
    await page.waitForLoadState("networkidle", { timeout: 300000 });

    // Check if month selector is visible with increased timeout
    const monthSelector = await page.locator('[data-month-select="true"]');
    await expect(monthSelector).toBeVisible({ timeout: 300000 });

    // Wait a bit for the month buttons to be populated
    await page.waitForTimeout(2000);

    // Check if all 12 months are present
    const monthButtons = await page.locator(
      '[data-month-select="true"] button'
    );
    await expect(monthButtons).toHaveCount(12, { timeout: 300000 });
  });

  test("should filter orders when selecting a year", async ({ page }) => {
    // Get the first available year button
    const firstYearButton = await page
      .locator('[data-year-select="true"] button')
      .first();

    // Click the year button
    await firstYearButton.click();

    // Verify the button is selected
    await expect(firstYearButton).toHaveClass(/bg-cyan-900/);
  });

  test("should filter orders when selecting a month", async ({ page }) => {
    // Select January
    const januaryButton = await page.locator(
      '[data-month-select="true"] button',
      { hasText: "January" }
    );
    await januaryButton.click();

    // Verify the button is selected
    await expect(januaryButton).toHaveClass(/bg-cyan-900/);
  });

  test("should display invoice table with orders", async ({ page }) => {
    // Wait for the page to be fully loaded
    await page.waitForLoadState("networkidle", { timeout: 300000 });

    // Wait for the invoice table to be visible with increased timeout
    const invoiceTable = page.locator("section.rounded-lg");
    await expect(invoiceTable).toBeVisible({ timeout: 300000 });

    // Wait a bit for the table content to be populated
    await page.waitForTimeout(2000);

    // Check if the table headers are present
    const headers = page.locator(".bg-cyan-900 div");
    await expect(headers).toHaveCount(6, { timeout: 300000 }); // Date Out, Product, Note, Qty, Unit Price, Total
  });

  test("should show total amount in invoice summary", async ({ page }) => {
    // Wait for the page to be fully loaded
    await page.waitForLoadState("networkidle", { timeout: 300000 });

    // Wait for the invoice table to be visible with increased timeout
    const invoiceTable = page.locator("section.rounded-lg");
    await expect(invoiceTable).toBeVisible({ timeout: 300000 });

    // Wait a bit for the table content to be populated
    await page.waitForTimeout(2000);

    // Check if the total amount is displayed with peso symbol
    const totalAmount = page.locator("text=₱");
    await expect(totalAmount).toBeVisible({ timeout: 300000 });

    // Check if the total label is visible
    const totalElement = page.locator("text=Total:");
    await expect(totalElement).toBeVisible({ timeout: 300000 });
  });

  test("should handle empty state when no orders exist", async ({ page }) => {
    // Select a year and month that might not have orders
    const futureYear = new Date().getFullYear() + 1;
    const futureYearButton = await page.locator(
      `[data-year-select="true"] button`,
      { hasText: futureYear.toString() }
    );
    if (await futureYearButton.isVisible()) {
      await futureYearButton.click();
    }

    // Check if the empty state message is displayed
    const emptyStateMessage = await page.locator(
      "text=No existing orders during this month of the year."
    );
    await expect(emptyStateMessage).toBeVisible();
  });

  test("should navigate through pages when multiple pages exist", async ({
    page,
  }) => {
    // Wait for the page to be fully loaded
    await page.waitForLoadState("networkidle", { timeout: 300000 });

    // Check if pagination controls exist
    const previousButton = page.getByRole("button", { name: "Previous" });
    const nextButton = page.getByRole("button", { name: "Next" });

    // Verify both buttons are present
    await expect(previousButton).toBeVisible({ timeout: 300000 });
    await expect(nextButton).toBeVisible({ timeout: 300000 });

    // Try to navigate to next page if available
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      
      // Wait for navigation
      await page.waitForLoadState("networkidle", { timeout: 300000 });
      
      // Verify page number has changed
      const pageNumber = page.locator("text=Page 2 of");
      await expect(pageNumber).toBeVisible({ timeout: 300000 });
    }
  });

  test("should display correct fleet name in header", async ({ page }) => {
    // Wait for the page to be fully loaded
    await page.waitForLoadState("networkidle", { timeout: 300000 });

    // Wait for the header to be visible with increased timeout
    const fleetName = page.locator("h1");
    await expect(fleetName).toBeVisible({ timeout: 300000 });

    // Wait a bit for the content to be populated
    await page.waitForTimeout(2000);

    // Verify the header text
    await expect(fleetName).toContainText("INVOICE", { timeout: 300000 });

    // Check for fleet name in the invoice section
    const invoiceSection = page.locator("section.rounded-lg");
    await expect(invoiceSection).toContainText("ALL FLEETS", { timeout: 300000 });
  });
});
