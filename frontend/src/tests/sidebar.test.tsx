import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { SidebarContents } from "@/types/sidebar-contents";

jest.mock("../assets/image/businessLogo.svg", () => "mocked-logo");

const mockSidebarLinks: SidebarContents[] = [
  { path: "/", label: "Main Inventory", icon: <span>📦</span> },
  { path: "/orders", label: "Orders", icon: <span>📜</span> },
  { path: "/summary/all-fleets", label: "All Fleets" },
  { path: "/summary/fleet-1", label: "Fleet 1" },
  { path: "/summary/fleet-2", label: "Fleet 2" },
];

describe("Sidebar Component", () => {
  test("renders sidebar links correctly", () => {
    render(
      <MemoryRouter>
        <Sidebar sidebarLinks={mockSidebarLinks} showLogo={true} />
      </MemoryRouter>
    );

    expect(screen.getByText("Main Inventory")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getAllByText("All Fleets")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Fleet 1")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Fleet 2")[0]).toBeInTheDocument();
  });

  test("renders business logo when showLogo is true", () => {
    render(
      <MemoryRouter>
        <Sidebar sidebarLinks={mockSidebarLinks} showLogo={true} />
      </MemoryRouter>
    );
    expect(screen.getByAltText("Logo")).toBeInTheDocument();
  });

  test("highlights active link when clicked", () => {
    render(
      <MemoryRouter>
        <Sidebar sidebarLinks={mockSidebarLinks} showLogo={false} />
      </MemoryRouter>
    );

    const inventoryLink = screen.getByText("Main Inventory");
    fireEvent.click(inventoryLink);
    expect(inventoryLink).toHaveClass("bg-accent text-white");
  });

  test("does not highlight inactive links", () => {
    render(
      <MemoryRouter>
        <Sidebar sidebarLinks={mockSidebarLinks} showLogo={false} />
      </MemoryRouter>
    );

    const ordersLink = screen.getByText("Orders");
    expect(ordersLink).not.toHaveClass("bg-accent text-white");
  });

  test("does not render a non-existent link", () => {
    render(
      <MemoryRouter>
        <Sidebar sidebarLinks={mockSidebarLinks} showLogo={false} />
      </MemoryRouter>
    );

    expect(screen.queryByText("Non-Existent Link")).not.toBeInTheDocument();
  });
});
