"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone_number: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

const ContactForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone_number: "",
      message: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    toast("Success!", {
      description: "Your message has been sent successfully.",
    });
  };

  const FieldInput = ({
    name,
    label,
    placeholder,
    type,
  }: {
    name: "name" | "phone_number" | "message";
    label: string;
    placeholder: string;
    type: "input" | "textarea";
  }) => {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="space-y-2 w-full">
            <FormLabel className="text-secondary font-semibold text-sm sm:text-base">
              {label}
            </FormLabel>
            <FormControl>
              {type === "input" ? (
                <Input
                  className="w-full rounded-default border-0 bg-white/90 px-4 py-3 h-12 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-teal-500"
                  placeholder={placeholder}
                  {...field}
                />
              ) : (
                <Textarea
                  className="w-full resize-none rounded-default border-0 bg-white/90 px-4 py-4 min-h-[120px] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-teal-500"
                  placeholder={placeholder}
                  {...field}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <section className="max-w-full px-4 sm:px-6 lg:px-12 bg-primary py-16 sm:py-20 lg:py-24 rounded-default">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left side */}
          <div className="hidden lg:flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 sm:space-y-8">
            <Image
              src="/contact.svg"
              alt="Speech Bubble"
              width={300}
              height={173}
              className="w-40 sm:w-56 lg:w-72 h-auto"
            />
            <h2 className="text-3xl sm:text-4xl  font-bold text-teal-600 leading-snug">
              Feel Free <br className="hidden sm:block" />
              To Contact Us!
            </h2>
          </div>

          {/* Right side - Contact form */}
          <div className="bg-transparent w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 w-full"
              >
                <FieldInput
                  name="name"
                  label="Name"
                  placeholder="Enter your name"
                  type="input"
                />
                <FieldInput
                  name="phone_number"
                  label="Mobile Number"
                  placeholder="Enter your mobile number"
                  type="input"
                />
                <FieldInput
                  name="message"
                  label="Message"
                  placeholder="Write your message..."
                  type="textarea"
                />

                <div className="pt-2 sm:pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 px-8 rounded-default h-14 text-lg transition-colors"
                  >
                    Send
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
