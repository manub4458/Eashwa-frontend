"use client";
import { useForm, FormProvider } from "react-hook-form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../components/ui/form";
import Dashboard from "../../components/ui/Dashboard";
import { useState } from "react";

const BatteryForm = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: "",
      batteryDescription: "",
      vendorName: "",
      whatsappNumber: "",
      date: "",
      amount: "",
    },
  });
  function getFormattedDate() {
    const date = new Date();
  
    const day = date.getDate();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
  
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
  
    const daySuffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };
  
    const formattedHour = hours % 12 || 12;
    const formattedMinute = minutes < 10 ? "0" + minutes : minutes.toString();
  
    return `${day}${daySuffix(day)} ${month} ${year}, ${formattedHour}:${formattedMinute} ${ampm}`;
  }
  
  const onSubmit = async (data) => {
    console.log("Submitted Data:", data); // Log form data

    const responseData = {
      name: data.name,
      productDescription: data.batteryDescription,
      vendorName: data.vendorName,
      userPhoneNumber: data.whatsappNumber.startsWith("+91")
        ? data.whatsappNumber
        : `+91${data.whatsappNumber}`, // Add country code if not present
      amount: data.amount || "0",
      time:getFormattedDate(),
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/request/submit-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(responseData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Request submitted successfully:", result);
        methods.reset();
      } else {
        console.error("Failed to submit request:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="w-full p-4 py-6 px-10 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Logo" className="h-14 w-auto" />
        </div>
      </header>
      <div className="flex flex-col md:flex-row flex-1">
        <Dashboard />
        <main className="flex-1 flex items-center justify-center bg-gray-100 p-4 sm:p-6">
          <Card className="w-full max-w-lg md:max-w-2xl shadow-lg rounded-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl sm:text-3xl font-semibold text-green-700">
                Battery Requirement Submission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                  {/* Form Fields */}
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input {...methods.register("name", { required: true })} placeholder="Enter your name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem>
                    <FormLabel>Battery Description</FormLabel>
                    <FormControl>
                      <Textarea {...methods.register("batteryDescription", { required: true })} placeholder="Enter the battery description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem>
                    <FormLabel>Vendor Name</FormLabel>
                    <FormControl>
                      <Input {...methods.register("vendorName", { required: true })} placeholder="Enter vendor name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem>
                    <FormLabel>Whatsapp Number</FormLabel>
                    <FormControl>
                      <Input type="number" {...methods.register("whatsappNumber", { required: true })} placeholder="Enter your Whatsapp Number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
{/* 
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...methods.register("date", { required: true })} />
                    </FormControl>
                    <FormMessage />
                  </FormItem> */}

                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" {...methods.register("amount", { required: true })} placeholder="Enter the amount" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <div className="flex justify-center mt-8">
                    <Button type="submit" className="w-full bg-[#d86331] hover:bg-green-700 text-white">
                      Submit
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default BatteryForm;
