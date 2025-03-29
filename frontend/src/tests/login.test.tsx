import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import { login } from "@/api/authAPI";
import "@testing-library/jest-dom";

jest.mock("@/api/authAPI", () => ({
  login: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("LoginPage", () => {
  it("renders login page correctly", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Welcome, Admin!")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("shows error when PIN is incorrect", async () => {
    (login as jest.Mock).mockRejectedValue(new Error("Invalid PIN"));

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("PIN"), {
      target: { value: "wrongpin" },
    });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() =>
      expect(screen.getByText("Invalid PIN")).toBeInTheDocument()
    );
  });

  it("navigates to inventory on successful login", async () => {
    const mockNavigate = jest.fn();
    (login as jest.Mock).mockResolvedValue({ token: "mocked-jwt-token" });

    jest
      .spyOn(require("react-router-dom"), "useNavigate")
      .mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("PIN"), {
      target: { value: "654321" },
    });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/inventory")
    );
  });

  it("shows error when the login API fails (e.g., server error)", async () => {
    (login as jest.Mock).mockRejectedValue(new Error("Server error"));

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("PIN"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() =>
      expect(screen.getByText("Server error")).toBeInTheDocument()
    );
  });
});
