import React from "react";
import { FleetCardProps, FleetListProps } from "@/types/fleetorders";

// Combined component
export const FleetCard: React.FC<FleetCardProps> = ({
  title,
  backgroundColor,
  isActive,
  onClick,
}) => {
  return (
    <article
      className={`relative p-12 ${backgroundColor} rounded-xl ${
        isActive ? "h-[200px] w-[300px]" : "h-[170px] w-[250px]"
      } cursor-pointer transition-all duration-300 ease-in-out shadow-lg ${
        isActive ? "shadow-2xl" : "shadow-md"
      }`}
      onClick={onClick}
    >
      <h2 className="text-2xl font-bold text-white">{title}</h2>

      <div className="absolute bottom-[14px] right-[14px] opacity-[0.3]">
        <svg
          width="115"
          height="115"
          viewBox="0 0 115 115"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.3">
            <path
              d="M71.7188 62.7538V32.6543C71.7147 32.2885 71.8227 31.9301 72.0282 31.6273C72.2337 31.3246 72.5269 31.092 72.8685 30.9607C73.21 30.8295 73.5836 30.8059 73.9389 30.8931C74.2943 30.9803 74.6145 31.1741 74.8565 31.4486L99.5098 58.5493C100.076 59.1714 100.406 59.973 100.441 60.8138C100.477 61.6545 100.215 62.4809 99.7025 63.1483C99.3509 63.5918 98.9021 63.9485 98.3907 64.191C97.8793 64.4335 97.319 64.5552 96.7531 64.5468H73.5118C73.0362 64.5468 72.5802 64.3579 72.2439 64.0216C71.9077 63.6854 71.7188 63.2293 71.7188 62.7538ZM110.81 77.3351C110.517 76.7267 110.058 76.2134 109.487 75.8542C108.915 75.4949 108.253 75.3045 107.578 75.3046H64.5469V3.58584C64.5429 2.84668 64.3106 2.12683 63.8818 1.52478C63.4529 0.922736 62.8485 0.46792 62.1513 0.222579C61.454 -0.0227612 60.698 -0.0466386 59.9866 0.154215C59.2753 0.355069 58.6434 0.770839 58.1774 1.34462L11.5602 58.7196C11.1388 59.246 10.8743 59.8805 10.7971 60.5503C10.7199 61.2201 10.8331 61.8981 11.1237 62.5065C11.4144 63.115 11.8707 63.6291 12.4402 63.99C13.0098 64.3509 13.6695 64.5438 14.3438 64.5468H57.375V75.3046H7.17192C6.49614 75.3042 5.834 75.4947 5.2618 75.8543C4.68961 76.2138 4.23066 76.7277 3.93784 77.3368C3.64503 77.9458 3.53028 78.6252 3.60681 79.2966C3.68334 79.9681 3.94805 80.6042 4.37041 81.1317L17.6384 97.7167C18.3088 98.5577 19.1605 99.2363 20.1299 99.702C21.0993 100.168 22.1614 100.408 23.2369 100.406H91.5132C92.5886 100.408 93.6507 100.168 94.6202 99.702C95.5896 99.2363 96.4413 98.5577 97.1117 97.7167L110.38 81.1317C110.802 80.6038 111.066 79.9673 111.143 79.2955C111.219 78.6238 111.103 77.9442 110.81 77.3351Z"
              fill="white"
            />
          </g>
        </svg>
      </div>

      <button className="absolute top-[25px] right-[25px]" aria-label="Options">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.625 12C14.625 12.5192 14.471 13.0267 14.1826 13.4584C13.8942 13.8901 13.4842 14.2265 13.0045 14.4252C12.5249 14.6239 11.9971 14.6758 11.4879 14.5746C10.9787 14.4733 10.511 14.2233 10.1438 13.8562C9.77673 13.489 9.52673 13.0213 9.42544 12.5121C9.32415 12.0029 9.37614 11.4751 9.57482 10.9955C9.7735 10.5158 10.11 10.1058 10.5416 9.81739C10.9733 9.52896 11.4808 9.375 12 9.375C12.6962 9.375 13.3639 9.65156 13.8562 10.1438C14.3484 10.6361 14.625 11.3038 14.625 12ZM12 7.125C12.5192 7.125 13.0267 6.97105 13.4584 6.68261C13.8901 6.39417 14.2265 5.9842 14.4252 5.50455C14.6239 5.02489 14.6758 4.49709 14.5746 3.98789C14.4733 3.47869 14.2233 3.01096 13.8562 2.64385C13.489 2.27673 13.0213 2.02673 12.5121 1.92544C12.0029 1.82415 11.4751 1.87614 10.9955 2.07482C10.5158 2.2735 10.1058 2.60995 9.81739 3.04163C9.52895 3.47331 9.375 3.98083 9.375 4.5C9.375 5.19619 9.65156 5.86387 10.1438 6.35616C10.6361 6.84844 11.3038 7.125 12 7.125ZM12 16.875C11.4808 16.875 10.9733 17.029 10.5416 17.3174C10.11 17.6058 9.7735 18.0158 9.57482 18.4955C9.37614 18.9751 9.32415 19.5029 9.42544 20.0121C9.52673 20.5213 9.77673 20.989 10.1438 21.3562C10.511 21.7233 10.9787 21.9733 11.4879 22.0746C11.9971 22.1758 12.5249 22.1239 13.0045 21.9252C13.4842 21.7265 13.8942 21.3901 14.1826 20.9584C14.471 20.5267 14.625 20.0192 14.625 19.5C14.625 18.8038 14.3484 18.1361 13.8562 17.6438C13.3639 17.1516 12.6962 16.875 12 16.875Z"
            fill="white"
          />
        </svg>
      </button>
    </article>
  );
};

export const FleetList: React.FC<FleetListProps> = ({
  activeFleet,
  onFleetSelect,
}) => {
  const fleets = ["All Fleets", "DONYA DONYA", "Doña Librada"];

  return (
    <nav className="flex relative flex-col gap-4 pl-24 mt-5">
      <div
        className="absolute w-0.5 bg-stone-300 h-[136px] left-[58px]"
        data-testid="fleet-list-separator"
      />
      {fleets.map((fleet) => (
        <button
          key={fleet}
          className="text-xl text-black hover:text-cyan-800 text-left"
          onClick={() => onFleetSelect && onFleetSelect(fleet)}
          aria-current={activeFleet === fleet ? "page" : undefined}
        >
          {fleet}
        </button>
      ))}
    </nav>
  );
};
