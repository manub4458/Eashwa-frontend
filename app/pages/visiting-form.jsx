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
  const [excelVisit, setExcelVisit] = useState([]);
  const [leads, setLeads] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [authToken, setAuthToken] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Available months for filter
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2019 + 1 }, (_, i) => ({
    value: (2020 + i).toString(),
    label: (2020 + i).toString(),
  }));

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setAuthToken(storedToken);
      fetchLeads(storedToken);
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setAuthToken(storedToken);
      fetchVisitors(storedToken, page, limit, filterMonth, filterYear);
    }
  }, [page, filterMonth, filterYear]);

  const getPageNumbers = () => {
    let start = Math.max(1, page - 1);
    let end = Math.min(totalPages, page + 1);

    if (page === 1) {
      end = Math.min(totalPages, 3);
    }
    if (page === totalPages) {
      start = Math.max(1, totalPages - 2);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const fetchVisitors = async (
    token,
    pageNumber = 1,
    pageLimit = 10,
    month = "",
    year = ""
  ) => {
    try {
      let url = `https://backend-eashwa.vercel.app/api/user/get-visitor?page=${pageNumber}&limit=${pageLimit}`;
      if (month && year) {
        url += `&month=${month}&year=${year}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setVisits(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setPage(response.data.pagination.currentPage);
        setLimit(response.data.pagination.itemsPerPage);
      }
    } catch (error) {
      console.error("Error fetching visitors:", error);
      alert("Failed to fetch visitors.");
    }
  };

  const fetchExcelVisitors = async (token) => {
    try {
      let url = `https://backend-eashwa.vercel.app/api/user/get-visitor?page=1&limit=1000`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        return response.data.data;
      }
    } catch (error) {
      console.error("Error fetching visitors for excel:", error);
      alert("Failed to fetch visitors for excel.");
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
      console.error("Error fetching leads:", error);
      alert("Failed to fetch leads.");
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
          fetchVisitors(authToken, page, limit, filterMonth, filterYear);
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
        fetchVisitors(authToken, page, limit, filterMonth, filterYear);
        alert("Visit deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting visit:", error);
      alert("An error occurred while deleting the visit.");
    }
  };

  const handleDownload = async () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const excelVisit = await fetchExcelVisitors(storedToken);
      const worksheet = XLSX.utils.json_to_sheet(excelVisit);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Visits");
      XLSX.writeFile(workbook, "visits.xlsx");
    }
  };

  // function formatDateTime(isoString) {
  //   const date = new Date(isoString);

  //   const formattedDate = date.toLocaleDateString("en-US", {
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   });

  //   const formattedTime = date.toLocaleTimeString("en-US", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });

  //   return `${formattedDate} ${formattedTime}`;
  // }

  function formatDateTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",   // 👈 keep it in UTC
  });
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
              min={new Date().toISOString().split("T")[0] + "T00:00"}
              max={new Date().toISOString().split("T")[0] + "T23:59"}
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
        <div className="flex space-x-4 mb-4">
          <div>
            <label
              className="block text-gray-700 font-medium mb-1"
              htmlFor="filterMonth"
            >
              Filter by Month
            </label>
            <select
              id="filterMonth"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            >
              <option value="">All Months</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="block text-gray-700 font-medium mb-1"
              htmlFor="filterYear"
            >
              Filter by Year
            </label>
            <select
              id="filterYear"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </select>
          </div>
        </div>
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
        <div className="flex justify-center space-x-2 my-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-2 py-1 bg-indigo-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {getPageNumbers().map((num) => (
            <button
              key={num}
              className={`px-2 py-1 rounded ${
                page === num ? "bg-[#d86331] text-white" : "bg-indigo-100"
              }`}
              onClick={() => setPage(num)}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-2 py-1 bg-indigo-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisitingForm;
