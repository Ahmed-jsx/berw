import { SignUpForm } from "@/components/signup-form";
import { Suspense } from "react";

export default function SignUpPage() {
  return (
    <div className=" flex min-h-svh justify-center items-center">
      <div className="flex w-full max-w-[550px] flex-col gap-6">
        {/* <Logo /> */}
        <Suspense>
          <SignUpForm />
        </Suspense>
      </div>
    </div>
  );
}
