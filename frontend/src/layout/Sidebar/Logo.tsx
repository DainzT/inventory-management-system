import React from "react";
import logo from "../../assets/image/businessLogo.svg";

interface LogoProps {
  width?: number;
  height?: number;
}

export const Logo: React.FC<LogoProps> = ({ width = 10, height = 10 }) => {
  return (
    <div className=" flex items-center justify-center">
      <div
        className="mt-10"
        style={{ width: `${width}rem`, height: `${height}rem` }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{ width: `${width}rem`, height: `${height}rem` }}
        />
      </div>
    </div>
  );
};
