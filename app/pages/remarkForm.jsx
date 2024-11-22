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
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const RemarkForm = () => {
  const router = useRouter();

  const methods = useForm({
    defaultValues: {
      name: "",
      product: "",
      specifications: "",
      quantity: "",
      description: "",
      date: "", // New field for date
    },
  });

  const onSubmit = (data) => {
    console.log("Submitted Data:", data);
    const history = JSON.parse(localStorage.getItem('formHistory') || "[]");
    const newEntry = { ...data };
    history.push(newEntry);
    localStorage.setItem('formHistory', JSON.stringify(history));
    methods.reset();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="w-full p-4 py-6 px-10 flex justify-between items-center shadow-lg">
        <Link href="/">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Logo" className="h-14 w-auto" />
          </div>
        </Link>
      </header>

      <div className="flex flex-col md:flex-row flex-1">
        <Dashboard />
        <main className="flex-1 flex items-center justify-center bg-gray-100 p-4 sm:p-6">
          <Card className="w-full max-w-lg md:max-w-2xl shadow-lg rounded-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl sm:text-3xl font-semibold text-green-700">
                Submit Your Shortage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...methods.register("name", { required: "Name is required." })} 
                        placeholder="Enter your name" 
                      />
                    </FormControl>
                    <FormMessage>{methods.formState.errors.name?.message}</FormMessage>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Product</FormLabel>
                    <FormControl>
                      <Input 
                        {...methods.register("product", { required: "Product is required." })} 
                        placeholder="Enter product name" 
                      />
                    </FormControl>
                    <FormMessage>{methods.formState.errors.product?.message}</FormMessage>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Specifications</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...methods.register("specifications", { required: "Specifications are required." })} 
                        placeholder="Enter specifications" 
                      />
                    </FormControl>
                    <FormMessage>{methods.formState.errors.specifications?.message}</FormMessage>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...methods.register("quantity", { required: "Quantity is required." })} 
                        placeholder="Enter quantity" 
                      />
                    </FormControl>
                    <FormMessage>{methods.formState.errors.quantity?.message}</FormMessage>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...methods.register("date", { required: "Date is required." })}
                      />
                    </FormControl>
                    <FormMessage>{methods.formState.errors.date?.message}</FormMessage>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...methods.register("description", { required: "Description is required." })} 
                        placeholder="Enter description" 
                      />
                    </FormControl>
                    <FormMessage>{methods.formState.errors.description?.message}</FormMessage>
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

export default RemarkForm;
