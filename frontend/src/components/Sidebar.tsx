import React from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-[#F4F4F4] text-[#333333] h-screen border-r border-[#bbbbbb]">
      <nav className="p-4">
        <ul>
          <li className="mb-2">
            <Link
              to="/"
              className="block py-2 px-4 hover:bg-[#1B626E] hover:text-[#F4F4F4] rounded"
            >
              General Stock
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/orders"
              className="block py-2 px-4 hover:bg-[#1B626E] hover:text-[#F4F4F4] rounded"
            >
              Orders
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/summary"
              className="block py-2 px-4 hover:bg-[#1B626E] hover:text-[#F4F4F4] rounded"
            >
              Monthly Summary
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
