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
          <FormItem className="space-y-2">
            <FormLabel className="text-gray-800 font-semibold text-base">
              {label}
            </FormLabel>
            <FormControl>
              {type === "input" ? (
                <Input
                  className="rounded-full border-0 bg-white/90 px-6 py-3 h-12 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-teal-500"
                  placeholder={placeholder}
                  {...field}
                />
              ) : (
                <Textarea
                  className="resize-none rounded-full border-0 bg-white/90 px-6 py-4 min-h-[100px] placeholder:text-gray-400 placeholder:mt-4 focus-visible:ring-2 focus-visible:ring-teal-500"
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
    <section className="max-w-[calc(100vw-6rem)] mx-auto bg-primary py-24 rounded-default">
      <div className=" ">
        <div className="max-w-6xl  mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center ">
            {/* Left side - Speech bubble and text */}
            <div className="flex flex-col items-center justify-center space-y-8">
              {/* Speech bubble */}
              <Image
                src="/speech-bubble.png"
                alt="Speech Bubble"
                width={300}
                height={173}
              />

              {/* Text */}
              <div className="text-center">
                <h2 className="text-4xl lg:text-5xl font-bold text-teal-600 leading-tight">
                  Feel Free
                  <br />
                  To Contact Us!
                </h2>
              </div>
            </div>

            {/* Right side - Contact form */}
            <div className="bg-transparent">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FieldInput
                    name="name"
                    label="Name"
                    placeholder="Add your note here"
                    type="input"
                  />
                  <FieldInput
                    name="phone_number"
                    label="Mobile Number"
                    placeholder="Add your note here"
                    type="input"
                  />
                  <FieldInput
                    name="message"
                    label="Message"
                    placeholder="Add your note here"
                    type="textarea"
                  />

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 px-8 rounded-full h-14 text-lg transition-colors"
                    >
                      Send
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
