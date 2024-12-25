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
      <header className="py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-32 h-auto object-cover mr-4"
              />
            </div>
          </Link>

       
        </div>
      </header>

      {/* Welcome Text */}
      <div className="mt-6 text-center">
        <h2 className="text-4xl font-semibold text-[#d86331]">Welcome to the Employee Dashboard!</h2>
      </div>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          {/* Monthly Report Page Card */}
          <div
            onClick={() => navigateTo("/monthly-report")}
            className="cursor-pointer transform hover:scale-105 transition-transform bg-white shadow-md rounded-lg overflow-hidden"
          >
            <img
              src="/success.jpg"
              alt="Monthly Report"
              className="w-full h-52 object-cover"
            />
            <div className="p-6">
              <h2 className="text-3xl font-bold text-indigo-600">
                Achievements
              </h2>
              <p className="text-gray-600 mt-4">
                Get insights into monthly employee performance and sales data.
              </p>
            </div>
          </div>

          {/* Login for Employee Card */}
          <div
            onClick={() => navigateTo("/loginHr")}
            className="cursor-pointer transform hover:scale-105 transition-transform bg-white shadow-md rounded-lg overflow-hidden"
          >
            <img
              src="/login.jpg"
              alt="Employee Login"
              className="w-full h-52 object-cover"
            />
            <div className="p-6">
              <h2 className="text-3xl font-bold text-indigo-600">
                Login for Employee/Hr
              </h2>
              <p className="text-gray-600 mt-4">
                Employees can log in to access their personal dashboards.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-lg">&copy; 2024 E-ashwa. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default EmployeeDash;
