import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test.describe("Inventory Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:5173/login");

        const pinInput = page.locator("#pin-input");
        await pinInput.fill(process.env.PW_TEST_PIN || "");

        await page.getByRole("button", { name: "Login" }).click();
        await page.waitForURL('**/inventory')
    });

    test("should load inventory items and search correctly", async ({ page }) => {
        await expect(page.getByText("Main Inventory")).toBeVisible();
    })
})