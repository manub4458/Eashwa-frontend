"use client";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

const VisitingForm = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    clientAddress: "",
    dateTime: "",
    purpose: "",
    feedback: "",
  });

  const [visits, setVisits] = useState([]);
  const [leads, setLeads] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [authToken, setAuthToken] = useState("");

  // Fetch visitors when component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setAuthToken(storedToken);
      fetchVisitors(storedToken);
      fetchLeads(storedToken);
    }
  }, []);

  // Fetch visitors API call
  const fetchVisitors = async (token) => {
    try {
      const response = await axios.get(
        "https://backend-eashwa.vercel.app/api/user/get-visitor",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setVisits(response.data.visitorDetails);
      }
    } catch (error) {
      console.error("Error fetching visitors:", error);
      alert("Failed to fetch visitors.");
    }
  };

  const fetchLeads = async (token) => {
    try {
      const response = await axios.get(
        "https://backend-eashwa.vercel.app/api/user/leads",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setLeads(response.data.leads);
      }
    } catch (error) {
      console.error("Error fetching visitors:", error);
      alert("Failed to fetch visitors.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authToken) {
      alert("Please log in to submit the form.");
      return;
    }

    try {
      const newVisit = {
        clientName: formData.clientName,
        clientPhoneNumber: formData.clientPhone,
        clientAddress: formData.clientAddress,
        visitDateTime: formData.dateTime,
        purpose: formData.purpose,
        feedback: formData.feedback,
      };

      if (isEditing) {
        // Update logic would need to be implemented with backend API
        alert("Editing not yet implemented with backend");
        return;
      } else {
        // API call to add a visitor
        const response = await axios.post(
          "https://backend-eashwa.vercel.app/api/user/add-visitor",
          newVisit,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response.status === 201 || response.status === 200) {
          // Refetch visitors to get updated list from backend
          fetchVisitors(authToken);
          alert("Visit logged successfully!");
        } else {
          throw new Error("Failed to log visit.");
        }
      }

      // Reset form
      setFormData({
        clientName: "",
        clientPhone: "",
        clientAddress: "",
        dateTime: "",
        purpose: "",
        feedback: "",
      });

      setIsEditing(false);
      setEditingId(null);
    } catch (error) {
      console.error("Error logging visit:", error);
      alert("An error occurred while logging the visit.");
    }
  };

  const handleEdit = (id) => {
    const visitToEdit = visits.find((visit) => visit.id === id);
    if (visitToEdit) {
      setFormData({
        clientName: visitToEdit.clientName,
        clientPhone: visitToEdit.clientPhoneNumber,
        clientAddress: visitToEdit.clientAddress,
        dateTime: visitToEdit.visitDateTime,
        purpose: visitToEdit.purpose,
        feedback: visitToEdit.feedback,
      });
      setIsEditing(true);
      setEditingId(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `https://backend-eashwa.vercel.app/api/user/delete-visitor/${id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        // Refetch visitors to get updated list from backend
        fetchVisitors(authToken);
        alert("Visit deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting visit:", error);
      alert("An error occurred while deleting the visit.");
    }
  };

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

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 border border-indigo-200 mb-8">
        <h2 className="text-2xl font-bold text-[#d86331] mb-4">
          {isEditing ? "Edit Visit" : "Log a Customer Visit"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-gray-700 font-medium mb-1"
              htmlFor="clientName"
            >
              Client Name
            </label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
              placeholder="Enter Client name"
              required
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-medium mb-1"
              htmlFor="clientPhone"
            >
              Client Phone No
            </label>
            <input
              type="tel"
              id="clientPhone"
              name="clientPhone"
              value={formData.clientPhone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
              placeholder="Enter Client phone number"
              required
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-medium mb-1"
              htmlFor="clientAddress"
            >
              Client Address
            </label>
            <input
              type="text"
              id="clientAddress"
              name="clientAddress"
              value={formData.clientAddress}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
              placeholder="Enter Client address"
              required
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-medium mb-1"
              htmlFor="dateTime"
            >
              Date & Time
            </label>
            <input
              type="datetime-local"
              id="dateTime"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
              required
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-medium mb-1"
              htmlFor="purpose"
            >
              Purpose
            </label>
            <input
              type="text"
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
              placeholder="Ex. Dealer, Distributor"
              required
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-medium mb-1"
              htmlFor="feedback"
            >
              Feedback
            </label>
            <textarea
              id="feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
              placeholder="Ex. What client says..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-[#d86331] text-white py-2 px-4 rounded hover:bg-[#d8693a] transition duration-200"
          >
            {isEditing ? "Update Visit" : "Submit Visit"}
          </button>
        </form>
      </div>

      {/* Monthly Visit Table */}
      <div className="bg-white shadow-lg rounded-lg p-6 border border-indigo-200">
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
                  <th className="border border-gray-200 px-4 py-2">Sr. No.</th>
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
                  <th className="border border-gray-200 px-4 py-2">Location</th>
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
                        className={`px-2 py-1 rounded-full text-sm ${
                          lead.status.toLowerCase() === "active"
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
                        className={`px-2 py-1 rounded-full text-sm ${
                          lead.officeVisitRequired
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
    </div>
  );
};

export default VisitingForm;
