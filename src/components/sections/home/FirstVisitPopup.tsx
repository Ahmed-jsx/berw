"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FirstVisitPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Check if user has seen the popup before
    const hasSeenPopup = localStorage.getItem("hasSeenFirstVisitPopup");
    
    if (!hasSeenPopup) {
      // Small delay to ensure smooth animation
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Mark as seen so it doesn't show again
    localStorage.setItem("hasSeenFirstVisitPopup", "true");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you can add your form submission logic
    // For example, send to an API endpoint
    console.log("Form submitted:", { firstName, email });
    
    // Close popup and mark as seen
    handleClose();
    
    // You can add a success message or redirect here
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    } else {
      setIsOpen(open);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="bg-white text-gray-900 max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center text-gray-900">
            Get 5% Off Your First Order!
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 mt-2">
            Complete the form to get your discount.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="bg-white border-gray-300 text-gray-900"
            />
          </div>
          
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white border-gray-300 text-gray-900"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-gray-800 text-white hover:bg-gray-700 rounded-md py-2.5 mt-4"
          >
            Submit
          </Button>
          
          <p className="text-xs text-gray-500 text-center mt-3">
            By signing up, you agree to receive marketing emails.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FirstVisitPopup;

