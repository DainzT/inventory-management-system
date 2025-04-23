import React from "react";
import { SimpleInputProps } from "@/types/select-field";

interface CreateAdminInputProps {
  label: string;
  type?: "text" | "password";
  value: string;
  onChange: (value: string) => void;
  isPin?: boolean;
  placeholder?: string;
}

const CreateAdminInput: React.FC<CreateAdminInputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  isPin = false,
  placeholder,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;

    if (isPin) {
      input = input.replace(/\D/g, "").slice(0, 6);
    }

    onChange(input);
  };
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
    </div>
  );
};

export default CreateAdminInput;
