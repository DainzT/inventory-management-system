import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { 
  Slide, 
  ToastContainer 
} from "react-toastify";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { 
  LoginPage, 
  InventoryPage, 
  SummaryPage, 
  OrderPage 
} from "./pages";
import { 
  Header, 
  Sidebar, 
  ProtectedRoutes 
} from "./layout";

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
              <ProtectedRoutes>
                <>
                  <div className="flex flex-col h-screen">
                    <Header />
                    <div className="flex flex-1 overflow-hidden">
                      <Sidebar />
                      <div className="flex-1 p-1 overflow-hidden">
                        <Routes>
                          <Route path="/inventory" element={<InventoryPage />} />
                          <Route
                            path="/orders"
                            element={
                              <div className="h-full overflow-y-auto">
                                <OrderPage />
                              </div>
                            }
                          />
                          <Route
                            path="/summary/:fleetName"
                            element={
                              <div className="h-full overflow-y-auto">
                                <SummaryPage />
                              </div>
                            }
                          />
                        </Routes>
                      </div>
                    </div>
                  </div>
                </>
              </ProtectedRoutes>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
