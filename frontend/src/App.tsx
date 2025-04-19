import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoutes";
import PageLayout from "./pages/PageLayout";
import LoginPage from "./pages/LoginPage";
import Inventory from "./pages/InventoryPage";
import Orders from "./pages/OrderPage";
import Summary from "./pages/SummaryPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PageLayout />
            </ProtectedRoute>
          }
        >
          <Route path="inventory" element={<Inventory />} />
          <Route path="orders" element={<Orders />} />
          <Route path="summary/:fleetName" element={<Summary />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
