"use client";
import React from "react";
import { useRouter } from "next/navigation";

const EmployeeDash = () => {
  const router = useRouter();

  const navigateTo = (path) => {
    router.push(path);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-indigo-600 text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">Employee Management Dashboard</h1>
          <p className="mt-2 text-center text-lg italic text-indigo-200">
            Manage employees, track history, and review reports efficiently.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Employee Page Card */}
          <div
            onClick={() => navigateTo("/employees")}
            className="cursor-pointer transform hover:scale-105 transition-transform bg-white shadow-md rounded-lg overflow-hidden"
          >
            <img
              src="/employee.jpeg"
              alt="Employee Page"
              className="w-full h-40 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-indigo-600">
                Employee Management
              </h2>
              <p className="text-gray-600 mt-2">
                View and manage employee details, tasks, and targets.
              </p>
            </div>
          </div>

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

          {/* Login for HR Card */}
          <div
            onClick={() => navigateTo("/loginHr")}
            className="cursor-pointer transform hover:scale-105 transition-transform bg-white shadow-md rounded-lg overflow-hidden"
          >
            <img
              src="/login-employ.jpeg"
              alt="HR Login"
              className="w-full h-40 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-indigo-600">
                Login for HR
              </h2>
              <p className="text-gray-600 mt-2">
                HR personnel can log in to manage employee records and reports.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-indigo-600 text-white py-4 text-center">
        <p className="text-sm">
          &copy; 2024 E-ashwa. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default EmployeeDash;
