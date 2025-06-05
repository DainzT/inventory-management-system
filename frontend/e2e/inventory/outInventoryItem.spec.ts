import { test, expect } from "@playwright/test";

const PIN = "222222";
const INVENTORY_ITEM = {
  name: "Out Item",
  note: "Test note",
  unitPrice: 123.45,
  unitSize: 2,
  selectUnit: "Box",
  quantity: 10,
};
const ASSIGN = {
  fleet: "F/B DONYA DONYA 2x",
  boat: "F/B Lady Rachelle",
  quantity: 4,
};

test.describe("Out/Assign Item to Orders E2E", () => {
  let accessToken;
  let createdItemId: number;

  test.beforeEach(async ({ page }) => {
    // LOGGIN IN
    await page.goto("/login");
    const pinInput = page.getByRole("textbox", { name: "PIN" });
    await pinInput.fill(PIN);
    await page
      .getByRole("button", { name: "Login" })
      .click({ timeout: 25_000 });
    await expect(page).toHaveURL(/\/inventory/, { timeout: 25_000 });
  });

  test("should add item, assign it, and verify in orders", async ({ page }) => {
    // ADDING ITEM
    await page.getByRole("button", { name: "Add Item" }).click();
    await page.fill(
      'input[placeholder="Enter product name"]',
      INVENTORY_ITEM.name
    );
    await page.fill('textarea[placeholder="Enter note"]', INVENTORY_ITEM.note);
    const quantityInputs = await page.$$('input[placeholder="0.00"]');
    await quantityInputs[0].fill(String(INVENTORY_ITEM.quantity));
    await quantityInputs[1].fill(String(INVENTORY_ITEM.unitPrice));
    await quantityInputs[2].fill(String(INVENTORY_ITEM.unitSize));
    await page.locator("div", { hasText: "Unit" }).nth(4).click();
    await page.getByText("Box", { exact: true }).click();
    await page
      .getByRole("button", { name: "Add Product" })
      .click({ timeout: 25_000 });
    expect(page.getByRole("button", { name: "Add Product" })).toBeHidden({
      timeout: 25_000,
    });

    // ASSIGNING
    const row = page.locator("div", {
      hasText: INVENTORY_ITEM.name,
    });
    await row
      .getByRole("button", { name: "Assign" })
      .click({ timeout: 25_000 });
    await page.getByRole("button", { name: "Select a fleet" }).click();
    await page.getByText(ASSIGN.fleet, { exact: true }).nth(1).click();
    await page.getByRole("button", { name: "Select a boat" }).click();
    await page.getByText(ASSIGN.boat, { exact: true }).click();
    const assignQuantityInputs = await page.$$('input[placeholder="0.00"]');
    await assignQuantityInputs[0].fill(String(ASSIGN.quantity));
    await page
      .locator("div")
      .filter({ hasText: /^Assign$/ })
      .getByRole("button")
      .click();

    // CHECK IF ASSIGNING IS TRUE
    await page
      .getByRole("navigation")
      .getByRole("link", { name: /orders/i })
      .click();
    await expect(page).toHaveURL(/\/orders/);
    await expect(
      page.getByText(INVENTORY_ITEM.name, { exact: true })
    ).toBeVisible({ timeout: 25_000 });
  });

  test("should verify item added exists in DB and via API", async ({
    page,
    request,
  }) => {
    const token = await page.evaluate(() =>
      sessionStorage.getItem("access_token")
    );
    accessToken = token;
    const response = await request.get(
      `${process.env.VITE_API_URL}/api/assigned-item/assign-item`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response.ok()).toBeTruthy();
    const items = await response.json();
    const createdItem = items.data.find(
      (item) => item.name === INVENTORY_ITEM.name
    );
    expect(createdItem).toBeDefined();

    createdItemId = createdItem.id;

    expect(createdItem.note).toBe(INVENTORY_ITEM.note);
    expect(createdItem.quantity).toBe(ASSIGN.quantity);
    expect(createdItem.unitSize).toBe(INVENTORY_ITEM.unitSize);
    expect(createdItem.selectUnit).toBe(INVENTORY_ITEM.selectUnit);
    expect(createdItem.unitPrice).toBe(INVENTORY_ITEM.unitPrice);
    expect(createdItem.fleet.fleet_name).toBe(ASSIGN.fleet);
    expect(createdItem.boat.boat_name).toBe(ASSIGN.boat);
  });

  test.afterAll("cleanup test data", async ({ request }) => {
    if (createdItemId) {
      const deleteResponse = await request.delete(
        `${process.env.VITE_API_URL}/api/modify-item/delete/${createdItemId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      expect(deleteResponse.ok()).toBeTruthy();
    }
    const inventoryRes = await request.get(
      `${process.env.VITE_API_URL}/api/inventory-item/get-items`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (inventoryRes.ok()) {
      const inventoryItems = (await inventoryRes.json()).data;
      const leftover = inventoryItems.find(
        (item) =>
          item.name === INVENTORY_ITEM.name &&
          item.selectUnit === INVENTORY_ITEM.selectUnit &&
          Number(item.unitPrice) === Number(INVENTORY_ITEM.unitPrice)
      );
      if (leftover) {
        const invDelete = await request.delete(
          `${process.env.VITE_API_URL}/api/inventory-item/remove-item/${leftover.id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        expect(invDelete.ok()).toBeTruthy();
      }
    }
  });
});
