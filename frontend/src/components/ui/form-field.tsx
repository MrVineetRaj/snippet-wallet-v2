import clsx from "clsx";
import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const FormField = ({
  value,
  errors,
  handleChange,
  type,
  placeholder,
  label,
  otherInputStyle,
  otherLabelStyle,
  otherContainerStyle,
  isRequired,
}: {
  value: string;
  errors: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  type?: string;
  placeholder?: string;
  otherInputStyle?: string;
  otherLabelStyle?: string;
  otherContainerStyle?: string;
  isRequired: boolean;
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <span className={clsx("relative flex", otherContainerStyle)}>
      <input
        type={
          (type?.toLowerCase() != "password"
            ? type?.toLowerCase()
            : isPasswordVisible
            ? "text"
            : "password") || "text"
        }
        placeholder={placeholder || label}
        value={value}
        onChange={handleChange}
        name={label}
        className={clsx(
          "p-2 rounded-md outline-none border-2 w-full border-gray-500 focus:border-primary peer",
          errors ? "outline-2 outline-red-500" : "outline-none",
          otherInputStyle
        )}
        required={isRequired}
        autoFocus={true}
        autoComplete="off"
      />
      <label
        htmlFor={label}
        className={clsx(
          "text-white text-sm absolute -top-3 font-bold bg-background px-1 peer-focus:text-primary",
          otherLabelStyle
        )}
      >
        {label}
      </label>
      {type?.toLowerCase() == "password" && (
        <span
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          {isPasswordVisible && <FaEyeSlash className="text-gray-500" />}
          {!isPasswordVisible && <FaEye className="text-gray-500" />}
        </span>
      )}
    </span>
  );
};

export default FormField;
