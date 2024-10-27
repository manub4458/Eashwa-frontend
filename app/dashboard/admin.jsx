"use client";
import { useForm, FormProvider } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

const AdminDashboard = () => {
  const methods = useForm({
    defaultValues: {
      product: "",
      quantity: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Form submitted:", data); // Log submitted data to the console
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-blue-500 p-4 md:p-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="text-white font-bold text-2xl">
           <Link href='/'>
           <img src="/logo.png" alt="Logo" className="h-16 w-24 inline-block mr-2" />
           </Link>
          </div>

          {/* Navigation */}
          <nav className="text-white space-x-4 md:space-x-6">
            <a href="/" className="hover:text-gray-300 text-lg md:text-2xl">E-Battery Dashboard</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto p-4 md:p-8 flex justify-center items-center">
        <Card className="w-full max-w-lg bg-white shadow-2xl rounded-lg">
          {/* Card Header */}
          <CardHeader className="bg-gradient-to-r from-blue-500 to-green-600 text-white text-center rounded-t-lg p-5">
            <CardTitle className="text-2xl font-semibold">
              Product Stock Management
            </CardTitle>
            <p className="text-sm">Fill out the form to update product stock</p>
          </CardHeader>

          {/* Form Section */}
          <CardContent className="p-6">
            <FormProvider {...methods}>
              <Form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
                {/* Select Product */}
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">Select Product</FormLabel>
                  <FormControl>
                    <Select {...methods.register("product", { required: true })}>
                      <SelectTrigger className="mt-2 w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 transition duration-300">
                        <SelectValue placeholder="Choose a product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lead acid battery">Lead Acid Battery</SelectItem>
                        <SelectItem value="Lithium-ion battery">Lithium-Ion Battery</SelectItem>
                        <SelectItem value="Lead acid battery charger">Lead Acid Battery Charger</SelectItem>
                        <SelectItem value="Lithium-ion battery charger">Lithium-Ion Battery Charger</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>

                {/* Quantity Input */}
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">Enter Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...methods.register("quantity", { required: true })}
                      placeholder="Enter number of items"
                      className="mt-2 w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 transition duration-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
