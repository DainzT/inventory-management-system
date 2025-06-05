import Sidebar from "@/layout/Sidebar/Sidebar";
import LoginPage from "@/pages/LoginPage";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, waitFor, expect, screen } from "@storybook/test";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { InventoryPage } from "@/pages";
import { OrderPage } from "@/pages";
import { SummaryPage } from "@/pages";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative min-h-screen flex">
    <aside className="absolute left-0 top-0 h-full w-64 text-black">
      <Sidebar />
    </aside>
    <main className="ml-64 flex-1 p-4">{children}</main>
  </div>
);

const meta: Meta<typeof Sidebar> = {
  title: "Components/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  decorators: [
    () => (
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route path="/inventory" element={<InventoryPage />} />
                  <Route path="/orders" element={<OrderPage />} />
                  <Route path="/summary/all-fleets" element={<SummaryPage />} />
                  <Route path="/summary/:fleetName" element={<SummaryPage />} />
                </Routes>
              </Layout>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  args: {},
};

export const InventoryRender: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inventoryButton = canvas.getByText("Inventory");
    await userEvent.click(inventoryButton);
    await waitFor(() =>
      expect(screen.getByText("Main Inventory")).toBeInTheDocument()
    );
  },
};

export const OrderRender: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const ordersButton = canvas.getByText("Orders");
    await userEvent.click(ordersButton);
    await waitFor(() =>
      expect(screen.getByText("All Fleets")).toBeInTheDocument()
    );
  },
};

export const SummaryAllFleetsRender: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const allFleetButton = canvas.getByText("All Fleets");
    await userEvent.click(allFleetButton);
    await waitFor(() =>
      expect(screen.getByText("ALL FLEETS")).toBeInTheDocument()
    );
  },
};

export const SummaryDONYADONYA2X: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fbDonyaButton = canvas.getByText("F/B DONYA DONYA 2x");
    await userEvent.click(fbDonyaButton);
    await waitFor(() =>
      expect(
        screen.getByText("F/B DONYA DONYA 2x Summary Page")
      ).toBeInTheDocument()
    );
  },
};

export const SummaryDonaLibrada: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fbLibradaButton = canvas.getByText("F/B Doña Librada");
    await userEvent.click(fbLibradaButton);
    await waitFor(() =>
      expect(
        screen.getByText("F/B Doña Librada Summary Page")
      ).toBeInTheDocument()
    );
  },
};

export const CancelLogout: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const logoutButton = canvas.getByText("Logout");
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await userEvent.click(logoutButton);

    await waitFor(() => {
      expect(screen.getByText("Confirm Logout")).toBeInTheDocument();
    });
    await delay(2000);
    const cancelButton = screen.getByText("Cancel");
    await userEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText("Confirm Logout")).not.toBeInTheDocument();
    });
  },
};

export const ConfirmLogout: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const logoutButton = canvas.getByText("Logout");
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await userEvent.click(logoutButton);

    await waitFor(() => {
      expect(screen.getByText("Confirm Logout")).toBeInTheDocument();
    });
    const confirmButton = screen.getByText("Confirm");
    await delay(2000);
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByText("Confirm Logout")).not.toBeInTheDocument();
      expect(screen.getByText("Login Page")).toBeInTheDocument();
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    });
  },
};
