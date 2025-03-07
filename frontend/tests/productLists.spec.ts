import { test, expect } from "@playwright/test";

test("should display products", async ({ page }) => {
  await page.goto("http://localhost:5173");
  await expect(page.getByText("Loading...")).toBeVisible();
  await expect(page.getByRole("listitem")).toBeVisible();
});
