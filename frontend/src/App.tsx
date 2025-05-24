import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./layout/Header";
import Sidebar from "@/layout/Sidebar/Sidebar";
import Inventory from "./pages/InventoryPage";
import Orders from "./pages/OrderPage";
import Summary from "./pages/SummaryPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./layout/ProtectedRoutes";

const App: React.FC = () => {
  return (
    <Router>
      <ToastContainer
        transition={Slide}
        position="top-center"
        autoClose={1200}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
      <div className="flex flex-col h-screen">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <>
                  <div className="flex flex-col h-screen">
                    <Header />
                    <div className="flex flex-1 overflow-hidden">
                      <Sidebar />
                      <div className="flex-1 p-1 overflow-hidden">
                        <Routes>
                          <Route path="/inventory" element={<Inventory />} />
                          <Route
                            path="/orders"
                            element={
                              <div className="h-full overflow-y-auto">
                                <Orders />
                              </div>
                            }
                          />
                          <Route
                            path="/summary/:fleetName"
                            element={
                              <div className="h-full overflow-y-auto">
                                <Summary />
                              </div>
                            }
                          />
                        </Routes>
                      </div>
                    </div>
                  </div>
                </>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
