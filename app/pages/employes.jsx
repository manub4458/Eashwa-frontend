"use client";
import React, { useEffect, useState, useRef } from "react";
import VisitingForm from "./visiting-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

const Employe = () => {
  const [user, setUser] = useState(null);
  const [uploadedLeads, setUploadedLeads] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const fileInputRef = useRef(null);
  const router = useRouter();

  // Format date and time
  function formatDateTime(isoString) {
    const date = new Date(isoString);

    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${formattedDate} ${formattedTime}`;
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("uploadedLeads"); // Clear uploaded leads from localStorage
    router.push("/employee-dash");
  };

  // Load user data and uploaded leads from localStorage or fetch from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      fetchUserData(token);
    }

    // Load uploaded leads from localStorage
    const savedLeads = localStorage.getItem("uploadedLeads");
    if (savedLeads) {
      setUploadedLeads(JSON.parse(savedLeads));
    } else {
      fetchLeadsHistory(token);
    }
  }, [router]);

  // Fetch user data from backend
  const fetchUserData = async (token) => {
    try {
      const response = await fetch(
        "https://backend-eashwa.vercel.app/api/user/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch user data");
        return;
      }

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch leads history from backend
  const fetchLeadsHistory = async (token) => {
    try {
      const response = await fetch(
        "https://backend-eashwa.vercel.app/api/user/get-file-lead",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) return;
      const data = await response.json();
      setUploadedLeads(data.files);
      localStorage.setItem("uploadedLeads", JSON.stringify(data.files)); // Save to localStorage
    } catch (error) {
      console.error("Error fetching leads history:", error);
    }
  };

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Upload the file
      const uploadResponse = await axios.post(
        "https://backend-eashwa.vercel.app/api/images/upload-excel",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const fileUrl = uploadResponse.data.fileUrl;

      // Save the file URL and employee ID
      await axios.post(
        "https://backend-eashwa.vercel.app/api/user/upload-file-leads",
        {
          fileUrl: fileUrl,
          employeeId: user?.employeeId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Lead file uploaded successfully!");
      fetchLeadsHistory(token); // Refresh leads history
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle file deletion (frontend-only)
  const handleDeleteFile = (fileId) => {
    // Filter out the file with the given fileId
    const updatedLeads = uploadedLeads.filter((lead) => lead._id !== fileId);

    // Update the state to reflect the changes
    setUploadedLeads(updatedLeads);

    // Save the updated leads to localStorage
    localStorage.setItem("uploadedLeads", JSON.stringify(updatedLeads));

    alert("File deleted successfully!");
  };

  // Filter leads based on month and date
  const filteredLeads = uploadedLeads.filter((lead) => {
    const leadDate = new Date(lead.uploadDate);
    const leadMonth = leadDate.toLocaleString("default", { month: "long" });
    const leadDay = leadDate.getDate();

    if (filterMonth && filterDate) {
      return leadMonth === filterMonth && leadDay === parseInt(filterDate);
    } else if (filterMonth) {
      return leadMonth === filterMonth;
    } else if (filterDate) {
      return leadDay === parseInt(filterDate);
    } else {
      return true; // No filter applied
    }
  });

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
            <button
              onClick={handleLogout}
              className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 space-y-12">
        {/* Employee Card */}
        <section className="bg-white rounded-xl shadow-md p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 shadow-lg">
            <img
              src={user?.profilePicture || "/placeholder-profile.png"}
              alt={`${user?.name || "User"}'s profile`}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-[#d86331] uppercase mb-2">
              <strong className="capitalize">{user?.name || "N/A"}</strong>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p className="text-gray-700">
                <strong className="capitalize">Email:</strong>{" "}
                {user?.email || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="capitalize">Phone:</strong>{" "}
                {user?.phone || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="capitalize">Address:</strong>{" "}
                {user?.address || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="capitalize">Aadhaar Number:</strong>{" "}
                {user?.aadhaarNumber || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="capitalize">Employee ID:</strong>{" "}
                {user?.employeeId || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="capitalize">Joining Date:</strong>{" "}
                {user?.joiningDate || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong className="capitalize">Designation:</strong>{" "}
                {user?.post || "N/A"}
              </p>
            </div>
          </div>
        </section>

        {/* Targets Section */}
        <section className="bg-white rounded-xl shadow-lg p-8 border-2 border-indigo-400">
          <h2 className="text-3xl font-semibold text-[#d86331] mb-6 text-center">
            Your Monthly Targets
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
            {/* Scooty Section */}
            <div className="p-6 bg-indigo-50 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-[#d86331] mb-2">E-Scooty</h3>
              <p className="text-gray-700">
                <strong>Total Target:</strong>{" "}
                {user?.targetAchieved.scooty.total || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Completed Target:</strong>{" "}
                {user?.targetAchieved.scooty.completed || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Pending Target:</strong>{" "}
                {user?.targetAchieved.scooty.pending || "N/A"}
              </p>
            </div>

            {/* E-Rickshaws Section */}
            <div className="p-6 bg-indigo-50 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-[#d86331] mb-2">
                E-Rickshaws
              </h3>
              <p className="text-gray-700">
                <strong>Total Target:</strong>{" "}
                {user?.targetAchieved.eRickshaw.total || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Completed Target:</strong>{" "}
                {user?.targetAchieved.eRickshaw.completed || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Pending Target:</strong>{" "}
                {user?.targetAchieved.eRickshaw.pending || "N/A"}
              </p>
            </div>

            {/* Battery Section */}
            <div className="p-6 bg-indigo-50 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-[#d86331] mb-2">Battery</h3>
              <p className="text-gray-700">
                <strong>Total Target:</strong>{" "}
                {user?.targetAchieved.battery.total || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Completed Target:</strong>{" "}
                {user?.targetAchieved.battery.completed || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Pending Target:</strong>{" "}
                {user?.targetAchieved.battery.pending || "N/A"}
              </p>
            </div>
          </div>
        </section>

        {/* Visiting Form */}
        <section className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-[#d86331] mb-4">
            Visiting Form
          </h2>
          <VisitingForm />
        </section>

        {/* Upload Leads Section */}
        <section className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-[#d86331] mb-4">
            Upload Leads
          </h2>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="border p-2 rounded"
              ref={fileInputRef}
            />
            <button
              onClick={handleFileUpload}
              disabled={isUploading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </section>

        {/* Leads Table with Filters */}
        <section className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-[#d86331] mb-4">
            Leads History
          </h2>
          {/* Filter Controls */}
          <div className="flex gap-4 mb-4">
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Select Month</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
            <input
              type="number"
              placeholder="Enter Date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border p-2 rounded"
              min="1"
              max="31"
            />
          </div>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="border p-2">Date</th>
                <th className="border p-2">Download</th>
                <th className="border p-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead, index) => (
                  <tr key={index}>
                    <td className="border p-2">{formatDateTime(lead.uploadDate)}</td>
                    <td className="border p-2">
                      <a
                        href={lead.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        Download
                      </a>
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={() => handleDeleteFile(lead._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="border p-2 text-center">
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Employe;