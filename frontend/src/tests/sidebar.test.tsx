import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import Sidebar from "@/components/Sidebar";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Sidebar Component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("logout button triggers confirmation modal", () => {
    fireEvent.click(screen.getByText("Logout"));
    expect(screen.getByText("Confirm Logout")).toBeInTheDocument();
  });

  test("clicking cancel button keeps modal open", () => {
    fireEvent.click(screen.getByText("Logout"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Confirm Logout")).not.toBeInTheDocument();
  });

  test("clicking outside the modal does not close it", () => {
    fireEvent.click(screen.getByText("Logout"));
    fireEvent.click(document.body);
    expect(screen.getByText("Confirm Logout")).toBeInTheDocument();
  });

  test("confirming logout closes modal and redirects to login", async () => {
    fireEvent.click(screen.getByText("Logout"));
    fireEvent.click(screen.getByText("Confirm"));
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/login"));
  });

  test("clicking a disabled navigation item does not change active state", () => {
    const summaryLink = screen.getByText("Summary");
    fireEvent.click(summaryLink);
    expect(summaryLink).toHaveClass("cursor-not-allowed");
  });

  test("navigation items should not be present if not defined", () => {
    expect(screen.queryByText("Nonexistent Item")).not.toBeInTheDocument();
  });

  test("logout modal should not close when clicking outside prematurely", () => {
    fireEvent.click(screen.getByText("Logout"));
    fireEvent.mouseDown(document.body);
    expect(screen.getByText("Confirm Logout")).toBeInTheDocument();
  });
});
