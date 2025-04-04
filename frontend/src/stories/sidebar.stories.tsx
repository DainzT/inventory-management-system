import Sidebar from "@/components/Sidebar";
import LoginPage from "@/pages/LoginPage";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within, waitFor, expect, screen } from "@storybook/test";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const InventoryPage = () => (
  <h1 className="text-4xl font-bold">Inventory Page</h1>
);
const OrdersPage = () => <h1 className="text-4xl font-bold">Orders Page</h1>;
const AllFleetsPage = () => (
  <h1 className="text-4xl font-bold">All Fleets Summary Page</h1>
);
const DonyaDonyaPage = () => (
  <h1 className="text-4xl font-bold">F/B DONYA DONYA 2x Summary Page</h1>
);
const DonaLibradaPage = () => (
  <h1 className="text-4xl font-bold">F/B Doña Librada Summary Page</h1>
);

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
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route
                    path="/summary/all-fleets"
                    element={<AllFleetsPage />}
                  />
                  <Route
                    path="/summary/f%2Fb-donya-donya-2x"
                    element={<DonyaDonyaPage />}
                  />
                  <Route
                    path="/summary/f%2Fb-dona-librada"
                    element={<DonaLibradaPage />}
                  />
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

export const ClickItems: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const inventoryButton = canvas.getByText("Inventory");
    await userEvent.click(inventoryButton);
    await waitFor(() =>
      expect(screen.getByText("Inventory Page")).toBeInTheDocument()
    );
    await delay(1000);

    const ordersButton = canvas.getByText("Orders");
    await userEvent.click(ordersButton);
    await waitFor(() =>
      expect(screen.getByText("Orders Page")).toBeInTheDocument()
    );
    await delay(1000);

    const allFleetButton = canvas.getByText("All Fleets");
    await userEvent.click(allFleetButton);
    await waitFor(() =>
      expect(screen.getByText("All Fleets Summary Page")).toBeInTheDocument()
    );
    await delay(1000);

    const fbDonyaButton = canvas.getByText("F/B DONYA DONYA 2x");
    await userEvent.click(fbDonyaButton);
    await waitFor(() =>
      expect(
        screen.getByText("F/B DONYA DONYA 2x Summary Page")
      ).toBeInTheDocument()
    );
    await delay(1000);

    const fbLibradaButton = canvas.getByText("F/B Doña Librada");
    await userEvent.click(fbLibradaButton);
    await waitFor(() =>
      expect(
        screen.getByText("F/B Doña Librada Summary Page")
      ).toBeInTheDocument()
    );
    await delay(1000);

    const logoutButton = canvas.getByText("Logout");
    await userEvent.click(logoutButton);
  },
};

export const CancelLogout: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const logoutButton = canvas.getByText("Logout");
    await userEvent.click(logoutButton);

    await waitFor(() => {
      expect(screen.getByText("Confirm Logout")).toBeInTheDocument();
    });

    const cancelButton = screen.getByText("Cancel");
    await userEvent.hover(cancelButton);
    await delay(1000);
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
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const logoutButton = canvas.getByText("Logout");
    await userEvent.click(logoutButton);

    await waitFor(() => {
      expect(screen.getByText("Confirm Logout")).toBeInTheDocument();
    });

    const confirmButton = screen.getByText("Confirm");
    await userEvent.hover(confirmButton);
    await delay(1000);
    await userEvent.click(confirmButton);

    // Wait for the modal to disappear
    await waitFor(() => {
      expect(screen.queryByText("Confirm Logout")).not.toBeInTheDocument();
    });

    // Ensure redirection happens (in Storybook, MemoryRouter simulates this)
    await waitFor(() => {
      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });

    // Ensure Sidebar is not rendered
    await waitFor(() => {
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    });
  },
};
