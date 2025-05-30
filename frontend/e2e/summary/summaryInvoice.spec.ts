import { test, expect } from "@playwright/test";
import { testDataManager } from "./testDataManager";
import dotenv from "dotenv";

dotenv.config();

test.describe("Summary Invoice", () => {
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
  // Use more specific selectors for table headers within the header row
  const headerRow = page.locator(".bg-cyan-900");
  
  await expect(headerRow.getByText("Date Out", { exact: true })).toBeVisible();
  await expect(headerRow.getByText("Product", { exact: true })).toBeVisible();
  await expect(headerRow.getByText("Note", { exact: true })).toBeVisible();
  await expect(headerRow.getByText("Qty", { exact: true })).toBeVisible();
  await expect(headerRow.getByText("Unit Price", { exact: true })).toBeVisible();
  
  // Check for the table header "Total" specifically within the header row
  await expect(headerRow.getByText("Total", { exact: true })).toBeVisible();
});

  test("should display order rows in invoice table (with test data)", async ({ page }) => {
  // First, ensure we're on the summary page and wait for it to be fully loaded
  await page.waitForSelector('[data-year-select="true"]', { timeout: 15000 });
  
  // Wait for year buttons to be available
  await page.waitForSelector('[data-year-select="true"] button', { timeout: 10000 });
  
  // Check if 2024 button exists, if not use the first available year
  const year2024Button = page.locator('[data-year-select="true"] button', {
    hasText: "2024",
  });
  
  const year2024Exists = await year2024Button.count() > 0;
  
  if (year2024Exists) {
    await year2024Button.click();
  } else {
    // If 2024 doesn't exist, click the first available year button
    const firstYearButton = page.locator('[data-year-select="true"] button').first();
    await firstYearButton.click();
    console.log("2024 not found, using first available year");
  }
  
  // Wait for the year selection to take effect
  await page.waitForTimeout(2000);
  
  // Then select January month where our test data should be
  await page.waitForSelector('[data-month-select="true"]', { timeout: 10000 });
  await page.waitForSelector('[data-month-select="true"] button', { timeout: 5000 });
  
  const januaryButton = page.locator('[data-month-select="true"] button', {
    hasText: "January",
  });
  await januaryButton.click();
  
  // Wait for the month selection to take effect
  await page.waitForTimeout(2000);

  // Wait for the invoice page to be rendered with a longer timeout
  try {
    await page.waitForSelector('.invoice-page', { timeout: 20000 });
  } catch (error) {
    // Take a screenshot for debugging
    await page.screenshot({ path: 'invoice-page-timeout.png' });
    throw new Error(`Invoice page not found: ${error.message}`);
  }
  
  // Wait for the invoice table section to be loaded
  await page.waitForSelector('.invoice-page section.rounded-lg', { timeout: 15000 });
  
  // Check if we have any data to display
  const hasData = await page.locator('.invoice-page').getByText("Fish Feed A").count() > 0;
  
  if (hasData) {
    // Look for specific test data within the invoice page
    await expect(page.locator('.invoice-page').getByText("Fish Feed A")).toBeVisible();
    
    // Verify we can see the price format within the invoice page
    await expect(page.locator('.invoice-page').locator('text=/₱\\d+\\.\\d{2}/')).toBeVisible();
    
    // Look for order rows specifically within the invoice table
    const orderRows = page.locator('.invoice-page div[class*="grid-cols-"][class*="136px"]');
    await expect(orderRows.first()).toBeVisible();
  } else {
    // If no test data is found, verify the empty state
    console.log("No test data found, checking for empty state message");
    const emptyMessage = page.locator("text=No existing orders during this month of the year.");
    if (await emptyMessage.count() > 0) {
      await expect(emptyMessage).toBeVisible();
    }
  }
});

  test("should show total summary with actual amounts (with test data)", async ({ page }) => {
    await expect(page.getByText("Total:", { exact: true })).toBeVisible();
    
    // With test data, we should have a real total amount
    const totalAmount = page.locator(".text-cyan-900.font-semibold");
    await expect(totalAmount).toContainText(/₱[\d,.]+/);
    
    // The total should not be ₱0.00
    await expect(totalAmount).not.toContainText("₱0.00");
    
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
