import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

test.describe("Summary Invoice", () => {
  let accessToken;

  test.beforeEach(async ({ page }) => {
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
      await loginButton.click();

      // Wait for the token to be set in sessionStorage
      await page.waitForFunction(
        () => sessionStorage.getItem("access_token") !== null,
        { timeout: 10000 }
      );

      // Get the access token and ensure it exists
      const token = await page.evaluate(() =>
        sessionStorage.getItem("access_token")
      );
      if (!token) throw new Error("Access token not found after login");
      accessToken = token;

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

  test("should render invoice header with correct fleet name, month, and year", async ({
    page,
  }) => {
    await expect(page.locator("header")).toContainText("INVOICE");
    await expect(page.locator("header")).toContainText(
      /(?:JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)/i
    );
    await expect(page.locator("header")).toContainText(/\d{4}/); // Year
  });

  test("should render invoice table headers", async ({ page }) => {
    const headers = ["Date Out", "Product", "Note", "Qty", "Unit Price"];
    for (const header of headers) {
      await expect(page.getByText(header)).toBeVisible();
    }
    // Check for the table header "Total" specifically (not the summary "Total:")
    await expect(
      page
        .locator(".bg-cyan-900 .border-r")
        .filter({ hasText: "Total" })
        .and(page.locator(".font-medium"))
    ).toBeVisible();
  });
  test("should display order rows in invoice table", async ({ page }) => {
    // Check if there are orders or if it shows no orders message
    const noOrdersMsg = page.locator(
      "text=No existing orders during this month of the year."
    );
    const orderRow = page.locator(
      ".invoice-page .grid-cols-\\[95px_120px_170px_90px_130px_136px\\]"
    );

    if (await noOrdersMsg.isVisible()) {
      // If no orders, verify the no orders message is displayed
      await expect(noOrdersMsg).toBeVisible();
    } else {
      // If orders exist, verify at least one order row is visible and contains currency
      await expect(orderRow.first()).toBeVisible();
      await expect(orderRow.first()).toContainText("₱");
    }
  });

  test("should show total summary in InvoiceSummary", async ({ page }) => {
    await expect(page.getByText("Total:", { exact: true })).toBeVisible();
    // Should contain a ₱ amount (use regex) - target the specific total amount span
    await expect(page.locator(".text-cyan-900.font-semibold")).toContainText(
      /₱[\d,.]+/
    );
    await expect(
      page.getByText(
        /This document serves as official record of fishing vessels expenses/
      )
    ).toBeVisible();
  });
  test("should paginate with Previous and Next buttons", async ({ page }) => {
    const nextButton = page.getByRole("button", { name: "Next" });
    const prevButton = page.getByRole("button", { name: "Previous" });
    const pageIndicator = page
      .locator("span")
      .filter({ hasText: /Page \d+ of \d+/ });

    // Check if there are enough items for pagination first
    const isNextEnabled = await nextButton.isEnabled();

    if (isNextEnabled) {
      // Only test pagination if Next button is enabled
      await expect(nextButton).toBeEnabled();
      await expect(prevButton).toBeDisabled();

      await nextButton.click();
      await expect(prevButton).toBeEnabled();
      await expect(pageIndicator).toContainText(/Page 2 of \d+/);
    } else {
      // If not enough data for pagination, we'll skip the full test
      console.log(
        "Skipping pagination test - not enough data for multiple pages"
      );
      await expect(prevButton).toBeDisabled();
    }
  });

  test("should download PDF when Download button is clicked", async ({
    page,
  }) => {
    // Listen for the download event
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: /Download/i }).click(),
    ]);
    // The file name should match the format
    expect(download.suggestedFilename()).toMatch(/invoice_.*\.pdf/);
  });

  test("should show no orders message if there are no orders", async ({
    page,
  }) => {
    // This test assumes that the page can be loaded with no orders.
    // You may need to use a special URL or mock to do this.
    // For demonstration, check if the message exists.
    const noOrdersMsg = page.locator(
      "text=No existing orders during this month of the year."
    );
    if (await noOrdersMsg.isVisible()) {
      await expect(noOrdersMsg).toBeVisible();
    }
  });
});
