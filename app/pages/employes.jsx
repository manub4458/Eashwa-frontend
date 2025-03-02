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
  const fileInputRef = useRef(null);
  const router = useRouter();

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
    router.push("/employee-dash");
  };

  // Load user data from local storage or fetch from backend
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

    fetchLeadsHistory(token);
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

        {/* Leads History Section */}
        <section className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-[#d86331] mb-4">
            Leads History
          </h2>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="border p-2">Date</th>
                {/* <th className="border p-2">File Name</th> */}
                <th className="border p-2">Download</th>
              </tr>
            </thead>
            <tbody>
              {uploadedLeads?.length > 0 ? (
                uploadedLeads.map((lead, index) => (
                  <tr key={index}>
                    <td className="border p-2">{formatDateTime(lead.uploadDate)}</td>
                    {/* <td className="border p-2">{lead.fileName}</td> */}
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="border p-2 text-center">
                    No leads uploaded yet.
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