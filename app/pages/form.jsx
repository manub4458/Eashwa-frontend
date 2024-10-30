"use client";
import { useForm, FormProvider } from "react-hook-form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../components/ui/form";
import Link from "next/link";
import Dashboard from "../../components/ui/Dashboard";
import { useState } from "react";

const BatteryForm = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const methods = useForm({
    defaultValues: {
      name: "",
      batteryDescription: "",
      vendorName: "",
      dateTime: "",
      amount: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  const handleLogin = () => {
    localStorage.setItem('token', 'your-auth-token'); // Set your token here
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
     <header className="w-full p-4 py-6 px-10 flex justify-between items-center shadow-lg">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Logo" className="h-14 w-auto" />
          </div>

          
        </header>
      <div className="flex flex-col md:flex-row flex-1">


        {/* <aside className="w-full md:w-64 bg-[#d86331] text-white p-4">

          <div className="font-bold text-2xl mb-8">Your Dashboard</div>
          <nav>
            <ul className="space-y-4">
              <Link href='/'>
                <li className="hover:bg-green-700 p-2 rounded">Overview</li>
              </Link>
              <Link href='/form'>
                <li className="hover:bg-green-700 p-2 rounded">Form</li> 
              </Link>
              <Link href='/battery'>
                <li className="hover:bg-green-700 p-2 rounded">Battery Stock</li>
              </Link>
              <Link href='/charger'>
                <li className="hover:bg-green-700 p-2 rounded">Charger Stock</li>
              </Link>
              <li className="hover:bg-green-700 p-2 rounded">Transactions</li>
            </ul>
          </nav>
        </aside> */}
        <Dashboard/>

        <main className="flex-1 flex items-center justify-center bg-gray-100 p-4 sm:p-6">
          <Card className="w-full max-w-lg md:max-w-2xl shadow-lg rounded-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl sm:text-3xl font-semibold text-green-700">
                Battery Requirement Submission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormProvider {...methods}>
                <Form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
     
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input
                        {...methods.register("name", { required: true })}
                        placeholder="Enter your name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem>
                    <FormLabel>Battery Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...methods.register("batteryDescription", { required: true })}
                        placeholder="Enter the battery description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

 
                  <FormItem>
                    <FormLabel>Vendor Name</FormLabel>
                    <FormControl>
                      <Input
                        {...methods.register("vendorName", { required: true })}
                        placeholder="Enter vendor name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                  <FormItem>
                    <FormLabel>Whatsapp Number</FormLabel>
                    <FormControl>
                      <Input
                      type="Number"
                        {...methods.register("whatsappNumber", { required: true })}
                        placeholder="Enter your Whatsapp Number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  <FormItem>
                    <FormLabel>Date/Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...methods.register("dateTime", { required: true })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

          
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...methods.register("amount", { required: true })}
                        placeholder="Enter the amount"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

            
                  <div className="flex justify-center mt-8">
                    <Button type="submit" className="w-full bg-[#d86331] hover:bg-green-700 text-white">
                      Submit
                    </Button>
                  </div>
                </Form>
              </FormProvider>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default BatteryForm;
