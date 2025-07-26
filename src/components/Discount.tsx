"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

function DiscountDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://monkey-1-jhiq.onrender.com/api/forms",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setShowCongratulations(true);
    } catch (error) {
      console.error("Submission failed:", error);
      // Optionally, show toast or error message
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleClose = () => {
    setOpen(false);
    // Reset states when dialog closes
    setTimeout(() => {
      setShowCongratulations(false);
      form.reset();
    }, 300);
  };

  const handleCool = () => {
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full font-medium  bg-[#047578] hover:bg-[#047578]/80 text-lg max-w-[300px] w-full mt-6 py-[30px]">
          Get 25% Discount
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 gap-0">
        {showCongratulations ? (
          // Congratulations Screen
          <>
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white hover:text-white cursor-pointer transition-colors z-10 bg-[#E7BC20] rounded-full p-1"
            >
              <X className="h-5 w-5 text-bold" />
            </button>

            <div className="p-8 text-center space-y-6">
              {/* Illustration */}
              <div className="flex justify-center mb-6">
                <div className="w-64 h-48 relative">
                  <Image
                    src="/pana.svg"
                    alt="Congratulations illustration with person and discount tag"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Dotted separator line */}
              <div className="flex justify-center">
                <div className="w-full max-w-xs border-t-2 border-dotted border-[#047578]/30"></div>
              </div>

              {/* Text content */}
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-[#047578]">
                  Congratulations!
                </h2>

                <p className="text-gray-700 text-base leading-relaxed max-w-md mx-auto">
                  You now have a 25% off discount on your next order at our
                  store. Please show this screen to the cashier while paying for
                  your order
                </p>
              </div>

              {/* Cool button */}
              <div className="pt-4">
                <Button
                  onClick={handleCool}
                  className="w-full bg-[#047578] hover:bg-[#047578]/90 text-white py-3 rounded-full text-lg font-medium"
                >
                  Cool
                </Button>
              </div>
            </div>
          </>
        ) : (
          // Original Form
          <>
            {/* Header Section */}
            <div className="bg-[#047578] text-white p-6 rounded-t-lg relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white hover:text-white cursor-pointer transition-colors z-10 bg-[#E7BC20] rounded-full p-1"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="pr-8">
                <h2 className="text-2xl font-bold mb-2">
                  Discount <span className="text-yellow-300 text-3xl">25%</span>
                </h2>
                <p className="text-sm text-white/90">
                  Sign up with your data and get a 25% discount on your order on
                  our store, and subscribe to get our updates
                </p>
              </div>
            </div>

            {/* Form Section */}
            <div className="p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Your Name"
                            className="bg-gray-50 border-gray-200 focus:bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Your Phone Number"
                            className="bg-gray-50 border-gray-200 focus:bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter Your Email Address"
                            className="bg-gray-50 border-gray-200 focus:bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-[#047578] hover:bg-[#047578]/90 text-white py-3 rounded-full text-base font-medium mt-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Get 25% Discount"}
                  </Button>
                </form>
              </Form>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default DiscountDialog;
