"use client";
import React, { useEffect, useState } from "react";
import VisitingForm from "./visiting-form";
import Link from "next/link";

const Employe = () => {
  const [eScootyWork, setEScootyWork] = useState(0);
  const [eRickshawWork, setERickshawWork] = useState(0);
  const [eScootyTargets, setEScootyTargets] = useState(100);
  const [eRickshawTargets, setERickshawTargets] = useState(100);
  const [user, setUser] = useState(null);

  // Update daily work and remaining targets for e-scooty
  const handleEScootyWorkUpdate = (workCompleted) => {
    const work = parseInt(workCompleted, 10) || 0;
    setEScootyWork((prev) => prev + work);
    setEScootyTargets((prev) => prev - work);
  };

  // Update daily work and remaining targets for e-rickshaws
  const handleERickshawWorkUpdate = (workCompleted) => {
    const work = parseInt(workCompleted, 10) || 0;
    setERickshawWork((prev) => prev + work);
    setERickshawTargets((prev) => prev - work);
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
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-indigo-400 shadow-lg">
            <img
              src={user?.profilePicture || "/placeholder-profile.png"}
              alt={`${user?.name || "User"}'s profile`}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h3 className="text-2xl font-bold text-indigo-800 mb-2">
              {user?.name || "N/A"}
            </h3>
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
        <section className="bg-white rounded-xl shadow-lg p-8 border-2 border-indigo-400">
          <h2 className="text-3xl font-semibold text-indigo-800 mb-6 text-center">
            Your Monthly Targets
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
            {/* E-Scooty Section */}
            <div className="p-6 bg-indigo-50 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-indigo-700 mb-2">E-Scooty</h3>
              <p className="text-gray-700">
                <strong>Total Target:</strong> {user?.targetAchieved.battery|| "N/A"}
              </p>
              {/* <p className="text-gray-700">
                <strong>Today Work:</strong> {eScootyWork || 0}
              </p>
              <p className="text-gray-700">
                <strong>Remaining Work:</strong> {eScootyTargets || 0}
              </p> */}
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
              <strong>Total Target:</strong> {user?.targetAchieved.eRickshaw|| "N/A"}

              </p>
              {/* <p className="text-gray-700">
                <strong>Today Work:</strong> {eRickshawWork || 0}
              </p>
              <p className="text-gray-700">
                <strong>Remaining Work:</strong> {eRickshawTargets || 0}
              </p> */}
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

            <div className="p-6 bg-indigo-50 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-indigo-700 mb-2">
                Scooty
              </h3>
              <p className="text-gray-700">
              <strong>Total Target:</strong> {user?.targetAchieved.scooty|| "N/A"}

              </p>
              {/* <p className="text-gray-700">
                <strong>Today Work:</strong> {eRickshawWork || 0}
              </p>
              <p className="text-gray-700">
                <strong>Remaining Work:</strong> {eRickshawTargets || 0}
              </p> */}
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
          <p className="text-sm">
            © {new Date().getFullYear()} Your Company Name. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Employe;
