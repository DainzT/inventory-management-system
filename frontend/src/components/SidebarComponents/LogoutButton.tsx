import { useState } from "react";
import Portal from "../../utils/Portal";

const LogoutButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    console.log("User logged out");
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="
          flex items-center gap-[11px] w-[110px] h-[40px] rounded-[8px] 
        bg-[#fc2424] cursor-pointer px-[7px] transition-all duration-200 
          ease-in-out hover:scale-105 focus:outline-none
          shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.2)] hover:shadow-[inset_0_2px_8px_0_rgba(0,0,0,0.4)]
        "
          onClick={() => setIsOpen(true)}
      >
        <svg width="31" height="26" viewBox="0 0 31 26" fill="none">
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
          <section className="flex fixed inset-0 justify-center items-center select-none">
            <article className="relative px-6 py-4 w-96 bg-white rounded-2xl border-2 shadow-sm border-zinc-300 z-50 animate-[fadeIn_0.2s_ease-out]">
              <header className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold inter-font text-accent ">
                  Confirm Logout
                </h1>
              </header>

              <p className="text-black mb-4">Are you sure you want to logout?</p>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </article>
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
          </section>
        </Portal>
      )}
    </>
  );
};

export default LogoutButton;
