"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminOrdersTable from './adminOrdersTable';


const HrDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [hrInfo, setHrInfo] = useState(null);
  const router = useRouter();
  // Fetch HR and employees' data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
        const response = await axios.get(
          "https://backend-eashwa.vercel.app/api/user/employees/",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token for authentication
            },
          }
        );
        console.log("response", response);
        // setEmployees(response.data.employees); 
        setHrInfo(response.data.requestingUser); // Assuming the response contains HR info
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
        const response = await axios.get(
          "https://backend-eashwa.vercel.app/api/user/managed-employees",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token for authentication
            },
          }
        );
        console.log("response", response);
        setEmployees(response.data.employees); 

        // setHrInfo(response.data.requestingUser); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    fetchEmployees();
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/loginHr");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="bg-[#d86331] py-6 shadow-md">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-white capitalize">
            {hrInfo?.role} Dashboard
          </h1>
          <p
            className=" cursor-pointer font-bold text-white text-xl"
            onClick={handleLogout}
          >
            Logout
          </p>
        </div>
      </header>

      {/* HR Info Section */}
      {hrInfo && (
        <section className="bg-white shadow-lg rounded-lg mx-auto mt-10 p-8 max-w-5xl border-t-4 border-[#d86331]">
          <h2 className="text-xl font-semibold text-[#d86331] mb-6 capitalize">
          {
            hrInfo.post
          }

         <span className="pl-2">
         Information
         </span>
          </h2>
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-500 shadow">
              <img
                src={hrInfo.profilePicture || "/placeholder-profile.png"}
                alt={`${hrInfo.name}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-800">
                {hrInfo.name || "N/A"}
              </h3>
              {/* <p className="text-gray-500 text-sm">{hrInfo.designation || "HR Manager"}</p> */}
              <div className="text-gray-600">
                <p>
                  <strong>Email:</strong> {hrInfo.email || "N/A"}
                </p>
                <p>
                  <strong>Phone:</strong> {hrInfo.phone || "N/A"}
                </p>
                <p>
                  <strong>Employee ID:</strong> {hrInfo.employeeId || "N/A"}
                </p>
                <p>
                  <strong>Joining Date:</strong> {hrInfo.joiningDate || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

<Link href='/admin-table'>
<div className="flex justify-center my-4">
  <button
  class="flex justify-center  px-6 py-3 mt-6 rounded-2xl bg-gradient-to-r from-orange-400 to-orange-600 
         text-white font-semibold tracking-wide shadow-lg 
         hover:shadow-xl hover:scale-105 active:scale-95 
         transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-300"
  onclick="window.location.href='#form'"
>
  Go to All Orders Dashboard
</button>
</div>
</Link>
      {/* Main Section */}
      <main className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-[#d86331] mb-8">
          Employee Information
        </h2>

        {/* Employee Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {employees.length > 0 ? (
            employees.map((employee) => (
              <Link
                key={employee._id}
                href={`/employee-detail/${employee._id}`}
              >
                <div className="bg-white rounded-xl shadow-lg border-t-4 border-[#d86331] p-6 flex flex-col items-center transition-transform transform hover:scale-105">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-400 shadow-lg mb-4">
                    <img
                      src={
                        employee.profilePicture || "/placeholder-profile.png"
                      }
                      alt={`${employee.name}'s profile`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {employee.name || "N/A"}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {employee.post || "N/A"}
                  </p>
                  <div className="mt-4 text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>Email:</strong> {employee.email || "N/A"}
                    </p>
                    <p>
                      <strong>Phone:</strong> {employee.phone || "N/A"}
                    </p>
                    <p>
                      <strong>Employee ID:</strong>{" "}
                      {employee.employeeId || "N/A"}
                    </p>
                    <p>
                      <strong>Joining Date:</strong>{" "}
                      {employee.joiningDate || "N/A"}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500">No employees found.</p>
          )}
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

export default HrDashboard;
