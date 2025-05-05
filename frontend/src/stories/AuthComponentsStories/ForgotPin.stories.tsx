import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, waitFor, expect, screen } from "@storybook/test";
import ForgotPin from "@/components/AuthComponents/ForgotPin";
import React from "react";

const meta: Meta<typeof ForgotPin> = {
  title: "Components/ForgotPin",
  component: ForgotPin,
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      const [isOpen, setIsOpen] = React.useState(false);
      return (
        <div>
          <button
            onClick={() => setIsOpen(true)}
            className="text-sm text-cyan-700 underline hover:text-accent-light cursor-pointer flex justify-end"
          >
            Forgot PIN?
          </button>
          {isOpen && <Story args={{ onClose: () => setIsOpen(false) }} />}
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof ForgotPin>;

export const Default: Story = {
  args: {
    onClose: () => {},
  },
};

export const SendOTPWithValidEmail: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    // Mock test email
    const testEmail = "test@example.com";

    // 1. Click the Forgot PIN button to open modal
    const forgotPinButton = canvas.getByText(/Forgot PIN\?/i);
    await userEvent.click(forgotPinButton);
    await delay(500);

    // 2. Verify modal opened
    const modalTitle = await screen.findByText(/Forgot your PIN\?/i);
    expect(modalTitle).toBeInTheDocument();

    // 3. Find and fill email input
    const emailInput = await screen.findByPlaceholderText(/Enter your email/i);
    await userEvent.type(emailInput, testEmail);
    await delay(500);

    // 4. Verify entered email matches mock email
    expect(emailInput).toHaveValue(testEmail);

    // 5. Click send OTP button
    const sendOtpButton = screen.getByText(/Send OTP/i);
    await userEvent.click(sendOtpButton);

    // 6. Wait for OTP fields to appear
    await waitFor(
      () => {
        const otpLabel = screen.getByText(/OTP/i);
        const otpInput = otpLabel.nextElementSibling?.querySelector("input");
        expect(otpInput).toBeInTheDocument();

        const newPinLabel = screen.getByText(/New PIN/i);
        const newPinInput =
          newPinLabel.nextElementSibling?.querySelector("input");
        expect(newPinInput).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // 7. Verify email is still the same (in case component clears it)
    expect(emailInput).toHaveValue(testEmail);
  },
};

export const VerifyOTPWithValidInputs: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    // First send OTP
    const emailInput = canvas.getByRole("input", { name: /email/i });
    await userEvent.type(emailInput, "test@example.com");
    await delay(500);

    const sendOtpButton = canvas.getByText("Send OTP");
    await userEvent.click(sendOtpButton);
    await delay(1000);

    // Then fill OTP and new PIN
    const otpInput = await canvas.findByRole("input", { name: /otp/i });
    await userEvent.type(otpInput, "123456");
    await delay(500);

    const newPinInput = canvas.getByLabelText(/new pin/i);
    await userEvent.type(newPinInput, "654321");
    await delay(500);

    // Click verify button
    const verifyButton = canvas.getByText("Verify OTP");
    await userEvent.click(verifyButton);

    // Verify modal closes
    await waitFor(
      () => {
        expect(screen.queryByText("Forgot your PIN?")).not.toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  },
};

export const VerifyOTPWithInvalidOTP: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    // First send OTP
    const emailInput = canvas.getByPlaceholderText("Enter your email");
    await userEvent.type(emailInput, "test@example.com");
    await delay(500);

    const sendOtpButton = canvas.getByText("Send OTP");
    await userEvent.click(sendOtpButton);
    await delay(1000);

    // Then fill invalid OTP and new PIN
    const otpInput = await canvas.findByPlaceholderText("Enter OTP");
    await userEvent.type(otpInput, "wrong");
    await delay(500);

    const newPinInput = canvas.getByPlaceholderText("Enter new PIN");
    await userEvent.type(newPinInput, "654321");
    await delay(500);

    // Click verify button
    const verifyButton = canvas.getByText("Verify OTP");
    await userEvent.click(verifyButton);

    // Verify error message appears
    await waitFor(
      () => {
        expect(screen.getByText(/invalid otp/i)).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  },
};

export const VerifyOTPWithInvalidPin: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    // First send OTP
    const emailInput = canvas.getByPlaceholderText("Enter your email");
    await userEvent.type(emailInput, "test@example.com");
    await delay(500);

    const sendOtpButton = canvas.getByText("Send OTP");
    await userEvent.click(sendOtpButton);
    await delay(1000);

    // Then fill OTP and invalid new PIN
    const otpInput = await canvas.findByPlaceholderText("Enter OTP");
    await userEvent.type(otpInput, "123456");
    await delay(500);

    const newPinInput = canvas.getByPlaceholderText("Enter new PIN");
    await userEvent.type(newPinInput, "123"); // Too short
    await delay(500);

    // Click verify button
    const verifyButton = canvas.getByText("Verify OTP");
    await userEvent.click(verifyButton);

    // Verify error message appears
    await waitFor(
      () => {
        expect(screen.getByText(/pin must be 6 digits/i)).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  },
};

export const CancelDuringOTPEntry: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    // First send OTP
    const emailInput = canvas.getByPlaceholderText("Enter your email");
    await userEvent.type(emailInput, "test@example.com");
    await delay(500);

    const sendOtpButton = canvas.getByText("Send OTP");
    await userEvent.click(sendOtpButton);
    await delay(1000);

    // Then click cancel
    const cancelButton = canvas.getByText("Cancel");
    await userEvent.click(cancelButton);

    // Verify modal closes
    await waitFor(
      () => {
        expect(screen.queryByText("Forgot your PIN?")).not.toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  },
};

export const LoadingStateDuringOTPSend: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    // Type email
    const emailInput = canvas.getByPlaceholderText("Enter your email");
    await userEvent.type(emailInput, "test@example.com");
    await delay(500);

    // Click send OTP button
    const sendOtpButton = canvas.getByText("Send OTP");
    await userEvent.click(sendOtpButton);

    // Verify loading spinner appears
    await waitFor(
      () => {
        expect(canvas.getByRole("progressbar")).toBeInTheDocument();
      },
      { timeout: 500 }
    );

    await delay(1500); // Wait for loading to complete

    // Verify loading spinner disappears
    await waitFor(
      () => {
        expect(canvas.queryByRole("progressbar")).not.toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  },
};

export const LoadingStateDuringOTPVerification: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    // First send OTP
    const emailInput = canvas.getByPlaceholderText("Enter your email");
    await userEvent.type(emailInput, "test@example.com");
    await delay(500);

    const sendOtpButton = canvas.getByText("Send OTP");
    await userEvent.click(sendOtpButton);
    await delay(1000);

    // Fill OTP and new PIN
    const otpInput = await canvas.findByPlaceholderText("Enter OTP");
    await userEvent.type(otpInput, "123456");
    await delay(500);

    const newPinInput = canvas.getByPlaceholderText("Enter new PIN");
    await userEvent.type(newPinInput, "654321");
    await delay(500);

    // Click verify button
    const verifyButton = canvas.getByText("Verify OTP");
    await userEvent.click(verifyButton);

    // Verify loading spinner appears
    await waitFor(
      () => {
        expect(canvas.getByRole("progressbar")).toBeInTheDocument();
      },
      { timeout: 500 }
    );

    await delay(1500); // Wait for loading to complete

    // Verify loading spinner disappears
    await waitFor(
      () => {
        expect(canvas.queryByRole("progressbar")).not.toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  },
};

export const CloseModalByClickingBackdrop: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    // Find the backdrop and click it
    const backdrop = document.querySelector(".fixed.inset-0.bg-black\\/50");
    if (backdrop) {
      await userEvent.click(backdrop);
    }

    await delay(500);

    // Verify modal closes
    await waitFor(
      () => {
        expect(screen.queryByText("Forgot your PIN?")).not.toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  },
};
