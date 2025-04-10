"use client";
import React, { useEffect, useState, useRef } from "react";
import VisitingForm from "./visiting-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import HistoryTable from "../../components/ui/HistoryTable";

const Employe = () => {
  const [user, setUser] = useState(null);
  const [uploadedLeads, setUploadedLeads] = useState([]);
  const [uploadedTargetLeads, setUploadedTargetLeads] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterMonthTarget, setFilterMonthTarget] = useState("");
  const [filterDateTarget, setFilterDateTarget] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedHistoryMonth, setSelectedHistoryMonth] = useState("");
  const fileInputRef = useRef(null);
  const router = useRouter();

  function formatDateTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  //   router.delete("/leads/regular-file/:fileId", deleteRegularLeadFile);  feedback delete employee
  // router.delete("/leads/target-file/:fileId", deleteTargetLeadFile);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("uploadedLeads");
    router.push("/employee-dash");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
      F;
    }

    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      const allMonths = [
        ...(parsedUser?.targetAchieved?.battery?.history || []).map(
          (entry) => entry.month
        ),
        ...(parsedUser?.targetAchieved?.eRickshaw?.history || []).map(
          (entry) => entry.month
        ),
        ...(parsedUser?.targetAchieved?.scooty?.history || []).map(
          (entry) => entry.month
        ),
      ];
      const uniqueMonths = [...new Set(allMonths)].sort();
      if (uniqueMonths.length > 0) {
        setSelectedHistoryMonth(uniqueMonths[uniqueMonths.length - 1]);
      }
    } else {
      fetchUserData(token);
    }

    fetchLeadsHistory(token);
    fetchTargetLeadsHistory(token);
  }, [router]);

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
      const allMonths = [
        ...(data.user?.targetAchieved?.battery?.history || []).map(
          (entry) => entry.month
        ),
        ...(data.user?.targetAchieved?.eRickshaw?.history || []).map(
          (entry) => entry.month
        ),
        ...(data.user?.targetAchieved?.scooty?.history || []).map(
          (entry) => entry.month
        ),
      ];
      const uniqueMonths = [...new Set(allMonths)].sort();
      if (uniqueMonths.length > 0) {
        setSelectedHistoryMonth(uniqueMonths[uniqueMonths.length - 1]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

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
      localStorage.setItem("uploadedLeads", JSON.stringify(data.files));
    } catch (error) {
      console.error("Error fetching leads history:", error);
    }
  };

  const fetchTargetLeadsHistory = async (token) => {
    try {
      const response = await axios.get(
        `https://backend-eashwa.vercel.app/api/user/get-target-lead`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = response.data;
      setUploadedTargetLeads(data.files);
    } catch (error) {
      console.error("Error fetching leads history:", error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", selectedFile);

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
      fetchLeadsHistory(token);
      fetchTargetLeadsHistory(token);
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

  // const handleDeleteFile = (fileId) => {
  //   const updatedLeads = uploadedLeads.filter((lead) => lead._id !== fileId);
  //   setUploadedLeads(updatedLeads);
  //   localStorage.setItem("uploadedLeads", JSON.stringify(updatedLeads));
  //   alert("File deleted successfully!");
  // };

  // const handleDeleteFile = async (fileId) => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     const response = await axios.delete(`https://backend-eashwa.vercel.app/api/user/leads/regular-file/${fileId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     console.log("File deleted successfully:", response.data);
  //     fetchLeadsHistory(token);

  //     // Optional: update your local state or refetch data
  //   } catch (error) {
  //     console.error("Error deleting file:", error.response?.data || error.message);
  //   }
  // };
  const handleDeleteFile = async (fileId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `https://backend-eashwa.vercel.app/api/user/leads/regular-file/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("File deleted successfully:", response.data);
      fetchLeadsHistory(token);
    } catch (error) {
      console.error(
        "Error deleting file:",
        error.response?.data || error.message
      );
    }
  };

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
    }
    return true;
  });

  const filteredLeadsTarget = uploadedTargetLeads.filter((lead) => {
    const leadDate = new Date(lead.uploadDate);
    const leadMonth = leadDate.toLocaleString("default", { month: "long" });
    const leadDay = leadDate.getDate();

    if (filterMonthTarget && filterDateTarget) {
      return (
        leadMonth === filterMonthTarget &&
        leadDay === parseInt(filterDateTarget)
      );
    } else if (filterMonthTarget) {
      return leadMonth === filterMonthTarget;
    } else if (filterDateTarget) {
      return leadDay === parseInt(filterDateTarget);
    }
    return true;
  });

  const getUniqueMonths = () => {
    const allMonths = [
      ...(user?.targetAchieved?.battery?.history || []).map(
        (entry) => entry.month
      ),
      ...(user?.targetAchieved?.eRickshaw?.history || []).map(
        (entry) => entry.month
      ),
      ...(user?.targetAchieved?.scooty?.history || []).map(
        (entry) => entry.month
      ),
    ];
    return [...new Set(allMonths)].sort();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100">
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

        <section className="bg-white rounded-xl shadow-lg p-8 border-2 border-indigo-400">
          <h2 className="text-3xl font-semibold text-[#d86331] mb-6 text-center">
            Current Monthly Targets
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-indigo-50 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-[#d86331] mb-2">Battery</h3>
              <p>
                <strong>Total:</strong>{" "}
                {user?.targetAchieved?.battery?.current?.total || 0}
              </p>
              <p>
                <strong>Completed:</strong>{" "}
                {user?.targetAchieved?.battery?.current?.completed || 0}
              </p>
              <p>
                <strong>Pending:</strong>{" "}
                {user?.targetAchieved?.battery?.current?.pending || 0}
              </p>
            </div>
            <div className="p-6 bg-indigo-50 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-[#d86331] mb-2">
                E-Rickshaw
              </h3>
              <p>
                <strong>Total:</strong>{" "}
                {user?.targetAchieved?.eRickshaw?.current?.total || 0}
              </p>
              <p>
                <strong>Completed:</strong>{" "}
                {user?.targetAchieved?.eRickshaw?.current?.completed || 0}
              </p>
              <p>
                <strong>Pending:</strong>{" "}
                {user?.targetAchieved?.eRickshaw?.current?.pending || 0}
              </p>
            </div>
            <div className="p-6 bg-indigo-50 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-[#d86331] mb-2">Scooty</h3>
              <p>
                <strong>Total:</strong>{" "}
                {user?.targetAchieved?.scooty?.current?.total || 0}
              </p>
              <p>
                <strong>Completed:</strong>{" "}
                {user?.targetAchieved?.scooty?.current?.completed || 0}
              </p>
              <p>
                <strong>Pending:</strong>{" "}
                {user?.targetAchieved?.scooty?.current?.pending || 0}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-[#d86331] mb-4">
            Target History
          </h2>
          <div className="mb-4">
            <select
              value={selectedHistoryMonth}
              onChange={(e) => setSelectedHistoryMonth(e.target.value)}
              className="border p-2 rounded w-full max-w-xs"
            >
              <option value="">Select Month</option>
              {getUniqueMonths().map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="border p-2">Category</th>
                  <th className="border p-2">Total</th>
                  <th className="border p-2">Completed</th>
                  <th className="border p-2">Pending</th>
                </tr>
              </thead>
              <tbody>
                {selectedHistoryMonth ? (
                  <>
                    <tr>
                      <td className="border p-2">Battery</td>
                      <td className="border p-2">
                        {user?.targetAchieved?.battery?.history?.find(
                          (entry) => entry.month === selectedHistoryMonth
                        )?.total || 0}
                      </td>
                      <td className="border p-2">
                        {user?.targetAchieved?.battery?.history?.find(
                          (entry) => entry.month === selectedHistoryMonth
                        )?.completed || 0}
                      </td>
                      <td className="border p-2">
                        {user?.targetAchieved?.battery?.history?.find(
                          (entry) => entry.month === selectedHistoryMonth
                        )?.pending || 0}
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-2">E-Rickshaw</td>
                      <td className="border p-2">
                        {user?.targetAchieved?.eRickshaw?.history?.find(
                          (entry) => entry.month === selectedHistoryMonth
                        )?.total || 0}
                      </td>
                      <td className="border p-2">
                        {user?.targetAchieved?.eRickshaw?.history?.find(
                          (entry) => entry.month === selectedHistoryMonth
                        )?.completed || 0}
                      </td>
                      <td className="border p-2">
                        {user?.targetAchieved?.eRickshaw?.history?.find(
                          (entry) => entry.month === selectedHistoryMonth
                        )?.pending || 0}
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-2">Scooty</td>
                      <td className="border p-2">
                        {user?.targetAchieved?.scooty?.history?.find(
                          (entry) => entry.month === selectedHistoryMonth
                        )?.total || 0}
                      </td>
                      <td className="border p-2">
                        {user?.targetAchieved?.scooty?.history?.find(
                          (entry) => entry.month === selectedHistoryMonth
                        )?.completed || 0}
                      </td>
                      <td className="border p-2">
                        {user?.targetAchieved?.scooty?.history?.find(
                          (entry) => entry.month === selectedHistoryMonth
                        )?.pending || 0}
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan="4" className="border p-2 text-center">
                      No history available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-[#d86331] mb-4">
            Visiting Form
          </h2>
          <VisitingForm />
        </section>

        <section className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-[#d86331] mb-4">
            Upload Feedbacks
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

        <HistoryTable
          title="Leads History"
          data={filteredLeadsTarget}
          filterMonth={filterMonthTarget}
          setFilterMonth={setFilterMonthTarget}
          formatDateTime={formatDateTime}
        />

        <HistoryTable
          title="Feedback History"
          data={filteredLeads}
          filterMonth={filterMonth}
          setFilterMonth={setFilterMonth}
          formatDateTime={formatDateTime}
          showDelete={true}
          handleDeleteFile={handleDeleteFile}
        />
      </main>
    </div>
  );
};

export default Employe;
