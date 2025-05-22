import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test.describe("Inventory Page - Add Item", () => {
    let testProductId: number;
    let accessToken
    const testProduct = {
        name: `Test Product`,
        note: 'This is a test note',
        quantity: 5,
        unitSize: 1,
        selectUnit: 'Piece',
        unitPrice: 100,
        total: 500,
    };

    test.beforeEach(async ({ page }) => {
        test.setTimeout(60000)
        await page.goto("/login");
        const pinInput = page.locator("#pin-input");
        await pinInput.fill("222222");
        await page.getByRole("button", { name: "Login" }).click();
        await page.waitForURL('**/inventory')
    });

    test('should load empty table', async ({ page }) => {
        await expect(page.getByText('Inventory is empty or no items match your search criteria.')).toBeVisible();
    })

    test('should load add product modal when click', async ({ page }) => {
        await page.getByRole("button", { name: "Add Item" }).click();
        const modal = page.locator('.flex.fixed.z-50.inset-0.justify-center.items-center');
        await expect(modal.getByText('Product Name')).toBeVisible();
        await expect(modal.getByText('Note')).toBeVisible();
        await expect(modal.getByText('Quantity')).toBeVisible();
        await expect(modal.getByText("Select Unit")).toBeVisible();
        await expect(modal.getByText("Select Unit")).toBeVisible();
        await expect(modal.getByText("Price per Unit")).toBeVisible();
        await expect(modal.getByText("Total")).toBeVisible();
    });

    test('should show validation error', async ({ page }) => {
        await page.getByRole("button", { name: "Add Item" }).click();
        const modal = page.locator('.flex.fixed.z-50.inset-0.justify-center.items-center');
        await modal.getByRole("button", { name: /Add Product/i }).click();
        await expect(modal.getByText('Product name is required.')).toBeVisible();
        await expect(modal.getByText('Note is required.')).toBeVisible();
        await expect(modal.getByText('Enter a valid quantity.')).toBeVisible();
        await expect(modal.getByText('Please select a unit.')).toBeVisible();
        await expect(modal.getByText('Enter a valid price.')).toBeVisible();
        await expect(modal.getByText('Enter a valid unit size.')).toBeVisible();
    });

    test('should sucessfully add item', async ({ page }) => {
        await page.getByRole("button", { name: "Add Item" }).click();
        const modal = page.locator('.flex.fixed.z-50.inset-0.justify-center.items-center');
        const nameInput = modal.locator('input[type="text"]').first();
        await nameInput.fill(testProduct.name);
        await expect(nameInput).toHaveValue(testProduct.name);

        const noteTextarea = modal.locator('textarea');
        await noteTextarea.fill('This is a test note');
        await expect(noteTextarea).toHaveValue('This is a test note');

        const quantityInput = page.locator('input[type="number"]').first();
        await quantityInput.fill('5')
        await expect(quantityInput).toHaveValue('5');

        const unitSelector = modal.locator('span').filter({ hasText: 'Unit' }).nth(1);
        await unitSelector.click();
        const unitOption = modal.locator('div').filter({ hasText: 'Piece' }).nth(4);
        await unitOption.click();

        const priceInput = modal.locator('input[type="number"]').nth(1);
        await priceInput.fill('100');
        await expect(priceInput).toHaveValue('100');

        const unitSizeInput = modal.locator('input[type="number"]').nth(2);
        await unitSizeInput.fill('1');
        await expect(unitSizeInput).toHaveValue('1');

        const totalInput = modal.locator('input[readonly]').first();
        await expect(totalInput).toHaveValue('500');
        await modal.getByRole("button", { name: /Add Product/i }).click();
    });

    test('should display newly added item in inventory table', async ({ page }) => {
        await page.waitForSelector('article', {timeout: 35000});
        const itemRow = page.locator('article', {
            has: page.locator('div.font-bold.text-\\[\\#1F2937\\]', { hasText: testProduct.name })
        });
        await expect(itemRow).toBeVisible({ timeout: 35000 });
        await expect(itemRow).toContainText('This is a test note');
        await expect(itemRow).toContainText('5 Pieces');
        await expect(itemRow).toContainText(/₱100\.00 \/ 1 Piece/);
        await expect(itemRow.getByRole('button', { name: 'Assign' })).toBeVisible();
        await expect(itemRow.getByRole('button', { name: 'Edit' })).toBeVisible();
    });

    test('should exist in inventory after reload', async ({ page }) => {
        await page.reload();
        await page.waitForSelector('article', {timeout: 35000});
        const itemRow = page.locator('article', {
            has: page.locator('div.font-bold.text-\\[\\#1F2937\\]', { hasText: testProduct.name })
        });
        await expect(itemRow).toBeVisible({ timeout: 35000 });
        await expect(itemRow).toContainText('This is a test note');
        await expect(itemRow).toContainText('5 Pieces');
        await expect(itemRow).toContainText(/₱100\.00 \/ 1 Piece/);
        await expect(itemRow.getByRole('button', { name: 'Assign' })).toBeVisible();
        await expect(itemRow.getByRole('button', { name: 'Edit' })).toBeVisible();
    })

    test('should verify item added exists in DB and via API', async ({ page, request }) => {
        const token = await page.evaluate(() => sessionStorage.getItem("access_token"));
        accessToken = token
        const response = await request.get(`${process.env.VITE_API_URL}/api/inventory-item/get-items`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        expect(response.ok()).toBeTruthy()
        const items = await response.json();
        const createdItem = items.data.find(item => item.name === testProduct.name);
        expect(createdItem).toBeDefined();

        testProductId = createdItem.id;

        expect(createdItem.note).toBe(testProduct.note);
        expect(createdItem.quantity).toBe(testProduct.quantity);
        expect(createdItem.unitSize).toBe(testProduct.unitSize);
        expect(createdItem.selectUnit).toBe(testProduct.selectUnit);
        expect(createdItem.unitPrice).toBe(testProduct.unitPrice);
    });

    test.afterAll('cleanup test data', async ({ request }) => {
        if (testProductId) {
            const deleteResponse = await request.delete(
                `${process.env.VITE_API_URL}/api/inventory-item/remove-item/${testProductId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            expect(deleteResponse.ok()).toBeTruthy();
        }
    });
});

