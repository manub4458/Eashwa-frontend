"use client";
import React, { useEffect, useState } from "react";
import VisitingForm from "./visiting-form";
import Link from "next/link";

const Employe = () => {
  const [dailyWork, setDailyWork] = useState(0);
  const [targets, setTargets] = useState(100);
  const [user, setUser] = useState(null);

  const handleDailyWorkUpdate = (workCompleted) => {
    setDailyWork((prev) => prev + workCompleted);
    setTargets((prev) => prev - workCompleted);
  };

  useEffect(() => {
    const data = localStorage.getItem("user");
    setUser(JSON.parse(data));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100">
      {/* Header Section */}
      <header className="bg-gradient-to-r  py-4 shadow-md">
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
         <Link href='/employee-dash'>
         <div className="flex items-center">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-16 w-24 object-cover mr-4"
            />
          
          </div>
         </Link>

       
          <div>
            <h1 className="text-lg font-semibold">{user?.name || "Employee"}</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 space-y-12">
        {/* Employee Card */}
        <section className="bg-white rounded-xl shadow-md p-8 flex flex-col md:flex-row items-center gap-8">
          {/* User Profile Picture */}
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-indigo-400 shadow-lg">
            <img
              src={user?.profilePicture || "/placeholder-profile.png"}
              alt={`${user?.name || "User"}'s profile`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* User Details */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-indigo-800 mb-2">{user?.name || "N/A"}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-gray-700">
                <strong>Email:</strong> {user?.email || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Phone:</strong> {user?.phone || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Address:</strong> {user?.address || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Aadhaar Number:</strong> {user?.aadhaarNumber || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Employee ID:</strong> {user?.employeeId || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Joining Date:</strong> {user?.joiningDate || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Designation:</strong> {user?.post || "N/A"}
              </p>
            </div>
          </div>
        </section>

        {/* Targets Section */}
        <section className="bg-gradient-to-br from-indigo-100 to-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Your Targets</h2>
          <div className="text-gray-700">
            <p className="text-lg">
              Daily Work Completed:{" "}
              <span className="font-bold">{user?.targetAchieved || 0}</span>
            </p>
          </div>
        </section>

        {/* Visiting Form */}
        <section className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Visiting Form</h2>
          <VisitingForm />
        </section>

        {/* History Section */}
        <section className="bg-gray-50 rounded-xl shadow-inner p-8 border border-gray-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">History Section</h2>
          <p className="text-gray-600">History of past visits will be displayed here...</p>
        </section>

        {/* Achievements Section */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Achievements</h2>
          <div className="text-gray-700">
            <p className="mb-2">🎉 Top Sales Performer: John Smith</p>
            <p>Keep striving for excellence!</p>
          </div>
        </section>
      </main>

      <footer className="bg-indigo-600 text-white py-6">
        <div className="container mx-auto text-center">
          <p className="text-sm">© {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Employe;
