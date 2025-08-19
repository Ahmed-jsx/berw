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
import { FetchError } from "@/lib/fetcher";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface SignUpFormProps extends React.ComponentProps<"div"> {}

// Zod validation schema
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
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    mode: "onChange", // Real-time validation
  });

  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  const validatePassword = (password: string): PasswordValidation => ({
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  });

  const passwordValidation = validatePassword(password || "");

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const { confirmPassword, ...registerData } = data;

      // Show loading toast
      const loadingToastId = toast.loading("Creating your account...");

      await registerMutation.mutateAsync(registerData);

      // Dismiss loading toast and show success
      toast.dismiss(loadingToastId);
      toast.success("Account created successfully!", {
        description: "Welcome! You can now start using our platform.",
      });
    } catch (error) {
      // Handle errors with toast
      toast.dismiss();
      const errorMessage =
        error instanceof FetchError
          ? error.message
          : "Registration failed. Please try again.";

      toast.error("Registration failed", {
        description: errorMessage,
      });
    }
  };

  const handleSocialSignUp = async () => {
    try {
      setIsLoading(true);

      // Show loading toast
      toast.loading("Redirecting to Google...");

      const redirectUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
      window.location.href = redirectUrl;
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to redirect to Google", {
        description: "Please try again or use email signup.",
      });
    }
  };

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
          <CardDescription>Sign up with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Google Sign Up Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full bg-transparent"
                onClick={handleSocialSignUp}
                disabled={isLoading || registerMutation.isPending}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="mr-2 h-4 w-4"
                  >
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                Sign up with Google
              </Button>

              {/* Divider */}
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>

              {/* Full Name Field */}
              <FormField
                control={form.control}
                name="user_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        disabled={registerMutation.isPending || isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
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
                        disabled={registerMutation.isPending || isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number Field */}
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
                        disabled={registerMutation.isPending || isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
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
                        disabled={registerMutation.isPending || isLoading}
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
                        disabled={registerMutation.isPending || isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />

                    {/* Password Requirements */}
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

              {/* Confirm Password Field */}
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
                          disabled={registerMutation.isPending || isLoading}
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
                          disabled={registerMutation.isPending || isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />

                      {/* Password Match Indicator */}
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

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={
                  registerMutation.isPending ||
                  isLoading ||
                  !form.formState.isValid
                }
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

              {/* Login Link */}
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

      {/* Terms and Privacy */}
      <div className="text-muted-foreground text-center text-xs text-balance">
        By clicking continue, you agree to our{" "}
        <Link
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
}
