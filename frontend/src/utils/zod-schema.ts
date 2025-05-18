import { z } from "zod";

const SignUpFormSchema = z
  .object({
    fullname: z
      .string()
      .min(3, { message: "Full name must be at least 3 characters long" }),
    email: z.string().email({
      message: "Invalid email address",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters long",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // path of error
  });

const SignInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const ForgotPasswordFormSchema = z.object({
  email: z.string().email(),
});



export type SignUpFormType = z.infer<typeof SignUpFormSchema>;
export type SignInFormType = z.infer<typeof SignInFormSchema>;
export type ForgotPasswordFormType = z.infer<typeof ForgotPasswordFormSchema>;

export { SignUpFormSchema, SignInFormSchema, ForgotPasswordFormSchema };
