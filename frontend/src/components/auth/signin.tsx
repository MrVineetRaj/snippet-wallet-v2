import React, { useState } from "react";
import { SignInFormSchema, SignInFormType } from "../../utils/zod-schema";
import FormField from "../ui/form-field";
import toast from "react-hot-toast";
import { ZodError } from "zod";

import { useNavigate } from "react-router";
import { useUser } from "../../context/user.context";

const SignIn = () => {
  const { signIn } = useUser();
  const [formData, setFormData] = useState<SignInFormType>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = React.useState<Partial<SignInFormType>>({});
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setErrors({});
    const toastId = toast.loading("Signing you in ...");
    try {
      await SignInFormSchema.parseAsync(formData);
      await signIn({
        email: formData.email,
        password: formData.password,
      });

      console.log("Signing in with Form data:", formData);
      toast.success("Login successful", {
        id: toastId,
      });
      navigate("/console");
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message, {
          id: toastId,
        });
        return;
      }
      if (error instanceof ZodError) {
        const fieldErrors: Partial<SignInFormType> = {};
        error.errors.forEach((err) => {
          if (err.path[0] === "email") {
            fieldErrors.email = err.message;
          }
          if (err.path[0] === "password") {
            fieldErrors.password = err.message;
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

        <button
          type="submit"
          className={`p-2 rounded-md ${
            isLoading ? "bg-gray-500" : "bg-blue-500"
          }`}
          disabled={isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default SignIn;
