"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import * as XLSX from "xlsx";

const EmployeeDetail = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [visits, setVisits] = useState([]);
  const [leads, setLeads] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const { id } = useParams();

  const fileInputRef = React.useRef(null);

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
      setUser(response.data.user);
      setVisits(response.data.visitors);
      setLeads(response.data.leads);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(visits);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Visits");
    XLSX.writeFile(workbook, "visits.xlsx");
  };

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
              <button
                className="bg-[#d86331] text-white px-6 py-2 rounded-lg hover:bg-[#c55a2d] transition-colors disabled:opacity-50"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {/* <th className="border border-gray-200 px-4 py-2">Actions</th> */}
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
                      {/* {visit.visitDateTime} */}
                    </td>
                    {/* <td className="border border-gray-200 px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(visit.id)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(visit.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white my-10 shadow-lg rounded-lg p-6 border border-indigo-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#d86331]">Lead Table</h2>
            <div className="flex gap-2">
              <button
                onClick={handleLeadDownload}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                Download Leads
              </button>
            </div>
          </div>

          <div className="overflow-x-scroll">
            {leads.length === 0 ? (
              <div className="text-center py-4">No leads found</div>
            ) : (
              <table className="w-full table-auto border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-indigo-100">
                    <th className="border border-gray-200 px-4 py-2">
                      Sr. No.
                    </th>
                    <th className="border border-gray-200 px-4 py-2">
                      Lead Date
                    </th>
                    <th className="border border-gray-200 px-4 py-2">
                      Calling Date
                    </th>
                    <th className="border border-gray-200 px-4 py-2">
                      Agent Name
                    </th>
                    <th className="border border-gray-200 px-4 py-2">
                      Customer Name
                    </th>
                    <th className="border border-gray-200 px-4 py-2">
                      Mobile Number
                    </th>
                    <th className="border border-gray-200 px-4 py-2">
                      Occupation
                    </th>
                    <th className="border border-gray-200 px-4 py-2">
                      Location
                    </th>
                    <th className="border border-gray-200 px-4 py-2">Town</th>
                    <th className="border border-gray-200 px-4 py-2">State</th>
                    <th className="border border-gray-200 px-4 py-2">Status</th>
                    <th className="border border-gray-200 px-4 py-2">Remark</th>
                    <th className="border border-gray-200 px-4 py-2">
                      Interest Status
                    </th>
                    <th className="border border-gray-200 px-4 py-2">
                      Office Visit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, index) => (
                    <tr key={lead._id} className="text-center hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">
                        {index + 1}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {new Date(lead.leadDate).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {new Date(lead.callingDate).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {lead.agentName}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {lead.customerName}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {lead.mobileNumber}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {lead.occupation}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {lead.location}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {lead.town}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {lead.state}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${lead.status.toLowerCase() === "active"
                              ? "bg-green-100 text-green-800"
                              : lead.status.toLowerCase() === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {lead.remark}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {lead.interestedAndNotInterested}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${lead.officeVisitRequired
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                            }`}
                        >
                          {lead.officeVisitRequired ? "Yes" : "No"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
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
