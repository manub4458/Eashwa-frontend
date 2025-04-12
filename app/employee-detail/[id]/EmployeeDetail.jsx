"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import * as XLSX from "xlsx";
import HistoryTable from "../../../components/ui/HistoryTable";
import Link from "next/link";

const EmployeeDetail = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visits, setVisits] = useState([]);
  const [leads, setLeads] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedLeads, setUploadedLeads] = useState([]);
  const [uploadedTargetLeads, setUploadedTargetLeads] = useState([]);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterMonthTarget, setFilterMonthTarget] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterDateTarget, setFilterDateTarget] = useState("");
  const [selectedHistoryMonth, setSelectedHistoryMonth] = useState("");
  const [employees, setEmployees] = useState([]);
  const { id } = useParams();
  const fileInputRef = React.useRef(null);

  // Format date and time consistently
  function formatDateTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
      const response = await axios.get(
        `https://backend-eashwa.vercel.app/api/user/admin-managed-employees/${id}`,
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



  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

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
        "https://backend-eashwa.vercel.app/api/user/process-leads",
        {
          fileUrl: fileUrl,
          employeeId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Lead file uploaded successfully!");
      await fetchUser();
      await fetchLeadsHistory(token);
      await fetchTargetLeadsHistory(token);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const fetchLeadsHistory = async (token) => {
    try {
      const response = await axios.get(
        `https://backend-eashwa.vercel.app/api/user/get-file-lead/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = response.data;
      setUploadedLeads(data.files);
      localStorage.setItem("uploadedLeads", JSON.stringify(employeeLeads)); // Optional: sync with Employe
    } catch (error) {
      console.error("Error fetching leads history:", error);
    }
  };

  const fetchTargetLeadsHistory = async (token) => {
    try {
      const response = await axios.get(
        `https://backend-eashwa.vercel.app/api/user/get-target-lead/${id}`,
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

  const handleDeleteFile = async (fileId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `https://backend-eashwa.vercel.app/api/user/leads/regular-file/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: {
            requestId: id, // send requestId in body
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

  const handleTargetDeleteFile = async (fileId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `https://backend-eashwa.vercel.app/api/user/leads/target-file/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: {
            requestId: id, // send requestId in body
          },
        }
      );

      console.log("File deleted successfully:", response.data);
      fetchTargetLeadsHistory(token);
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

  async function downloadTemplateFile() {
    try {
      const fileUrl =
        "https://res.cloudinary.com/dfklkapwz/raw/upload/v1738514884/excel_files/pl8udultk2eauefz2cde.xlsx";
      const fileName = "template.xlsx";
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://backend-eashwa.vercel.app/api/user/employee-detail/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userData = response.data.user;
      setUser(userData);
      setVisits(response.data.visitors);
      setLeads(response.data.leads);

      const allMonths = [
        ...(userData?.targetAchieved?.battery?.history || []).map(
          (entry) => entry.month
        ),
        ...(userData?.targetAchieved?.eRickshaw?.history || []).map(
          (entry) => entry.month
        ),
        ...(userData?.targetAchieved?.scooty?.history || []).map(
          (entry) => entry.month
        ),
      ];
      const uniqueMonths = [...new Set(allMonths)].sort();
      if (uniqueMonths.length > 0) {
        setSelectedHistoryMonth(uniqueMonths[uniqueMonths.length - 1]);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetchUser();
    fetchLeadsHistory(token);
    fetchTargetLeadsHistory(token);
    fetchEmployees();
  }, [id]);

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(visits);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Visits");
    XLSX.writeFile(workbook, "visits.xlsx");
  };

  const handleTargetUpdate = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const currentDate = new Date();
      const currentMonth = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}`;

      await axios.put(
        `https://backend-eashwa.vercel.app/api/user/update-target/${id}`,
        {
          month: currentMonth,
          battery: user.targetAchieved.battery.current,
          eRickshaw: user.targetAchieved.eRickshaw.current,
          scooty: user.targetAchieved.scooty.current,
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
          current: {
            ...prev.targetAchieved[productType].current,
            [field]: parseInt(value) || 0,
            pending:
              field === "total"
                ? (parseInt(value) || 0) -
                  prev.targetAchieved[productType].current.completed
                : prev.targetAchieved[productType].current.total -
                  (parseInt(value) || 0),
          },
        },
      },
    }));
  }, []);

  const handleLeadDownload = () => {
    try {
      const excelData = leads?.map((lead, index) => ({
        "Sr. No.": index + 1,
        "Lead Date": new Date(lead.leadDate).toLocaleDateString(),
        "Calling Date": new Date(lead.callingDate).toLocaleDateString(),
        "Agent Name": lead.agentName,
        "Customer Name": lead.customerName,
        "Mobile No": lead.mobileNumber,
        Occupation: lead.occupation,
        Location: lead.location,
        Town: lead.town,
        State: lead.state,
        Status: lead.status,
        Remark: lead.remark,
        "Interest Status": lead.interestedAndNotInterested,
        "Office Visit": lead.officeVisitRequired ? "Yes" : "No",
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const columnWidths = [
        { wch: 8 },
        { wch: 12 },
        { wch: 12 },
        { wch: 15 },
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 10 },
        { wch: 25 },
        { wch: 15 },
        { wch: 12 },
      ];
      worksheet["!cols"] = columnWidths;
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
      XLSX.writeFile(workbook, `Leads_${new Date().toLocaleDateString()}.xlsx`);
    } catch (error) {
      console.error("Error downloading leads:", error);
      alert("Error downloading leads. Please try again.");
    }
  };

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

  if (!user) return <div>Loading...</div>;

  const TargetCard = React.memo(
    ({ title, data, productType, onInputChange }) => (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-[#d86331] mb-4">{title}</h3>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total
              </label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#d86331] focus:ring-[#d86331]"
                value={data.current.total}
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
                value={data.current.completed}
                onChange={(e) =>
                  onInputChange(productType, "completed", e.target.value)
                }
                max={data.current.total}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pending
              </label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#d86331] focus:ring-[#d86331]"
                value={data.current.pending}
                disabled
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p>
              <span className="font-medium">Total:</span> {data.current.total}
            </p>
            <p>
              <span className="font-medium">Completed:</span>{" "}
              {data.current.completed}
            </p>
            <p>
              <span className="font-medium">Pending:</span>{" "}
              {data.current.pending}
            </p>
          </div>
        )}
      </div>
    )
  );

  TargetCard.displayName = "TargetCard";

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-[#d86331] py-6 shadow-md">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-extrabold text-white">
            Employee Dashboard
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#d86331]">
                <img
                  src={user.profilePicture || "/placeholder-profile.png"}
                  alt={`${user.name}'s profile`}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-gray-800">
                {user.name}
              </h2>
              <p className="text-gray-600">{user.post}</p>
            </div>
            <div className="mt-6 space-y-4">
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

          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#d86331]">
                Current Target Information
              </h2>
              <div className="flex gap-2">
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
                <button
                  className="bg-[#d86331] text-white px-6 py-2 rounded-lg hover:bg-[#c55a2d] transition-colors"
                  onClick={downloadTemplateFile}
                >
                  Download Lead Template
                </button>
                <div className="relative">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".xlsx,.xls"
                    className="hidden"
                    disabled={isUploading}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="bg-[#d86331] text-white px-6 py-2 rounded-lg hover:bg-[#c55a2d] transition-colors disabled:opacity-50"
                  >
                    {isUploading ? "Uploading..." : "Upload Lead"}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TargetCard
                title="Battery"
                data={user.targetAchieved.battery}
                productType="battery"
                onInputChange={handleInputChange}
              />
              <TargetCard
                title="E-Rickshaw"
                data={user.targetAchieved.eRickshaw}
                productType="eRickshaw"
                onInputChange={handleInputChange}
              />
              <TargetCard
                title="Scooty"
                data={user.targetAchieved.scooty}
                productType="scooty"
                onInputChange={handleInputChange}
              />
            </div>

            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-[#d86331] mb-4">
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
                <table className="w-full table-auto border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-indigo-100">
                      <th className="border border-gray-200 px-4 py-2">
                        Category
                      </th>
                      <th className="border border-gray-200 px-4 py-2">
                        Total
                      </th>
                      <th className="border border-gray-200 px-4 py-2">
                        Completed
                      </th>
                      <th className="border border-gray-200 px-4 py-2">
                        Pending
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {selectedHistoryMonth ? (
                      <>
                        <tr>
                          <td className="border border-gray-200 px-4 py-2">
                            Battery
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {user.targetAchieved.battery.history.find(
                              (entry) => entry.month === selectedHistoryMonth
                            )?.total || 0}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {user.targetAchieved.battery.history.find(
                              (entry) => entry.month === selectedHistoryMonth
                            )?.completed || 0}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {user.targetAchieved.battery.history.find(
                              (entry) => entry.month === selectedHistoryMonth
                            )?.pending || 0}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-200 px-4 py-2">
                            E-Rickshaw
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {user.targetAchieved.eRickshaw.history.find(
                              (entry) => entry.month === selectedHistoryMonth
                            )?.total || 0}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {user.targetAchieved.eRickshaw.history.find(
                              (entry) => entry.month === selectedHistoryMonth
                            )?.completed || 0}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {user.targetAchieved.eRickshaw.history.find(
                              (entry) => entry.month === selectedHistoryMonth
                            )?.pending || 0}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-200 px-4 py-2">
                            Scooty
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {user.targetAchieved.scooty.history.find(
                              (entry) => entry.month === selectedHistoryMonth
                            )?.total || 0}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {user.targetAchieved.scooty.history.find(
                              (entry) => entry.month === selectedHistoryMonth
                            )?.completed || 0}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {user.targetAchieved.scooty.history.find(
                              (entry) => entry.month === selectedHistoryMonth
                            )?.pending || 0}
                          </td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="border border-gray-200 px-4 py-2 text-center"
                        >
                          No history available
                        </td>
                      </tr>
                    )} */}
                    {selectedHistoryMonth ? (
                      <>
                        <tr>
                          <td className="border border-gray-200 px-4 py-2">
                            Battery
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {[...user.targetAchieved.battery.history]
                              .reverse()
                              .find(
                                (entry) => entry.month === selectedHistoryMonth
                              )?.total || 0}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {[...user.targetAchieved.battery.history]
                              .reverse()
                              .find(
                                (entry) => entry.month === selectedHistoryMonth
                              )?.completed || 0}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {[...user.targetAchieved.battery.history]
                              .reverse()
                              .find(
                                (entry) => entry.month === selectedHistoryMonth
                              )?.pending || 0}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-200 px-4 py-2">
                            E-Rickshaw
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {[...user.targetAchieved.eRickshaw.history]
                              .reverse()
                              .find(
                                (entry) => entry.month === selectedHistoryMonth
                              )?.total || 0}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {[...user.targetAchieved.eRickshaw.history]
                              .reverse()
                              .find(
                                (entry) => entry.month === selectedHistoryMonth
                              )?.completed || 0}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {[...user.targetAchieved.eRickshaw.history]
                              .reverse()
                              .find(
                                (entry) => entry.month === selectedHistoryMonth
                              )?.pending || 0}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-200 px-4 py-2">
                            Scooty
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {[...user.targetAchieved.scooty.history]
                              .reverse()
                              .find(
                                (entry) => entry.month === selectedHistoryMonth
                              )?.total || 0}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {[...user.targetAchieved.scooty.history]
                              .reverse()
                              .find(
                                (entry) => entry.month === selectedHistoryMonth
                              )?.completed || 0}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {[...user.targetAchieved.scooty.history]
                              .reverse()
                              .find(
                                (entry) => entry.month === selectedHistoryMonth
                              )?.pending || 0}
                          </td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="border border-gray-200 px-4 py-2 text-center"
                        >
                          No history available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white my-10 shadow-lg rounded-lg p-6 border border-indigo-200">
          <h2 className="text-2xl font-bold text-[#d86331] mb-4">
            Monthly Visit Table
          </h2>
          <button
            onClick={handleDownload}
            className="bg-indigo-600 text-white px-4 py-2 rounded mb-4 hover:bg-indigo-700 transition"
          >
            Download Excel
          </button>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-200">
              <thead>
                <tr className="bg-indigo-100">
                  <th className="border border-gray-200 px-4 py-2">
                    Client Name
                  </th>
                  <th className="border border-gray-200 px-4 py-2">Phone</th>
                  <th className="border border-gray-200 px-4 py-2">Address</th>
                  <th className="border border-gray-200 px-4 py-2">Purpose</th>
                  <th className="border border-gray-200 px-4 py-2">Feedback</th>
                  <th className="border border-gray-200 px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {visits?.map((visit) => (
                  <tr key={visit.id} className="text-center">
                    <td className="border border-gray-200 px-4 py-2">
                      {visit.clientName}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {visit.clientPhoneNumber}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {visit.clientAddress}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {visit.purpose}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {visit.feedback}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {formatDateTime(visit.visitDateTime)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <HistoryTable
          title="Leads History"
          data={filteredLeadsTarget}
          filterMonth={filterMonthTarget}
          setFilterMonth={setFilterMonthTarget}
          formatDateTime={formatDateTime}
          showDelete={true}
          handleDeleteFile={handleTargetDeleteFile}
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
      </main>

      <footer className="bg-gray-800 text-white py-4 mt-auto">
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
