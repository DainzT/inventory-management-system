import React, { useState } from "react";
import Portal from "../../utils/Portal";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useAuth } from "@/hooks/useAuth";

const LogoutButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      navigate("/login");
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="
          flex items-center gap-[0.6875rem] w-[6.875rem] h-[2.5rem] rounded-[0.5rem] scale-80
          bg-[#fc2424] cursor-pointer px-[0.4375rem] transition-all duration-200 
          ease-in-out hover:scale-85 focus:outline-none
          shadow-[inset_0_0.125rem_0.25rem_0_rgba(0,0,0,0.2)] hover:shadow-[inset_0_0.125rem_0.5rem_0_rgba(0,0,0,0.4)] 
        "
        onClick={() => setIsOpen(true)}
      >
        <svg
          width="1.9375rem"
          height="1.625rem"
          viewBox="0 0 31 26"
          fill="none"
        >
          <path
            d="M22.7333 7.42847L27.5555 12.9999M27.5555 12.9999L22.7333 18.5713M27.5555 12.9999H16.3037M17.9111 18.5713H16.3037C13.6404 18.5713 11.4814 16.0769 11.4814 12.9999C11.4814 9.92289 13.6404 7.42847 16.3037 7.42847H17.9111"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-sm text-white">Logout</span>
      </button>

      {isOpen && (
        <Portal>
          <section className="flex fixed inset-0 z-50 justify-center items-center select-none">
            <article className="relative px-6 py-4 w-[24rem] bg-white rounded-2xl border-2 shadow-sm border-zinc-300 z-50 animate-[fadeIn_0.2s_ease-out]">
              <header className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold inter-font text-accent ">
                  Confirm Logout
                </h1>
              </header>

              <p className="text-black mb-4">
                Are you sure you want to logout?
              </p>

              <div className="flex justify-end gap-2">
                <button
                  role="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-all w-30 active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition-all w-35 h-11 flex items-center justify-center active:scale-[0.98]"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-1.5 text-sm">
                      <ClipLoader size={14} color="#f4f4f4" />
                      <span>Logging Out...</span>
                    </span>
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </article>
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => !loading && setIsOpen(false)}
              aria-hidden="true"
            />
          </section>
        </Portal>
      )}
    </>
  );
};

export default LogoutButton;
