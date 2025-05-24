import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

test.describe("Order Page Features", () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the login page
        await page.goto("/login");

        // Log in using the PIN
        const pinInput = page.locator("#pin-input");
        await pinInput.fill("222222");

        await page.getByRole("button", { name: "Login" }).click();

        const failedFetchMessage = page.locator('text=Failed to fetch');
        if (await failedFetchMessage.isVisible()) {
            throw new Error("Login failed: Backend API is not responding.");
        }

        await page.waitForURL('**/inventory', { timeout: 120000 });

        await page.goto("/orders", { timeout: 120000 });
        await page.getByRole('heading', { name: 'All Fleets', level: 2 }).waitFor({ state: 'visible', timeout: 30000 });
    });
    
    test("should test fleet card filter", async ({ page }) => {
        const donyaDonyaCard = page.getByRole('article').filter({ hasText: 'F/B DONYA DONYA 2X' });
        await donyaDonyaCard.click();

        const donyaDonyaHeading = page.locator('h2[class*="text-[36px]"]').filter({ hasText: 'F/B DONYA DONYA 2X' });
        await expect(donyaDonyaHeading).toBeVisible();

        const donyaLibradaCard = page.getByRole('article').filter({ hasText: 'F/B Doña Librada' });
        await donyaLibradaCard.click();

        const donyaLibradaHeading = page.locator('h2[class*="text-[36px]"]').filter({ hasText: 'F/B Doña Librada' });
        await expect(donyaLibradaHeading).toBeVisible();
    });
    
    test("should test boat filter dropdown", async ({ page }) => {
        const filterTrigger = page.getByTestId("filter-dropdown-trigger");
        await filterTrigger.click();

        const targetBoat = "F/B Mariella";
        const optionTestId = `filter-option-${targetBoat.replace(/\s+/g, "-").toLowerCase()}`;
        const option = page.getByTestId(optionTestId);
        await option.click();

        await expect(filterTrigger).toHaveText(targetBoat);
    });

    test("should test boat filter dropdown with fleet card filter", async ({ page }) => {
        const donyaLibradaFleetCard = page.getByRole('article').filter({ hasText: 'F/B Doña Librada' });
        await donyaLibradaFleetCard.click();

        const donyaLibradaHeader = page.locator('h2[class*="text-[36px]"]').filter({ hasText: 'F/B Doña Librada' });
        await expect(donyaLibradaHeader).toBeVisible();

        const filterTrigger1 = page.getByTestId("filter-dropdown-trigger");
        await filterTrigger1.click();

        const targetBoatVS = "F/V Vadeo Scout";
        const optionTestIdDL = `filter-option-${targetBoatVS.replace(/\s+/g, "-").toLowerCase()}`;
        const optionDL = page.getByTestId(optionTestIdDL);
        await optionDL.click();

        await expect(filterTrigger1).toHaveText(targetBoatVS);

        const donyaDonyaFleetCard = page.getByRole('article').filter({ hasText: 'F/B DONYA DONYA 2X' });
        await donyaDonyaFleetCard.click();

        const donyaDonyaHeader = page.locator('h2[class*="text-[36px]"]').filter({ hasText: 'F/B DONYA DONYA 2X' });
        await expect(donyaDonyaHeader).toBeVisible();

        const filterTrigger = page.getByTestId("filter-dropdown-trigger");
        await filterTrigger.click();

        const targetBoat = "F/B Mariella";
        const optionTestIdDD = `filter-option-${targetBoat.replace(/\s+/g, "-").toLowerCase()}`;
        const optionDD = page.getByTestId(optionTestIdDD);
        await optionDD.click();

        await expect(filterTrigger).toHaveText(targetBoat);
    });

    test("should test expanded order details", async ({ page }) => {
        const orderRow = page.locator('[data-testid^="order-row-"]').first();
        await expect(orderRow).toBeVisible({ timeout: 10000 });

        const expandButton = orderRow.locator('[data-testid^="expand-order-"]');
        await expandButton.waitFor({ state: 'visible', timeout: 10000 });

        await expandButton.click();

        const totalPrice = page.getByTestId("total-price");
        await expect(totalPrice).toBeVisible();
        await expect(totalPrice).toHaveText(/₱\d+(,\d{3})*(\.\d{2})?/); 

        const fleetName = page.getByTestId("fleet-name");
        await expect(fleetName).toBeVisible();
        await expect(fleetName).not.toHaveText("");

        const lastUpdated = page.getByTestId("last-updated");
        await expect(lastUpdated).toBeVisible();
        await expect(lastUpdated).not.toHaveText("");

        await expandButton.click();

        await expect(totalPrice).toBeHidden();
    });

    test("should test searching for item", async ({ page }) => {
        const firstItemName = await page.locator(".orders-table-content .grid .text-gray-800").first().textContent()

        expect(firstItemName).toBeTruthy()

        if (firstItemName) {
        const searchTerm = firstItemName.split(" ")[0]

        await page.getByPlaceholder("Search Items...").fill(searchTerm)

        await page.waitForTimeout(500)

        const searchResults = page.locator(".orders-table-content .grid")
        await expect(searchResults.first()).toContainText(searchTerm, { ignoreCase: true })

        await page.getByPlaceholder("Search Items...").clear()
        }
    });

    test("should open modify modal and handle unsaved changes", async ({ page }) => {

    await page.locator('button:has-text("Edit")').first().click()

    await expect(page.getByText("Edit Order")).toBeVisible()

    await page.locator('button[aria-label="Close dialog"]').click()

    await expect(page.getByText("Edit Order")).not.toBeVisible()

    await page.locator('button:has-text("Edit")').first().click()

    const quantityInput = page.locator('input[type="number"]')
    await quantityInput.clear()
    await quantityInput.fill("5")

    await page.locator('button[aria-label="Close dialog"]').click()

    await expect(page.getByText("You have unsaved changes")).toBeVisible()

    await page.getByRole("button", { name: "Cancel" }).click()

    await expect(page.getByText("Edit Order")).toBeVisible()

    await page.locator('button[aria-label="Close dialog"]').click()
    await page.getByRole("button", { name: "Discard changes" }).click()

    await expect(page.getByText("Edit Order")).not.toBeVisible()
  })

  test("should modify an order and confirm changes", async ({ page }) => {
    await page.locator('button:has-text("Edit")').first().click()

    await expect(page.getByText("Edit Order")).toBeVisible()

    const quantityInput = page.locator('input[type="number"]')
    await quantityInput.clear()
    await quantityInput.fill("10")

    await page.locator('button:has-text("Select a fleet")').click()
    await page.getByText("F/B DONYA DONYA 2x").click()

    await page.locator('button:has-text("Select a boat")').click()
    await page.getByText("F/B Lady Rachelle").click()

    await page.getByRole("button", { name: "Confirm Changes" }).click()

    await expect(page.getByText("Edit Order")).not.toBeVisible()

    await expect(page.getByText("Order updated successfully")).toBeVisible({ timeout: 5000 })
  })

  test("should delete an order", async ({ page }) => {

    const initialOrderCount = await page.locator('button:has-text("Edit")').count()

    await page.locator('button:has-text("Edit")').first().click()

    await expect(page.getByText("Edit Order")).toBeVisible()

    await page.getByRole("button", { name: "Delete" }).click()

    await expect(page.getByText("Are you sure you want to remove this item from your order?")).toBeVisible()

    await page.getByTestId("confirm-removal-button").click()

    await expect(page.getByText("Edit Order")).not.toBeVisible()

    await expect(page.getByText("Order removed successfully")).toBeVisible({ timeout: 5000 })

    await page.waitForTimeout(1000) 
    const newOrderCount = await page.locator('button:has-text("Edit")').count()
    expect(newOrderCount).toBeLessThan(initialOrderCount)
  })

  test("should handle pagination", async ({ page }) => {
    const hasPagination = await page.locator("text=Previous").isVisible()

    if (hasPagination) {
      const firstItemText = await page.locator(".orders-table-content .grid").first().textContent()

      await page.getByText("Next").click()

      await page.waitForTimeout(500)

      const secondPageFirstItemText = await page.locator(".orders-table-content .grid").first().textContent()

      expect(firstItemText).not.toEqual(secondPageFirstItemText)

      await page.getByText("Previous").click()

      await page.waitForTimeout(500)
      const backToFirstItemText = await page.locator(".orders-table-content .grid").first().textContent()
      expect(backToFirstItemText).toEqual(firstItemText)
    }
  })
});