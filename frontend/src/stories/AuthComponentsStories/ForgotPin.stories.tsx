import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { http, HttpResponse, delay } from "msw";
import { expect, userEvent, within } from "@storybook/test";
import ForgotPin from "@/components/authentication/ForgotPin";

export default {
  title: "Auth/ForgotPin",
  component: ForgotPin,
} satisfies Meta<typeof ForgotPin>;

type Story = StoryObj<typeof ForgotPin>;

const ForgotPinWrapper = () => {
  const [showForgotPin, setShowForgotPin] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowForgotPin(true)}
        className="mb-4 text-sm text-cyan-700 underline hover:text-accent-light cursor-pointer"
      >
        Forgot PIN?
      </button>
      {showForgotPin && <ForgotPin onClose={() => setShowForgotPin(false)} />}
    </div>
  );
};

export const Default: Story = {
  render: () => <ForgotPinWrapper />,
  parameters: {
    msw: {
      handlers: [
        http.post("/api/auth/verify-email", () => {
          return HttpResponse.json({ message: "OTP sent successfully" });
        }),
      ],
    },
  },
};

// export const EmailPhase: Story = {
//   render: () => <ForgotPinWrapper />,
//   parameters: {
//     msw: {
//       handlers: [
//         http.post("/api/auth/verify-email", () => {
//           return HttpResponse.json({ message: "OTP sent" });
//         }),
//       ],
//     },
//   },
// };

export const Render: Story = {
  render: () => <ForgotPinWrapper />,
  parameters: {
    msw: {
      handlers: [
        http.post("http://localhost:3000/api/auth/verify-email", () => {
          return HttpResponse.json({
            success: true,
            message: "OTP sent successfully",
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("Forgot PIN?"));

    const modal = within(document.body);
    await userEvent.type(
      modal.getByPlaceholderText("Enter your email"),
      "test@example.com"
    );
    await userEvent.click(modal.getByText("Send OTP"));
    await expect(modal.getByPlaceholderText("Enter OTP")).toBeInTheDocument();
  },
};

// export const ResetPINPhase: Story = {
//   render: () => <ForgotPinWrapper />,
//   parameters: {
//     msw: {
//       handlers: [
//         // Mock that OTP was sent and verified
//         http.post("/api/auth/verify-email", () => {
//           return HttpResponse.json({ message: "OTP sent" });
//         }),
//         http.post("/api/auth/verify-otp", () => {
//           return HttpResponse.json({ message: "OTP verified" });
//         }),
//         http.post("/api/auth/reset-pin", () => {
//           return HttpResponse.json({ message: "PIN reset successful" });
//         }),
//       ],
//     },
//   },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     await userEvent.click(canvas.getByText("Forgot PIN?"));

//     const modal = within(document.body);
//     await userEvent.type(
//       modal.getByPlaceholderText("Enter your email"),
//       "test@example.com"
//     );
//     await userEvent.click(modal.getByText("Send OTP"));
//     await userEvent.type(modal.getByPlaceholderText("Enter OTP"), "123456");
//     await userEvent.click(modal.getByText("Verify OTP"));
//   },
// };

// export const SuccessFlow: Story = {
//   render: () => <ForgotPinWrapper />,
//   parameters: {
//     msw: {
//       handlers: [
//         http.post("/api/auth/verify-email", () =>
//           HttpResponse.json({ message: "OTP sent" })
//         ),
//         http.post("/api/auth/verify-otp", () =>
//           HttpResponse.json({ message: "OTP verified" })
//         ),
//         http.post("/api/auth/reset-pin", () =>
//           HttpResponse.json({ message: "PIN reset" })
//         ),
//       ],
//     },
//   },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     await userEvent.click(canvas.getByText("Forgot PIN?"));

//     const modal = within(document.body);
//     await userEvent.type(
//       modal.getByPlaceholderText("Enter your email"),
//       "test@example.com"
//     );
//     await userEvent.click(modal.getByText("Send OTP"));
//     await userEvent.type(modal.getByPlaceholderText("Enter OTP"), "123456");
//     await userEvent.click(modal.getByText("Verify OTP"));
//     await userEvent.type(modal.getByPlaceholderText("Enter new PIN"), "1234");
//     await userEvent.click(modal.getByText("Reset PIN"));
//   },
// };
