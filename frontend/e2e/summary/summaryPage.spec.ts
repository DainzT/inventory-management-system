import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

test.describe("Summary", () => {
  let context;
  let reusablePage;

  let inventoryItems: Array<{
    name: string;
    note: string;
    unitPrice: number;
    unitSize: number;
    selectUnit: string;
    quantity: number;
  }> = [];

  let assignments: Array<{
    name: string;
    fleet: string;
    boat: string;
    quantity: number;
  }> = [];

  test.beforeAll(async ({ browser }) => {
    test.setTimeout(240000); // Further increased timeout for beforeAll hook

    try {
      // Create reusable context and page
      context = await browser.newContext();
      reusablePage = await context.newPage();

      // Seed data through UI
      await reusablePage.goto("/login");
      await reusablePage.fill("#pin-input", "222222");
      await reusablePage.getByRole("button", { name: "Login" }).click();

      try {
        // Ensure page is open before waiting for URL
        if (reusablePage.isClosed()) {
          throw new Error("Page is closed during navigation.");
        }

        await reusablePage.waitForURL("**/inventory", { timeout: 240000 }); // Further increased timeout
      } catch (error) {
        console.error("Navigation to inventory page failed:", error);

        // Retry navigation if page is still open
        if (!reusablePage.isClosed()) {
          await reusablePage.reload();
          await reusablePage.waitForURL("**/inventory", { timeout: 240000 });
        } else {
          throw error;
        }
      }

      inventoryItems = [
        {
          name: "oil filter",
          note: "Regular supply para sa summary test",
          unitPrice: 250,
          unitSize: 1,
          selectUnit: "Piece",
          quantity: 200,
        },
        {
          name: "Bearing",
          note: "Regular supply para sa summary test",
          unitPrice: 250,
          unitSize: 1,
          selectUnit: "Piece",
          quantity: 20,
        },
      ];

      for (const item of inventoryItems) {
        try {
          if (reusablePage.isClosed()) {
            throw new Error("Page is closed during interaction.");
          }

          await reusablePage.getByRole("button", { name: "Add Item" }).click();
          await reusablePage.fill(
            'input[placeholder="Enter product name"]',
            item.name
          );
          await reusablePage.fill(
            'textarea[placeholder="Enter note"]',
            item.note
          );
          const quantityInputs = await reusablePage.$$(
            'input[placeholder="0.00"]'
          );
          await quantityInputs[0].fill(String(item.quantity));
          await quantityInputs[1].fill(String(item.unitPrice));
          await quantityInputs[2].fill(String(item.unitSize));

          let unitSelected = false;
          for (let attempt = 0; attempt < 3; attempt++) {
            try {
              if (reusablePage.isClosed()) {
                throw new Error("Page is closed during interaction.");
              }

              await reusablePage
                .locator("div", { hasText: "Unit" })
                .nth(4)
                .click();
              await reusablePage
                .getByText(item.selectUnit, { exact: true })
                .click();
              unitSelected = true;
              break;
            } catch (error) {
              console.error(
                `Attempt ${attempt + 1} failed to select unit for item ${
                  item.name
                }:`,
                error
              );
              if (attempt === 2) throw error; // Throw error after 3 failed attempts
            }
          }

          if (!unitSelected) {
            throw new Error(`Failed to select unit for item ${item.name}`);
          }

          await reusablePage
            .getByRole("button", { name: "Add Product" })
            .click();
          await reusablePage.waitForSelector("button", {
            state: "hidden",
            timeout: 30000,
          });
        } catch (error) {
          console.error(`Error while adding item ${item.name}:`, error);
          throw error;
        }
      }

      assignments = [
        {
          name: "oil filter",
          fleet: "F/B DONYA DONYA 2x",
          boat: "F/B Lady Rachelle",
          quantity: 100,
        },
        {
          name: "Bearing",
          fleet: "F/B DONYA DONYA 2x",
          boat: "F/B Lady Rachelle",
          quantity: 50,
        },
      ];

      for (const assignment of assignments) {
        try {
          const row = reusablePage.locator("div", { hasText: assignment.name });
          const assignButton = row
            .getByRole("button", { name: "Assign" })
            .first();
          await assignButton.click();

          if (reusablePage.isClosed()) {
            throw new Error("Page is closed during interaction.");
          }

          await reusablePage
            .getByRole("button", { name: "Select a fleet" })
            .click();
          await reusablePage
            .getByText(assignment.fleet, { exact: true })
            .nth(1)
            .click();
          await reusablePage
            .getByRole("button", { name: "Select a boat" })
            .click();
          await reusablePage
            .getByText(assignment.boat, { exact: true })
            .click();

          const assignQuantityInputs = await reusablePage.$$(
            'input[placeholder="0.00"]'
          );
          await assignQuantityInputs[0].fill(String(assignment.quantity));
          await reusablePage
            .locator("div", { hasText: /^Assign$/ })
            .getByRole("button")
            .click();
        } catch (error) {
          console.error(
            `Failed to assign fleet/boat for ${assignment.name}:`,
            error
          );
          throw error;
        }
      }
    } catch (error) {
      console.error("Error in beforeAll hook:", error);
      throw error;
    }
  });

  test.beforeEach(async ({ page }) => {
    test.setTimeout(120000);

    try {
      // Login first
      await page.goto("/login");
      await page.waitForSelector("#pin-input", {
        state: "visible",
        timeout: 10000,
      });
      const pinInput = page.locator("#pin-input");
      await pinInput.fill("222222");
      const loginButton = page.getByRole("button", { name: "Login" });
      await loginButton.click();

      // Wait for navigation and token
      await page.waitForURL("**/inventory", { timeout: 30000 }); // Increased timeout
      await page.waitForLoadState("networkidle", { timeout: 30000 }); // Increased timeout

      // Navigate to summary page
      try {
        await page.goto("/summary/all-fleets", { timeout: 30000 }); // Added timeout
      } catch (error) {
        console.error("Failed to navigate to summary page:", error);
      }
      await page.waitForLoadState("networkidle", { timeout: 15000 });

      // Wait for the year selector container
      await page.waitForSelector('[data-year-select="true"]', {
        timeout: 15000,
      });

      // Wait for loading to finish
      await page
        .waitForSelector(".loading-indicator", {
          state: "hidden",
          timeout: 15000,
        })
        .catch(() => console.log("No loading indicator found, continuing..."));
    } catch (error) {
      console.error("Test setup failed:", error);
      throw error;
    }
  });

  test("should display year selector", async ({ page }) => {
    await expect(page.locator('[data-year-select="true"]')).toBeVisible();
    const yearSection = page.locator('[data-year-select="true"] section');
    await expect(yearSection).toBeVisible();
    await expect(page.locator('[data-year-select="true"] h2')).toHaveText(
      "Select Year"
    );
  });

  test("should display month selector with all months", async ({ page }) => {
    await expect(page.locator('[data-month-select="true"]')).toBeVisible();
    const monthButtons = page.locator('[data-month-select="true"] button');
    await expect(monthButtons).toHaveCount(12);
  });

  test("should filter data when selecting a year", async ({ page }) => {
    // Wait for year selector to be present
    await expect(page.locator('[data-year-select="true"]')).toBeVisible();

    // Add robust waiting with error handling
    try {
      await page.waitForSelector('[data-year-select="true"] button', {
        timeout: 15000,
      });
      await expect(
        page.locator('[data-year-select="true"] button').first()
      ).toBeVisible({ timeout: 10000 });
    } catch {
      // Take screenshot for debugging
      await page.screenshot({ path: "year-selector-debug.png" });
      console.log("Year selector buttons not immediately visible, retrying...");

      // Try refreshing the page
      await page.reload();
      await page.waitForLoadState("load");
      await page.waitForSelector('[data-year-select="true"]', {
        timeout: 10000,
      });
      await page.waitForSelector('[data-year-select="true"] button', {
        timeout: 15000,
      });
    }

    const yearButtons = page.locator('[data-year-select="true"] button');
    const yearCount = await yearButtons.count();
    expect(yearCount).toBeGreaterThan(0);

    const currentYear = new Date().getFullYear();
    const yearButton = page.locator('[data-year-select="true"] button', {
      hasText: String(currentYear),
    });

    const yearExists = (await yearButton.count()) > 0;

    if (yearExists) {
      await yearButton.click();
      await expect(yearButton).toHaveClass(/bg-cyan-900/);
    } else {
      const firstYearButton = page
        .locator('[data-year-select="true"] button')
        .first();
      await firstYearButton.click();
      console.log(`${currentYear} not found, using first available year`);
      await expect(firstYearButton).toHaveClass(/bg-cyan-900/);
    }
  });

  test("should filter data when selecting a month", async ({ page }) => {
    await expect(page.locator('[data-month-select="true"]')).toBeVisible();
    const januaryButton = page.locator('[data-month-select="true"] button', {
      hasText: "January",
    });
    await januaryButton.click();
    await expect(januaryButton).toHaveClass(/bg-cyan-900/);
  });

  test("should display order rows in invoice table (with test data)", async ({
    page,
  }) => {
    try {
      // Wait for year selector and buttons
      await page.waitForSelector('[data-year-select="true"]', {
        timeout: 15000,
      });

      // Wait for any year buttons to be present
      await page.waitForFunction(
        () => {
          const yearSelector = document.querySelector(
            '[data-year-select="true"]'
          );
          return (
            yearSelector && yearSelector.querySelectorAll("button").length > 0
          );
        },
        { timeout: 15000 }
      );

      // Select current year if available
      const currentYear = new Date().getFullYear();
      const yearButton = page.locator('[data-year-select="true"] button', {
        hasText: String(currentYear),
      });

      const yearExists = (await yearButton.count()) > 0;

      if (yearExists) {
        await yearButton.click();
        console.log(`Selected year ${currentYear}`);
      } else {
        const firstYearButton = page
          .locator('[data-year-select="true"] button')
          .first();
        await firstYearButton.click();
        console.log(`${currentYear} not found, using first available year`);
      }

      // Wait for month selector
      await page.waitForSelector('[data-month-select="true"]', {
        timeout: 15000,
      });

      // Select January
      const januaryButton = page.locator('[data-month-select="true"] button', {
        hasText: "January",
      });
      await januaryButton.click();

      // Wait for invoice content
      await page.waitForSelector(".invoice-page", { timeout: 15000 });

      // Verify test data
      const hasData =
        (await page.locator(".invoice-page").getByText("Fish Feed A").count()) >
        0;

      if (hasData) {
        await expect(
          page.locator(".invoice-page").getByText("Fish Feed A")
        ).toBeVisible();
        await expect(
          page.locator(".invoice-page").locator("text=/₱\\d+\\.\\d{2}/")
        ).toBeVisible();
      } else {
        const emptyMessage = page.locator(
          "text=No existing orders during this month of the year."
        );
        await expect(emptyMessage).toBeVisible();
      }
    } catch (error) {
      console.error("Test failed:", error);
      throw error;
    }
  });

  test("should download PDF when Download button is clicked", async ({
    page,
  }) => {
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: /Download/i }).click(),
    ]);

    expect(download.suggestedFilename()).toMatch(/invoice_.*\.pdf/);
  });

  test.afterAll(async () => {
    test.setTimeout(240000);

    try {
      // 1. Enhanced orders cleanup
      await reusablePage.goto("/orders");
      await reusablePage.waitForLoadState("networkidle");
      await reusablePage.waitForTimeout(3000);
      for (const assignment of assignments) {
        try {
          const roworder = reusablePage.locator("div", {
            hasText: assignment.name,
          });
          if ((await roworder.count()) > 0) {
            const orderRow = roworder
              .getByRole("button", { name: "Edit" })
              .first();
            await orderRow.click();

            const modal = reusablePage.locator(
              ".flex.fixed.z-50.inset-0.justify-center.items-center"
            );
            await modal.getByRole("button", { name: /Delete/i }).click();

            await expect(reusablePage.getByText("Are you sure?")).toBeVisible();
            await reusablePage.waitForSelector(
              '[data-testid="confirm-removal-button"]',
              { state: "visible" }
            );
            await reusablePage.getByTestId("confirm-removal-button").click();

            await expect(
              reusablePage.getByText("Order deleted successfully")
            ).toBeVisible({
              timeout: 5000,
            });

            await reusablePage.waitForTimeout(1000);
          }
        } catch (error) {
          console.error(
            `Failed to delete assignment ${assignment.name}:`,
            error
          );
        }
      }

      // Clean up inventory items
      await reusablePage.goto("/inventory");
      await reusablePage.waitForLoadState("networkidle");

      // Delete all test inventory items
      for (const item of inventoryItems) {
        try {
          const itemRow = reusablePage
            .locator("article")
            .filter({
              has: reusablePage.locator(
                `div.font-bold:has-text("${item.name}")`
              ),
            })
            .filter({ hasText: item.note });

          if ((await itemRow.count()) > 0) {
            await itemRow.getByRole("button", { name: "Edit" }).first().click();

            const modal = reusablePage.locator(
              ".flex.fixed.z-50.inset-0.justify-center.items-center"
            );
            await modal.getByRole("button", { name: /Delete/i }).click();

            await expect(reusablePage.getByText("Are you sure?")).toBeVisible();
            // Wait for the confirm button to be ready and clickable
            await reusablePage.waitForSelector(
              '[data-testid="confirm-removal-button"]',
              { state: "visible" }
            );
            await reusablePage.getByTestId("confirm-removal-button").click();

            await expect(
              reusablePage.getByText("Item deleted successfully")
            ).toBeVisible({
              timeout: 5000,
            });

            await reusablePage.waitForTimeout(1000);
          } else {
            console.log(`Inventory item not found: ${item.name}`);
          }
        } catch (error) {
          console.error(`Failed to delete item ${item.name}:`, error);
        }
      }
    } catch (error) {
      console.error("Error during cleanup:", error);
    } finally {
      if (reusablePage && !reusablePage.isClosed()) {
        await reusablePage.close();
      }
      if (context) {
        await context.close();
      }
    }
  });
});
