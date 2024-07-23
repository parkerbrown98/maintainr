import { SignUpForm } from "@/components/forms/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Maintainr",
  description: "Create an account to access your dashboard",
};

export default function SignUp() {
  return (
    <div className="grid w-full h-full place-items-center">
      <SignUpForm />
    </div>
  );
}
