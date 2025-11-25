"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// --- Schema ---
const signUpSchema = z
  .object({
    user_name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
    user_email: z
      .string()
      .email("Please enter a valid email address")
      .min(1, "Email is required"),
    user_number: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^\+?[\d\s\-\(\)\.]+$/, "Please enter a valid phone number")
      .min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

// --- Password validation helper ---
const validatePassword = (password: string) => ({
  minLength: password.length >= 8,
  hasUppercase: /[A-Z]/.test(password),
  hasLowercase: /[a-z]/.test(password),
  hasNumber: /\d/.test(password),
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
});

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const registerMutation = useRegister();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      user_name: "",
      user_email: "",
      user_number: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");
  const passwordValidation = validatePassword(password || "");

  // --- Submit handler ---
  const onSubmit = async (userData: SignUpFormData) => {
    try {
      await registerMutation.mutateAsync({
        user_name: userData.user_name,
        user_email: userData.user_email,
        user_number: userData.user_number,
        password: userData.password,
      });

      toast.success("Signup successful 🎉");
      
      // Check for redirect destination stored in sessionStorage
      const redirectPath = sessionStorage.getItem("redirectAfterAuth");
      if (redirectPath) {
        // Clear the redirect value
        sessionStorage.removeItem("redirectAfterAuth");
        // Redirect to the stored path (e.g., checkout page)
        router.push(redirectPath);
      }
      // If no redirect is stored, AuthGuard will handle default redirect
    } catch (error: any) {
      toast.error(error?.message || "Signup failed");
    }
  };

  // --- Small UI component ---
  const PasswordRequirement = ({
    isValid,
    text,
  }: {
    isValid: boolean;
    text: string;
  }) => (
    <div className="flex items-center gap-2">
      {isValid ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <X className="h-3 w-3 text-red-500" />
      )}
      <span className={isValid ? "text-green-600" : "text-red-600"}>
        {text}
      </span>
    </div>
  );

  return (
    <div className={cn("flex py-20 flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>Sign up with your details below</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="user_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        disabled={registerMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="user_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        disabled={registerMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="user_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        disabled={registerMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <button
                        type="button"
                        className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-100"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={registerMutation.isPending}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        disabled={registerMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    {password && (
                      <div className="text-xs space-y-1 mt-2">
                        <PasswordRequirement
                          isValid={passwordValidation.minLength}
                          text="At least 8 characters"
                        />
                        <PasswordRequirement
                          isValid={passwordValidation.hasUppercase}
                          text="One uppercase letter"
                        />
                        <PasswordRequirement
                          isValid={passwordValidation.hasLowercase}
                          text="One lowercase letter"
                        />
                        <PasswordRequirement
                          isValid={passwordValidation.hasNumber}
                          text="One number"
                        />
                        <PasswordRequirement
                          isValid={passwordValidation.hasSpecialChar}
                          text="One special character"
                        />
                      </div>
                    )}
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              {password && (
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Confirm Password</FormLabel>
                        <button
                          type="button"
                          className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-100"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          disabled={registerMutation.isPending}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <FormControl>
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          disabled={registerMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      {confirmPassword && (
                        <div className="flex items-center gap-2 text-xs mt-2">
                          {password === confirmPassword ? (
                            <>
                              <Check className="h-3 w-3 text-green-500" />
                              <span className="text-green-600">
                                Passwords match
                              </span>
                            </>
                          ) : (
                            <>
                              <X className="h-3 w-3 text-red-500" />
                              <span className="text-red-600">
                                Passwords don&apos;t match
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending || !form.formState.isValid}
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Sign up"
                )}
              </Button>

              {/* Login link */}
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Login
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
