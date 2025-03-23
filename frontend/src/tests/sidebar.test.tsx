
// import { render, screen, fireEvent } from "@testing-library/react";
// import "@testing-library/jest-dom";
// import { MemoryRouter } from "react-router-dom";
// import Sidebar from "@/components/Sidebar";

// describe("Sidebar Component", () => {

//   it("renders all sidebar links", () => {
//     render(
//       <MemoryRouter>
//         <Sidebar />
//       </MemoryRouter>
//     );

//     expect(screen.getByText("Main Inventory")).toBeInTheDocument();
//     expect(screen.getByText("Orders")).toBeInTheDocument();
//   });

//   it("applies active class when a link is clicked", () => {
//     render(
//       <MemoryRouter>
//         <Sidebar/>
//       </MemoryRouter>
//     );

//     const generalStockLink = screen.getByText("General Stock");
//     const ordersLink = screen.getByText("Orders");

//     fireEvent.click(generalStockLink);
//     expect(generalStockLink).toHaveClass("bg-accent text-white");

//     fireEvent.click(ordersLink);
//     expect(ordersLink).toHaveClass("bg-accent text-white");

//     expect(generalStockLink).not.toHaveClass("bg-accent text-white");
//   });

//   it("only keeps one link active at a time", () => {
//     render(
//       <MemoryRouter>
//         <Sidebar/>
//       </MemoryRouter>
//     );

//     const generalStockLink = screen.getByText("Main Inventory");
//     const ordersLink = screen.getByText("Orders");

//     fireEvent.click(generalStockLink);
//     expect(generalStockLink).toHaveClass("bg-accent text-white");
//     expect(ordersLink).not.toHaveClass("bg-accent text-white");

//     fireEvent.click(ordersLink);
//     expect(ordersLink).toHaveClass("bg-accent text-white");
//     expect(generalStockLink).not.toHaveClass("bg-accent text-white");
//   });
// });
