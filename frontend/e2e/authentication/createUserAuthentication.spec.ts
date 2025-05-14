import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();

const TEST_OTP = process.env.E2E_TEST_OTP || "000000";
const TEST_PIN = process.env.PW_TEST_PIN || "222222";
const TEST_EMAIL = "admin@example.com";

test.describe("User Authentication Flow", () => {
  test("should create an admin and log in successfully", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByText("Create Admin Account")).toBeVisible({
      timeout: 10_000,
    });

    // SENDING OTP
    const inputs = page.locator('input[role="textbox"]');
    await inputs.nth(0).fill(TEST_EMAIL);
    await inputs.nth(1).fill(TEST_PIN);
    await inputs.nth(2).fill(TEST_PIN);

    await page
      .getByRole("button", { name: "Send OTP" })
      .click({ timeout: 120_000 });
    expect(page.getByRole("button", { name: "Sending OTP..." })),
      {
        timeout: 120_000,
      };

    // VERIFYNG OTP
    await expect(page.getByText("Verify Your Identity")).toBeVisible({
      timeout: 120_000,
    });
    let otpInput = page.locator("input");
    let otpButton = page.getByRole("button", { name: "Verify OTP" });
    expect(otpInput), { timeout: 15_000 };
    await otpInput.first().click();
    await otpInput.first().fill(TEST_OTP);
    await otpButton.click();

    // LOGGING IN
    const loginPinInput = page.locator("input");
    await loginPinInput.fill(TEST_PIN);
    const filledValue = await loginPinInput.inputValue();
    expect(filledValue).toBe(TEST_PIN);
    await page.getByRole("button").click();
    try {
      await page.waitForURL("**/inventory", { timeout: 15000 });
    } catch (e) {
      const content = await page.content();
      console.log(
        "[DEBUG] Not redirected to /inventory. Page content:\n",
        content
      );
      throw e;
    }
    await expect(
      page.getByText("Main Inventory"),
      "Main Inventory should be visible after login"
    ).toBeVisible({ timeout: 10_000 });
  });
});
