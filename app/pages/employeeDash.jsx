"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const EmployeeDash = () => {
  const router = useRouter();

  const navigateTo = (path) => {
    router.push(path);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
      {/* Header */}
      <header className=" py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
         <Link href='/'>
         <div className="flex items-center">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-16 w-28 object-cover mr-4"
            />
          
          </div>
         </Link>

          {/* Title */}
          <h1 className="text-2xl font-bold text-indigo-600">Employee Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Monthly Report Page Card */}
          <div
            onClick={() => navigateTo("/monthly-report")}
            className="cursor-pointer transform hover:scale-105 transition-transform bg-white shadow-md rounded-lg overflow-hidden"
          >
            <img
              src="/monthly.jpeg"
              alt="Monthly Report"
              className="w-full h-40 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-indigo-600">
                Monthly Report
              </h2>
              <p className="text-gray-600 mt-2">
                Get insights into monthly employee performance and sales data.
              </p>
            </div>
          </div>

          {/* History Page Card */}
          <div
            onClick={() => navigateTo("/history-page")}
            className="cursor-pointer transform hover:scale-105 transition-transform bg-white shadow-md rounded-lg overflow-hidden"
          >
            <img
              src="/history.avif"
              alt="History Page"
              className="w-full h-40 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-indigo-600">History</h2>
              <p className="text-gray-600 mt-2">
                View past visits with filters and export options.
              </p>
            </div>
          </div>

          {/* Login for Employee Card */}
          <div
            onClick={() => navigateTo("/loginHr")}
            className="cursor-pointer transform hover:scale-105 transition-transform bg-white shadow-md rounded-lg overflow-hidden"
          >
            <img
              src="/login-employ.jpeg"
              alt="Employee Login"
              className="w-full h-40 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-indigo-600">
                Login for Employee
              </h2>
              <p className="text-gray-600 mt-2">
                Employees can log in to access their personal dashboards.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className=" py-4 text-center">
        <p className="text-lg">&copy; 2024 E-ashwa. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default EmployeeDash;
