import { test, expect } from "@playwright/test";

test("Inventory page loads correctly", async ({ page }) => {
  await page.goto("/");
  const title = await page.textContent("h1");
  expect(title).toBe("General Stock");
});

test("Orders page loads correctly", async ({ page }) => {
  await page.goto("/orders");
  const title = await page.textContent("h1");
  expect(title).toBe("Orders");
});

test("Summary page loads correctly", async ({ page }) => {
  await page.goto("/summary");
  const title = await page.textContent("h1");
  expect(title).toBe("Monthly Summary");
});
