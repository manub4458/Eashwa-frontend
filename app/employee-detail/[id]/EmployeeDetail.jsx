"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

const EmployeeDetail = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://backend-eashwa.vercel.app/api/user/employee-detail/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleTargetUpdate = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `https://backend-eashwa.vercel.app/api/user/update-target/${id}`,
        {
          battery: {
            total: user.targetAchieved.battery.total,
            completed: user.targetAchieved.battery.completed,
          },
          eRickshaw: {
            total: user.targetAchieved.eRickshaw.total,
            completed: user.targetAchieved.eRickshaw.completed,
          },
          scooty: {
            total: user.targetAchieved.scooty.total,
            completed: user.targetAchieved.scooty.completed,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchUser();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating target:", error);
      alert("Failed to update targets. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = React.useCallback((productType, field, value) => {
    setUser((prev) => ({
      ...prev,
      targetAchieved: {
        ...prev.targetAchieved,
        [productType]: {
          ...prev.targetAchieved[productType],
          [field]: parseInt(value) || 0,
          pending:
            field === "total"
              ? (parseInt(value) || 0) -
                prev.targetAchieved[productType].completed
              : prev.targetAchieved[productType].total - (parseInt(value) || 0),
        },
      },
    }));
  }, []);

  if (!user) return <div>Loading...</div>;

  const TargetSection = React.memo(
    ({ title, data, productType, onInputChange }) => (
      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <h3 className="text-xl font-semibold text-[#d86331] mb-4">{title}</h3>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total
              </label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#d86331] focus:ring-[#d86331]"
                defaultValue={data.total}
                onChange={(e) =>
                  onInputChange(productType, "total", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Completed
              </label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#d86331] focus:ring-[#d86331]"
                defaultValue={data.completed}
                onChange={(e) =>
                  onInputChange(productType, "completed", e.target.value)
                }
                max={data.total}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pending
              </label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#d86331] focus:ring-[#d86331]"
                value={data.pending}
                disabled
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p>
              <span className="font-medium">Total:</span> {data.total}
            </p>
            <p>
              <span className="font-medium">Completed:</span> {data.completed}
            </p>
            <p>
              <span className="font-medium">Pending:</span> {data.pending}
            </p>
          </div>
        )}
      </div>
    )
  );

  TargetSection.displayName = "TargetSection";

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header and profile section remain unchanged */}
      <header className="bg-[#d86331] py-6 shadow-md">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-extrabold text-white">
            Employee Details
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Profile section remains unchanged */}
        <div className="bg-white rounded-xl shadow-lg border-t-4 border-[#d86331] p-8 mb-8">
          {/* Existing profile content */}
          <div className="flex items-center gap-8">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-400 shadow-lg">
              <img
                src={user.profilePicture || "/placeholder-profile.png"}
                alt={`${user.name}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-xl text-gray-600">{user.post}</p>
              <div className="grid grid-cols-2 gap-4 text-gray-600">
                <p>
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {user.phone}
                </p>
                <p>
                  <span className="font-medium">Employee ID:</span>{" "}
                  {user.employeeId}
                </p>
                <p>
                  <span className="font-medium">Joining Date:</span>{" "}
                  {user.joiningDate}
                </p>
                <p>
                  <span className="font-medium">Address:</span> {user.address}
                </p>
                <p>
                  <span className="font-medium">Aadhaar:</span>{" "}
                  {user.aadhaarNumber}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#d86331]">
            Target Information
          </h2>
          <button
            onClick={() =>
              isEditing ? handleTargetUpdate() : setIsEditing(true)
            }
            disabled={isLoading}
            className="bg-[#d86331] text-white px-6 py-2 rounded-lg hover:bg-[#c55a2d] transition-colors disabled:opacity-50"
          >
            {isLoading
              ? "Updating..."
              : isEditing
              ? "Save Changes"
              : "Edit Targets"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TargetSection
            title="Battery"
            data={user.targetAchieved.battery}
            productType="battery"
            onInputChange={handleInputChange}
          />
          <TargetSection
            title="E-Rickshaw"
            data={user.targetAchieved.eRickshaw}
            productType="eRickshaw"
            onInputChange={handleInputChange}
          />
          <TargetSection
            title="Scooty"
            data={user.targetAchieved.scooty}
            productType="scooty"
            onInputChange={handleInputChange}
          />
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Eashwa Automotive. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default EmployeeDetail;
