"use client";
import React, { useEffect, useState } from "react";
import VisitingForm from "./visiting-form";
import Link from "next/link";

const Employe = () => {
  const [eScootyWork, setEScootyWork] = useState(0);
  const [eRickshawWork, setERickshawWork] = useState(0);
  const [scootyWork, setScootyWork] = useState(0);
  const [eScootyTargets, setEScootyTargets] = useState(100);
  const [eRickshawTargets, setERickshawTargets] = useState(100);
  const [scootyTargets, setScootyTargets] = useState(100);
  const [user, setUser] = useState(null);

  // API call function
  const updateTarget = async (key, value) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://backend-eashwa.vercel.app/api/user/update-completed-target", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ key, value }),
      });
  
      if (!response.ok) {
        console.error("Error updating target:", key);
        return;
      }
  
      const data = await response.json();
      // Update user state with the response data
      setUser(data.user);
  
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  // Update daily work and remaining targets for e-scooty
  const handleEScootyWorkUpdate = (workCompleted) => {
    const work = parseInt(workCompleted, 10) || 0;
    setEScootyWork((prev) => prev + work);
    setEScootyTargets((prev) => prev - work);
    updateTarget("battery", work); // API call for eScooty work update
  };

  // Update daily work and remaining targets for e-rickshaws
  const handleERickshawWorkUpdate = (workCompleted) => {
    const work = parseInt(workCompleted, 10) || 0;
    setERickshawWork((prev) => prev + work);
    setERickshawTargets((prev) => prev - work);
    updateTarget("eRickshaw", work); // API call for eRickshaw work update
  };

  // Update daily work and remaining targets for scooty
  const handleScootyWorkUpdate = (workCompleted) => {
    const work = parseInt(workCompleted, 10) || 0;
    setScootyWork((prev) => prev + work);
    setScootyTargets((prev) => prev - work);
    updateTarget("scooty", work); // API call for scooty work update
  };

  // Load user data from local storage
  useEffect(() => {
    const data = localStorage.getItem("user");
    setUser(JSON.parse(data));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100">
      {/* Header Section */}
      <header className="bg-gradient-to-r py-4 shadow-md">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/employee-dash">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-32 h-auto object-cover mr-4"
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
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-indigo-400 shadow-lg">
            <img
              src={user?.profilePicture || "/placeholder-profile.png"}
              alt={`${user?.name || "User"}'s profile`}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h3 className="text-2xl font-bold text-indigo-800 uppercase mb-2">
              {user?.name || "N/A"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 uppercase">
              <p className="text-gray-700">
                <strong>Email:</strong> {user?.email || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Phone:</strong> {user?.phone || "N/A"}
              </p>
              <p className="text-gray-700 uppercase">
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
        <section className="bg-white rounded-xl shadow-lg p-8 border-2 border-indigo-400">
          <h2 className="text-3xl font-semibold text-indigo-800 mb-6 text-center">
            Your Monthly Targets
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
            {/* E-Scooty Section */}
            <div className="p-6 bg-indigo-50 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-indigo-700 mb-2">E-Scooty</h3>
              <p className="text-gray-700">
                <strong>Total Target:</strong> {user?.targetAchieved.battery.total|| "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Completed Target:</strong> {user?.targetAchieved.battery.completed|| "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Pending Target:</strong> {user?.targetAchieved.battery.pending|| "N/A"}
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target;
                  const workCompleted = form.workCompleted.value;
                  handleEScootyWorkUpdate(workCompleted);
                  form.reset();
                }}
              >
                <input
                  type="number"
                  name="workCompleted"
                  placeholder="Enter E-Scooty work"
                  className="p-2 border rounded w-full mb-2"
                  required
                />
                <button
                  type="submit"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </form>
            </div>

            {/* E-Rickshaws Section */}
            <div className="p-6 bg-indigo-50 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-indigo-700 mb-2">
                E-Rickshaws
              </h3>
              <p className="text-gray-700">
              <strong>Total Target:</strong> {user?.targetAchieved.eRickshaw.total|| "N/A"}

              </p>
              <p className="text-gray-700">
                <strong>Completed Target:</strong> {user?.targetAchieved.eRickshaw.completed|| "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Pending Target:</strong> {user?.targetAchieved.eRickshaw.pending|| "N/A"}
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target;
                  const workCompleted = form.workCompleted.value;
                  handleERickshawWorkUpdate(workCompleted);
                  form.reset();
                }}
              >
                <input
                  type="number"
                  name="workCompleted"
                  placeholder="Enter E-Rickshaw work"
                  className="p-2 border rounded w-full mb-2"
                  required
                />
                <button
                  type="submit"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </form>
            </div>

            {/* Scooty Section */}
            <div className="p-6 bg-indigo-50 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-indigo-700 mb-2">
               Battery
              </h3>
              <p className="text-gray-700">
              <strong>Total Target:</strong> {user?.targetAchieved.scooty.total|| "N/A"}

              </p>
              <p className="text-gray-700">
                <strong>Completed Target:</strong> {user?.targetAchieved.scooty.completed|| "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Pending Target:</strong> {user?.targetAchieved.scooty.pending|| "N/A"}
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target;
                  const workCompleted = form.workCompleted.value;
                  handleScootyWorkUpdate(workCompleted);
                  form.reset();
                }}
              >
                <input
                  type="number"
                  name="workCompleted"
                  placeholder="Enter Scooty work"
                  className="p-2 border rounded w-full mb-2"
                  required
                />
                <button
                  type="submit"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Visiting Form */}
        <section className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-4">
            Visiting Form
          </h2>
          <VisitingForm />
        </section>

        {/* History Section */}
        <section className="bg-gray-50 rounded-xl shadow-inner p-8 border border-gray-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Monthly Visits</h2>
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
    </div>
  );
};

export default Employe;
