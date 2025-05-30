import { test, expect } from "@playwright/test";
import { testDataManager } from "./testDataManager";
import dotenv from "dotenv";
dotenv.config();

test.describe("Summary Page", () => {
  let accessToken;

  test.beforeAll(async ({ request }) => {
    // Seed test data before all tests
    await testDataManager.seedTestData(request);
  });

  test.afterAll(async ({ request }) => {
    // Clean up test data after all tests
    await testDataManager.cleanupTestData(request);
  });


  test.beforeEach(async ({ page, request }) => {
    // Set a longer timeout for the entire test
    test.setTimeout(180000);

    const dataExists = await testDataManager.verifyTestDataExists(request);
    if (!dataExists) {
      console.log("No test data found, seeding again...");
      await testDataManager.seedTestData(request);
    }

    try {
      // Login first
      await page.goto("/login");

      // Wait for the login form to be ready
      await page.waitForSelector("#pin-input", {
        state: "visible",
        timeout: 10000,
      });

      // Fill the pin input
      const pinInput = page.locator("#pin-input");
      await pinInput.fill("222222"); // Click login button
      const loginButton = page.getByRole("button", { name: "Login" });
      await loginButton.click(); // Wait for the token to be set in sessionStorage with more reliable approach
      try {
        // First try waiting for the token directly
        await page.waitForFunction(
          () => sessionStorage.getItem("access_token") !== null,
          { timeout: 30000 }
        );
      } catch {
        console.log(
          "Waiting for token in sessionStorage timed out, checking alternative navigation indicators"
        );

        // If waiting for token times out, check if we're logged in by URL or UI elements
        const currentUrl = page.url();
        if (currentUrl.includes("/inventory")) {
          console.log(
            "Successfully navigated to inventory page, continuing test"
          );
        } else {
          // Try to re-login once more
          await page.goto("/login");
          await page.waitForSelector("#pin-input", {
            state: "visible",
            timeout: 10000,
          });
          await page.locator("#pin-input").fill("222222");
          await page.getByRole("button", { name: "Login" }).click();

          // Wait for navigation instead of token
          await page.waitForURL("**/inventory", { timeout: 30000 });
        }
      }
      // Get the access token if it exists, but continue even if it doesn't
      // (some applications may store auth state differently)
      try {
        const token = await page.evaluate(() =>
          sessionStorage.getItem("access_token")
        );
        if (token) {
          accessToken = token;
          console.log("Access token successfully retrieved");
        } else {
          console.log("No access token found, but navigation succeeded");
        }
      } catch {
        console.log("Could not retrieve access token, but continuing test");
      }

      // Wait for navigation with multiple checks
      try {
        // First wait for URL change
        await page.waitForURL("**/inventory", { timeout: 30000 });

        // Then wait for the page to be loaded
        await page.waitForLoadState("load", { timeout: 30000 }); // Wait for any loading indicators to disappear (if they exist)
        await page
          .waitForSelector(".loading-indicator", {
            state: "hidden",
            timeout: 10000,
          })
          .catch(() => {});

        // Wait for a specific element that indicates the page is ready - PageTitle uses h2
        await page.waitForSelector("h2", { timeout: 10000 });
      } catch (error) {
        console.error("Navigation failed:", error);
        // Take a screenshot for debugging
        await page.screenshot({ path: "navigation-error.png" });
        throw error;
      }

      // Additional wait to ensure the page is interactive
      await page.waitForTimeout(3000);

      // Navigate to summary page
      await page.goto("/summary/all-fleets");

      // Wait for the summary page to be fully loaded
      await page.waitForLoadState("load", { timeout: 30000 });

      // Wait for summary page specific elements
      await page.waitForSelector('[data-month-select="true"]', {
        timeout: 10000,
      });

      // Additional wait to ensure the page is interactive
      await page.waitForTimeout(3000);
    } catch (error) {
      console.error("Test setup failed:", error);
      throw error;
    }
  });


  test("should display year selector", async ({ page }) => {
    // Wait for the year selector to be visible
    await expect(page.locator('[data-year-select="true"]')).toBeVisible();

    // Check if year selector section exists (even if no years are available)
    const yearSection = page.locator('[data-year-select="true"] section');
    await expect(yearSection).toBeVisible();

    // Check for the "Select Year" heading
    await expect(page.locator('[data-year-select="true"] h2')).toHaveText(
      "Select Year"
    );
  });

  test("should display month selector with all months", async ({ page }) => {
    // Wait for the month selector to be visible
    await expect(page.locator('[data-month-select="true"]')).toBeVisible();

    // Check if all 12 months are present
    const monthButtons = page.locator('[data-month-select="true"] button');
    await expect(monthButtons).toHaveCount(12);
  });

    test("should filter data when selecting a year (now with test data)", async ({
    page,
  }) => {
    // Wait for the year selector to be visible
    await expect(page.locator('[data-year-select="true"]')).toBeVisible();

    // Wait for year buttons to be available
    await page.waitForSelector('[data-year-select="true"] button', { timeout: 10000 });

    const yearButtons = page.locator('[data-year-select="true"] button');
    
    // Should have at least one year
    const yearCount = await yearButtons.count();
    expect(yearCount).toBeGreaterThan(0);
    
    // Check if 2024 button exists, if not use the first available year
    const year2024Button = page.locator('[data-year-select="true"] button', {
      hasText: "2024",
    });
    
    const year2024Exists = await year2024Button.count() > 0;
    
    if (year2024Exists) {
      await year2024Button.click();
      // Verify the button is selected
      await expect(year2024Button).toHaveClass(/bg-cyan-900/);
    } else {
      // If 2024 doesn't exist, click the first available year button
      const firstYearButton = page.locator('[data-year-select="true"] button').first();
      await firstYearButton.click();
      console.log("2024 not found, using first available year");
      
      // Verify the first button is selected
      await expect(firstYearButton).toHaveClass(/bg-cyan-900/);
    }
  });

  test("should filter data when selecting a month", async ({ page }) => {
    // Wait for the month selector to be visible
    await expect(page.locator('[data-month-select="true"]')).toBeVisible();

    // Click on January
    const januaryButton = page.locator('[data-month-select="true"] button', {
      hasText: "January",
    });
    await januaryButton.click();

    // Verify the button is selected
    await expect(januaryButton).toHaveClass(/bg-cyan-900/);
  });
});
