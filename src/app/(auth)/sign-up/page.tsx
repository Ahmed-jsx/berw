import { SignUpForm } from "@/components/signup-form";

export default function SignUpPage() {
  return (
    <div className=" flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-[550px] flex-col gap-6">
        {/* <Logo /> */}
        <SignUpForm />
      </div>
    </div>
  );
}
