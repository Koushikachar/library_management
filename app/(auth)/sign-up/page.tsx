"use client";
import AuthForm from "@/components/AuthForm";
import { signup } from "@/lib/actions/auth";

import { signUpSchema } from "@/lib/validation";

const page = () => (
  <AuthForm
    type="SIGN_UP"
    schema={signUpSchema}
    defaultValues={{
      email: "",
      password: "",
      fullName: "",
      universityId: 0,
      universityCard: "",
    }}
    onSubmit={signup}
  />
);

export default page;
