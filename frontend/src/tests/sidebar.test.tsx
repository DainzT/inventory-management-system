import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { SidebarContents } from "@/types/sidebar-contents";

jest.mock("../assets/image/logo.svg", () => "mock-logo");

describe("Sidebar Component", () => {
  const defaultLinks: SidebarContents[] = [
    { path: "/", label: "General Stock", icon: null },
    { path: "/orders", label: "Orders", icon: null },
    { path: "/summary", label: "Monthly Summary", icon: null },
  ];

  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Sidebar sidebarLinks={defaultLinks} showLogo={true} />
      </MemoryRouter>
    );
  });

  it("renders all sidebar links", () => {
    render(
      <MemoryRouter>
        <Sidebar sidebarLinks={defaultLinks} showLogo={true} />
      </MemoryRouter>
    );

    expect(screen.getByText("General Stock")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("Monthly Summary")).toBeInTheDocument();
  });

  it("renders the logo image", () => {
    render(
      <MemoryRouter>
        <Sidebar sidebarLinks={defaultLinks} showLogo={true} />
      </MemoryRouter>
    );

    const logo = screen.getByAltText("Logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "mock-logo");
  });

  it("does not render invalid links", () => {
    render(
      <MemoryRouter>
        <Sidebar sidebarLinks={defaultLinks} showLogo={true} />
      </MemoryRouter>
    );

    expect(screen.queryByText("Invalid Link")).not.toBeInTheDocument();
    expect(screen.queryByText("Non-existent Page")).not.toBeInTheDocument();
  });

  it("renders an empty sidebar if no links are provided", () => {
    render(
      <MemoryRouter>
        <Sidebar sidebarLinks={[]} showLogo={true} />
      </MemoryRouter>
    );

    expect(screen.queryByText("General Stock")).not.toBeInTheDocument();
    expect(screen.queryByText("Orders")).not.toBeInTheDocument();
    expect(screen.queryByText("Monthly Summary")).not.toBeInTheDocument();
  });

  it("handles missing logo correctly", () => {
    render(
      <MemoryRouter>
        <Sidebar sidebarLinks={defaultLinks} showLogo={false} />
      </MemoryRouter>
    );

    expect(screen.queryByAltText("Logo")).not.toBeInTheDocument();
  });
});
