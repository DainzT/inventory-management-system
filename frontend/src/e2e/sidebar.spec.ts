import { test, expect } from "@playwright/test";

test("sidebar navigates to Inventory page", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.click("text=General Stock");
  await expect(page).toHaveURL("http://localhost:3000/");
});

test("sidebar navigates to Orders page", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.click("text=Orders");
  await expect(page).toHaveURL("http://localhost:3000/orders");
});

test("sidebar navigates to Summary page", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.click("text=Monthly Summary");
  await expect(page).toHaveURL("http://localhost:3000/summary");
});
