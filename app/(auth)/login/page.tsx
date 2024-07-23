import { LoginForm } from "@/components/forms/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Maintainr",
  description: "Login to access your dashboard",
};

export default function SignUp() {
  return (
    <div className="grid w-full h-full place-items-center">
      <LoginForm />
    </div>
  );
}
