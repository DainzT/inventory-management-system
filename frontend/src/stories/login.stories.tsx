import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, waitFor, screen, expect } from "@storybook/test";
import LoginPage from "@/pages/LoginPage";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import InventoryPage from "@/pages/InventoryPage";

const meta: Meta<typeof LoginPage> = {
  title: "Pages/Login",
  component: LoginPage,
  tags: ["autodocs"],
  decorators: [
    () => (
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route
            path="*"
            element={
              <Routes>
                <Route path="/inventory" element={<InventoryPage />} />
              </Routes>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LoginPage>;

export const Default: Story = {
  args: {},
};

export const InputPin: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    const input = canvas.getByLabelText("PIN");
    await userEvent.type(input, "111111");
    await delay(1000);
    const toggleButton = canvas.getByLabelText("Hide PIN");
    await userEvent.click(toggleButton);
    await waitFor(() => expect(input).toHaveValue("111111"));
  },
};

export const PinNotNumber: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    const input = canvas.getByLabelText("PIN");
    await userEvent.type(input, "qwerty");
    const toggleButton = canvas.getByLabelText("Hide PIN");
    await delay(1000);
    await userEvent.click(toggleButton);
    const loginButton = canvas.getByText("Login");
    await delay(1000);
    await userEvent.click(loginButton);
    await delay(2000);
    await waitFor(() => {
      expect(
        screen.getByText("PIN must contain only numbers")
      ).toBeInTheDocument();
    });
  },
};

export const PinNotSixDigits: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    const input = canvas.getByLabelText("PIN");
    await userEvent.type(input, "12345");
    const toggleButton = canvas.getByLabelText("Hide PIN");
    await delay(1000);
    await userEvent.click(toggleButton);
    const loginButton = canvas.getByText("Login");
    await delay(1000);
    await userEvent.click(loginButton);
    await delay(2000);
    await waitFor(() => {
      expect(screen.getByText("PIN must be 6 digits")).toBeInTheDocument();
    });
  },
};

export const PinRevealAndHide: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    const toggleButton = canvas.getByLabelText("Hide PIN");
    await delay(3000);
    await userEvent.click(toggleButton);
    expect(canvas.getByLabelText("Show PIN")).toBeInTheDocument();
  },
};

export const NoPin: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loginButton = canvas.getByText("Login");
    await userEvent.click(loginButton);
    await waitFor(() => {
      expect(screen.getByText("PIN cannot be empty")).toBeInTheDocument();
    });
  },
};

export const IncorrectPin: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    const input = canvas.getByLabelText("PIN");
    await userEvent.type(input, "999999");
    const toggleButton = canvas.getByLabelText("Hide PIN");
    await userEvent.click(toggleButton);
    await delay(1000);
    const loginButton = canvas.getByText("Login");
    await userEvent.click(loginButton);
    await delay(2000);
    await waitFor(() => {
      expect(screen.getByText("Invalid PIN")).toBeInTheDocument();
    });
  },
};

export const Login: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    const input = canvas.getByLabelText("PIN");
    await userEvent.type(input, "111111");
    const loginButton = canvas.getByText("Login");
    await userEvent.click(loginButton);
    await delay(2000);
    await waitFor(() => {
      expect(window.sessionStorage.getItem("token")).toBeTruthy();
      expect(screen.getByText(/Main Inventory/i)).toBeInTheDocument();
    });
  },
};
