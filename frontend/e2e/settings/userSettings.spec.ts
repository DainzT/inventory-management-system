import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();

test.describe("User Settings Flow", () => {
  test("should reset PIN, log in, change PIN, and update email", async ({
    page,
  }) => {
    // Navigate to the login page
    await page.goto("/login");

    // Open Forgot PIN modal
    await page.getByText("Forgot PIN?").click();
    await expect(page.getByText("Forgot your PIN?")).toBeVisible();

    // Fill in Forgot PIN form
    await page.fill(
      'input[placeholder="Enter your email"]',
      "admin@example.com"
    );
    await page.getByRole("button", { name: "Send OTP" }).click();
    await expect(page.getByText("OTP sent to email.")).toBeVisible();

    // Simulate entering OTP and resetting PIN
    await page.fill('input[placeholder="Enter OTP"]', "123456");
    await page.getByRole("button", { name: "Verify OTP" }).click();
    await page.fill('input[placeholder="Enter new PIN"]', "654321");
    await page.getByRole("button", { name: "Reset PIN" }).click();
    await expect(page.getByText("PIN reset successfully.")).toBeVisible();

    // Log in with the new PIN
    await page.fill("#pin-input", "654321");
    await page.getByRole("button", { name: "Login" }).click();
    await page.waitForURL("**/inventory");
    await expect(page.getByText("Main Inventory")).toBeVisible();

    // Open Change PIN modal
    await page.goto("/settings"); // Replace with actual settings page URL
    await page.getByText("Change PIN").click();
    await expect(page.getByText("Change PIN")).toBeVisible();

    // Change PIN
    await page.fill('input[placeholder="Enter current PIN"]', "654321");
    await page.getByRole("button", { name: "Verify PIN" }).click();
    await page.fill('input[placeholder="Enter new PIN"]', "123456");
    await page.getByRole("button", { name: "Update PIN" }).click();
    await expect(page.getByText("PIN changed successfully.")).toBeVisible();

    // Log in with the updated PIN
    await page.goto("/login");
    await page.fill("#pin-input", "123456");
    await page.getByRole("button", { name: "Login" }).click();
    await page.waitForURL("**/inventory");
    await expect(page.getByText("Main Inventory")).toBeVisible();

    // Open Change Email modal
    await page.goto("/settings"); // Replace with actual settings page URL
    await page.getByText("Change Email").click();
    await expect(page.getByText("Change Email")).toBeVisible();

    // Change Email
    await page.fill('input[placeholder="Enter current PIN"]', "123456");
    await page.getByRole("button", { name: "Verify PIN" }).click();
    await page.fill(
      'input[placeholder="Enter your current email"]',
      "admin@example.com"
    );
    await page.getByRole("button", { name: "Send OTP" }).click();
    await page.fill('input[placeholder="Enter OTP"]', "123456");
    await page.getByRole("button", { name: "Verify OTP" }).click();
    await page.fill(
      'input[placeholder="Enter new email"]',
      "newadmin@example.com"
    );
    await page.getByRole("button", { name: "Change Email" }).click();
    await expect(page.getByText("Email updated successfully.")).toBeVisible();
  });
});
