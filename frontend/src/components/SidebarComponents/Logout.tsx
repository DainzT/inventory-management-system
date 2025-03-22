import React, { useState } from "react";
import { MdClose } from "react-icons/md";

const LogoutButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    console.log("User logged out");
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-56 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all mt-6"
      >
        Logout
      </button>

      {isOpen && (
        <section className="flex fixed inset-0 justify-center items-center bg-black bg-opacity-50">
          <article className="relative px-6 py-4 w-96 bg-white rounded-2xl border-2 shadow-sm border-zinc-300">
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
        </section>
      )}
    </>
  );
};

export default LogoutButton;
