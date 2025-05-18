import React from "react";
import { SignUpFormSchema, SignUpFormType } from "../../utils/zod-schema";
import FormField from "../ui/form-field";

import toast from "react-hot-toast";
import { ZodError } from "zod";
import { useUser } from "../../context/user.context";
import { useNavigate } from "react-router";
const Signup = () => {
  const { signUp } = useUser();
  const [formData, setFormData] = React.useState<SignUpFormType>({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = React.useState<Partial<SignUpFormType>>({});
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    const toastId = toast.loading("Signing you up ...");
    try {
      await SignUpFormSchema.parseAsync(formData);
      await signUp({
        fullname: formData.fullname,
        email: formData.email,
        password: formData.password,
      });
      toast.success("Signup successful", {
        id: toastId,
      });
      navigate("/auth");

    } catch (error) {
      console.log(error);

      if (error instanceof Error) {
        toast.error(error.message, {
          id: toastId,
        });
        return;
      }

      if (error instanceof ZodError) {
        const fieldErrors: Partial<SignUpFormType> = {};
        error.errors.forEach((err) => {
          if (err.path[0] === "fullname") {
            fieldErrors.fullname = err.message;
          }
          if (err.path[0] === "email") {
            fieldErrors.email = err.message;
          }
          if (err.path[0] === "password") {
            fieldErrors.password = err.message;
          }
          if (err.path[0] === "confirmPassword") {
            fieldErrors.confirmPassword = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Please fill all the fields correctly", {
          id: toastId,
        });
        return;
      }
      toast.error("Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <form className="flex flex-col gap-6 mt-5">
        <FormField
          value={formData.fullname}
          errors={!!errors.fullname}
          handleChange={(e) =>
            setFormData({ ...formData, fullname: e.target.value })
          }
          label="Full Name"
          otherInputStyle={`p-2 rounded-md ${
            errors.fullname ? "border-red-500" : "border-gray-300"
          }`}
          otherLabelStyle="text-gray-500"
          type={"text"}
          placeholder="John Does"
          isRequired={true}
        />
        <FormField
          value={formData.email}
          errors={!!errors.email}
          handleChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          label="Email"
          otherInputStyle={`p-2 rounded-md ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          otherLabelStyle="text-gray-500"
          type={"email"}
          placeholder="abc@example.com"
          isRequired={true}
        />

        <FormField
          value={formData.password}
          errors={!!errors.password}
          handleChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          label="Password"
          otherInputStyle={`p-2 rounded-md ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
          otherLabelStyle="text-gray-500"
          type={"password"}
          isRequired={true}
        />
        <FormField
          value={formData.confirmPassword}
          errors={!!errors.confirmPassword}
          handleChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          label="Confirm Password"
          otherInputStyle={`p-2 rounded-md ${
            errors.confirmPassword ? "border-red-500" : "border-gray-300"
          }`}
          otherLabelStyle="text-gray-500"
          type={"password"}
          isRequired={true}
        />

        <button
          type="submit"
          className={`p-2 rounded-md ${
            isLoading ? "bg-gray-500" : "bg-blue-500"
          }`}
          disabled={isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? "Loading..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
