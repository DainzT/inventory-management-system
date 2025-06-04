import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

test.describe("Order Page Features", () => {

    const testProduct = {
        name: `Test Product for Order`,
        note: 'This is a test note for Order',
        quantity: 5,
        unitSize: 1,
        selectUnit: 'Box',
        unitPrice: 100,
        total: 500,
        dateCreated: new Date()
    }

    const assignmentData = {
        fleet: "F/B DONYA DONYA 2x",
        boat: "F/B Lady Rachelle",
        quantity: 5,
    }

    test.beforeEach(async ({ page }) => {
        test.setTimeout(60000)
        await page.goto("/login")
        const pinInput = page.locator("#pin-input")
        await pinInput.fill("222222")
        await page.getByRole("button", { name: "Login" }).click()
        await page.waitForURL("**/inventory")
    });

    test("should add item in the inventory and assign it to an order", async ({ page }) => {
        await page.getByRole("button", { name: "Add Item" }).click();
            await page.fill(
                'input[placeholder="Enter product name"]',
                testProduct.name
            );
            await page.fill('textarea[placeholder="Enter note"]', testProduct.note);
            const quantityInputs = await page.$$('input[placeholder="0.00"]');
            await quantityInputs[0].fill(String(testProduct.quantity));
            await quantityInputs[1].fill(String(testProduct.unitPrice));
            await quantityInputs[2].fill(String(testProduct.unitSize));
            await page.locator("div", { hasText: "Unit" }).nth(4).click();
            await page.getByText("Box", { exact: true }).click();
            await page
                .getByRole("button", { name: "Add Product" })
                .click({ timeout: 25_000 });
            expect(page.getByRole("button", { name: "Add Product" })).toBeHidden({
                timeout: 25_000,
            });
        
        const row = page.locator("div", {
            hasText: testProduct.name,
            });
            await row
            .getByRole("button", { name: "Assign" })
            .click({ timeout: 25_000 });
            await page.getByRole("button", { name: "Select a fleet" }).click();
            await page.getByText(assignmentData.fleet, { exact: true }).nth(1).click();
            await page.getByRole("button", { name: "Select a boat" }).click();
            await page.getByText(assignmentData.boat, { exact: true }).click();
            const assignQuantityInputs = await page.$$('input[placeholder="0.00"]');
            await assignQuantityInputs[0].fill(String(assignmentData.quantity));
            await page
            .locator("div")
            .filter({ hasText: /^Assign$/ })
            .getByRole("button")
            .click();
    });

    test("should navigate to orders page and display data", async ({ page }) => {
        await page.goto("/orders")
        await page.getByRole("heading", { name: "All Fleets", level: 2 }).waitFor({ state: "visible", timeout: 30000 })

        const orderItem = page.locator("text=" + testProduct.name)
        await expect(orderItem).toBeVisible({ timeout: 10000 })
    });
    
    test("should test fleet card filter", async ({ page }) => {
        await page.goto("/orders")
        await page.getByRole("heading", { name: "All Fleets", level: 2 }).waitFor({ state: "visible", timeout: 30000 })

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
        await page.goto("/orders")
        await page.getByRole("heading", { name: "All Fleets", level: 2 }).waitFor({ state: "visible", timeout: 30000 })

        const filterTrigger = page.getByTestId("filter-dropdown-trigger");
        await filterTrigger.click();

        const targetBoat = "F/B Mariella";
        const optionTestId = `filter-option-${targetBoat.replace(/\s+/g, "-").toLowerCase()}`;
        const option = page.getByTestId(optionTestId);
        await option.click();

        await expect(filterTrigger).toHaveText(targetBoat);
    });

    test("should test boat filter dropdown with fleet card filter", async ({ page }) => {
        await page.goto("/orders")
        await page.getByRole("heading", { name: "All Fleets", level: 2 }).waitFor({ state: "visible", timeout: 30000 })

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
        await page.goto("/orders")
        await page.getByRole("heading", { name: "All Fleets", level: 2 }).waitFor({ state: "visible", timeout: 30000 })

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
        await page.goto("/orders")
        await page.getByRole("heading", { name: "All Fleets", level: 2 }).waitFor({ state: "visible", timeout: 30000 })

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
        await page.goto("/orders")
        await page.getByRole("heading", { name: "All Fleets", level: 2 }).waitFor({ state: "visible", timeout: 60000 })
        
        await page.locator('button:has-text("Edit")').first().click()
        await expect(page.getByText("Edit Order")).toBeVisible()

        const quantityInput = page.locator('input[type="number"]')
        await quantityInput.clear()
        await quantityInput.fill("3")

        await page.locator('button[aria-label="Close dialog"]').click()

        await expect(page.getByText("You have unsaved changes")).toBeVisible()

        await page.getByRole("button", { name: "Discard changes" }).click()

        await expect(page.getByText("Edit Order")).not.toBeVisible()
    });

    test("should modify an order and confirm changes", async ({ page }) => {
        await page.goto("/orders")
        await page.getByRole("heading", { name: "All Fleets", level: 2 }).waitFor({ state: "visible", timeout: 30000 })

        await page.locator('button:has-text("Edit")').first().click()

        await expect(page.getByText("Edit Order")).toBeVisible()

        const quantityInput = page.locator('input[type="number"]')
        await quantityInput.clear()
        await quantityInput.fill("1")

        await page.getByRole("button", { name: "Confirm Changes" }).click()

        await expect(page.getByText("Assigned Item updated successfully")).toBeVisible({ timeout: 60000 })
    });

    test("should delete an order", async ({ page }) => {
        await page.goto("/orders")
        await page.getByRole("heading", { name: "All Fleets", level: 2 }).waitFor({ state: "visible", timeout: 30000 })

        await page.locator('button:has-text("Edit")').first().click()

        await expect(page.getByText("Edit Order")).toBeVisible()

        await page.getByRole("button", { name: "Delete" }).click()

        await expect(page.getByText("Are you sure you want to remove this item from your order?")).toBeVisible()

        await page.getByTestId("confirm-removal-button").click()

        await expect(page.getByText("Edit Order")).not.toBeVisible()

        await expect(page.getByText("Assigned Item deleted successfully")).toBeVisible({ timeout: 5000 })

    });

    test("should navigate to inventory and delete inventory", async ({ page }) => {
        await page.goto("/inventory")
        await page.getByRole("heading", { name: "Inventory", level: 2 }).waitFor({ state: "visible", timeout: 30000 })

        const itemRow = page.locator('article', {
            has: page.locator('div.font-bold.text-\\[\\#1F2937\\]', { hasText: testProduct.name })
        });

        await itemRow.getByRole('button', { name: 'Edit' }).click();
        const modal = page.locator('.flex.fixed.z-50.inset-0.justify-center.items-center');
        await modal.getByRole("button", { name: /Delete/i }).click();

        await expect(page.getByText("Are you sure?")).toBeVisible()

        await page.getByTestId("confirm-removal-button").click()

        await expect(page.getByText("Item deleted successfully")).toBeVisible({ timeout: 5000 })
    })
});