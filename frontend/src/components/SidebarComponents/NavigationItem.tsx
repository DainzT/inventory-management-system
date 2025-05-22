import { Link } from "react-router-dom";

interface NavigationItemProps {
  path: string;
  currentPath: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  path,
  currentPath,
  icon,
  label,
  onClick,
  disabled,
}) => {
  const isActive = currentPath === path;

  return (
    <Link
      to={path}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
        } else {
          onClick();
        }
      }}
      className={`flex items-center gap-3 w-full h-[60px] px-15  text-base font-medium  transition-all duration-200 ease-in-out ${
        isActive ? "bg-[#295C65] text-white" : ""
      } ${
        disabled
          ? "text-[#8f940a] opacity-80 cursor-not-allowed drag"
          : "cursor-pointer hover:bg-accent hover:text-white"
      }`}
      draggable={disabled ? "false" : "true"}
    >
      {icon} {label}
    </Link>
  );
};
