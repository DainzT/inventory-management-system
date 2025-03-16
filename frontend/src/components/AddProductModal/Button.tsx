interface ButtonProps {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}

export const Button = ({
  variant = "primary",
  children,
  onClick,
  type = "button",
}: ButtonProps) => {
  const baseStyles = "px-6 py-2 rounded-[5px]";
  const variantStyles = {
    primary: "bg-[#1B626E] text-white",
    secondary: "border-[1px] border-[#1B626E] text-[#1B626E]",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inter-font ${baseStyles} ${variantStyles[variant]}`}
    >
      {children}
    </button>
  );
};

