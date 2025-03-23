import React from "react";
import logo from "../../assets/image/businessLogo.svg";

export const Logo: React.FC = () => {
  return (
    <div className="relative flex justify-center  pb-[20px] ">
      <div className="w-[186px] h-[170px] rounded-full mt-10 " />
      <span className="absolute bottom-[40px] text-[24px] font-[600] text-[#295C65]">
        <img src={logo} alt="Logo" className="w-45 h-45" />
      </span>
    </div>  
  );
};