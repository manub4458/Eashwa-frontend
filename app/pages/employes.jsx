// pages/employeeDashboard.js
"use client";
import React, { useEffect, useState } from "react";
import EmployeCard from "./employecard";
import TargetSection from "./targetSection";
import VisitingForm from "./visiting-form";

const Employe = () => {
  const [dailyWork, setDailyWork] = useState(0);
  const [targets, setTargets] = useState(100);
  const[user,setUser] = useState();
//  const data = localStorage.getItem('user');
//  console.log("data",data);
  const handleDailyWorkUpdate = (workCompleted) => {
    setDailyWork((prev) => prev + workCompleted);
    setTargets((prev) => prev - workCompleted);
  };
  useEffect(()=>{
 const data = localStorage.getItem('user');
 setUser(JSON.parse(data));
  },[])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">Employee Dashboard</h1>
          <p className="mt-3 text-xl italic opacity-90">
            Empowering employees to achieve their best every day!
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-10">
        {/* Employee Card */}
        <section className="bg-white shadow-lg rounded-xl p-6 border border-gray-300 flex flex-col sm:flex-row items-center gap-6">
  {/* User Profile Picture */}
  <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-200 shadow-sm">
    <img
      src={user?.profilePicture || "/placeholder-profile.png"} // Fallback to placeholder if no image
      alt={`${user?.name || "User"}'s profile`}
      className="w-full h-full object-cover"
    />
  </div>

  {/* User Details */}
  <div className="flex-1">
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{user?.name || "N/A"}</h3>
    <p className="text-sm text-gray-600 mb-1">
      <strong>Email:</strong> {user?.email || "N/A"}
    </p>
    <p className="text-sm text-gray-600 mb-1">
      <strong>Phone:</strong> {user?.phone || "N/A"}
    </p>
    <p className="text-sm text-gray-600 mb-1">
      <strong>Address:</strong> {user?.address || "N/A"}
    </p>
    <p className="text-sm text-gray-600 mb-1">
      <strong>Aadhaar Number:</strong> {user?.aadhaarNumber || "N/A"}
    </p>
    <p className="text-sm text-gray-600 mb-1">
      <strong>Employee ID:</strong> {user?.employeeId || "N/A"}
    </p>
    <p className="text-sm text-gray-600">
      <strong>Joining Date:</strong> {user?.joiningDate || "N/A"}
    </p>
    <p className="text-sm text-gray-600">
      <strong>Designation:</strong> {user?.post || "N/A"}
    </p>
  </div>
</section>


        {/* Targets Section */}
        <section className="bg-gradient-to-br from-white to-indigo-100 shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Your Targets</h2>
          <TargetSection
            targets={targets}
            dailyWork={dailyWork}
            onWorkUpdate={handleDailyWorkUpdate}
          />
        </section>

        {/* Visiting Form */}
        <section className="bg-white shadow-lg rounded-xl p-6 border border-gray-300">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Visiting Form</h2>
          <VisitingForm />
        </section>

        {/* History Section Placeholder */}
        <section className="bg-gray-100 shadow-inner rounded-xl p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">History Section</h2>
          <p className="text-gray-600">History of past visits will be displayed here...</p>
        </section>

        {/* Achievements Section */}
        <section className="bg-gradient-to-br from-indigo-50 to-white shadow-lg rounded-xl p-6 border border-indigo-200">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Achievements</h2>
          <div className="text-gray-700">
            <p className="mb-2">🎉 Top Sales Performer: John Smith</p>
            <p>Keep striving for excellence!</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Employe;

