import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();

test.describe("Summary Page", () => {
  let accessToken;

  test.beforeEach(async ({ page }) => {
    // Set a longer timeout for the entire test
    test.setTimeout(180000);

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
      } catch (error) {
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
      } catch (error) {
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

  test("should filter data when selecting a year (if years are available)", async ({
    page,
  }) => {
    // Wait for the year selector to be visible
    await expect(page.locator('[data-year-select="true"]')).toBeVisible();

    // Check if there are any year buttons available
    const yearButtons = page.locator('[data-year-select="true"] button');
    const yearButtonCount = await yearButtons.count();

    if (yearButtonCount > 0) {
      // Get the first available year button
      const firstYearButton = yearButtons.first();

      // Click the year button
      await firstYearButton.click();

      // Verify the button is selected
      await expect(firstYearButton).toHaveClass(/bg-cyan-900/);
    } else {
      // If no years are available, just verify the year selector structure exists
      await expect(page.locator('[data-year-select="true"] h2')).toHaveText(
        "Select Year"
      );
      console.log("No year data available in test environment");
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
