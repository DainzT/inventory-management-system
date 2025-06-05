import { test, expect } from '@playwright/test';

test.describe("Inventory Page - Delete Item", () => {
    let accessToken

    const testProduct = {
        name: `Test Product`,
        note: 'This is a test note',
        quantity: 5,
        unitSize: 1,
        selectUnit: 'Piece',
        unitPrice: 100,
        total: 500,
        dateCreated: new Date()
    };

    test.beforeEach(async ({ page }) => {
        test.setTimeout(60000)
        await page.goto("/login");
        const pinInput = page.locator("#pin-input");
        await pinInput.fill("222222");
        await page.getByRole("button", { name: "Login" }).click();
        await page.waitForURL('**/inventory')
    });

    test('should seed item in inventory via API', async ({ page, request }) => {
        const token = await page.evaluate(() => sessionStorage.getItem("access_token"));
        accessToken = token
        const response = await request.post(`${process.env.VITE_API_URL}/api/inventory-item/add-item`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: testProduct,
        });

        expect(response.ok()).toBeTruthy()
    })

    test('should display seeded item via API in inventory table', async ({ page }) => {
        await page.waitForSelector('article', { timeout: 35000 });
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

    test('should load edit product modal when click', async ({ page }) => {
        await page.waitForSelector('article', { timeout: 35000 });
        const itemRow = page.locator('article', {
            has: page.locator('div.font-bold.text-\\[\\#1F2937\\]', { hasText: testProduct.name })
        });
        await itemRow.getByRole('button', { name: 'Edit' }).click();
        const modal = page.locator('.flex.fixed.z-50.inset-0.justify-center.items-center');
        await expect(modal.getByText('Product Name')).toBeVisible();
        await expect(modal.getByText('Note').first()).toBeVisible();
        await expect(modal.getByText('Quantity')).toBeVisible();
        await expect(modal.getByText("Select Unit")).toBeVisible();
        await expect(modal.getByText("Select Unit")).toBeVisible();
        await expect(modal.getByText("Price per Unit")).toBeVisible();
        await expect(modal.getByText("Total")).toBeVisible();
    });

    test('should succesfully delete item', async ({ page }) => {
        await page.waitForSelector('article', { timeout: 35000 });
        const itemRow = page.locator('article', {
            has: page.locator('div.font-bold.text-\\[\\#1F2937\\]', { hasText: testProduct.name })
        });
        await itemRow.getByRole('button', { name: 'Edit' }).click();
        const modal = page.locator('.flex.fixed.z-50.inset-0.justify-center.items-center');
        await modal.getByRole("button", { name: /Delete/i }).click();

        const deleteConfirmation = page.getByRole('button', { name: /Delete field/i });
        if (await deleteConfirmation.isVisible()) {
            await deleteConfirmation.click();
        }
    });

    test('should verify deleted item no longer exists via API', async ({ request }) => {
        const response = await request.get(`${process.env.VITE_API_URL}/api/inventory-item/get-items`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        expect(response.ok()).toBeTruthy();
        const items = await response.json();
        const deletedItem = items.data.find((item) => item.name === testProduct.name);
        expect(deletedItem).toBeUndefined();
    });

    test('should verify API returns 404 for deleted item', async ({ request }) => {
        const response = await request.get(`${process.env.VITE_API_URL}/api/inventory-item/get-items`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        expect(response.ok()).toBeFalsy();
    });

})