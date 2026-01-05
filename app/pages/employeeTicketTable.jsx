"use client";

import { useState, useEffect } from "react";

const MyTicketTable = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    month: "",
  });

  const statusColors = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Complete: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Out of Warranty": "bg-red-50 text-red-700 border-red-200",
  };

  const fetchMyTickets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to view your tickets");
        setLoading(false);
        return;
      }

      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.month) queryParams.append("month", filters.month);

      const response = await fetch(
        `https://backend-eashwa.vercel.app/api/tickets/my-ticket?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || data);
      } else if (response.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
      } else {
        throw new Error("Failed to fetch your tickets");
      }
    } catch (error) {
      console.error("Error fetching my tickets:", error);
      alert("Error loading your tickets: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, [filters]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1800px] mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
                <p className="text-sm text-gray-600 mt-1">View and manage all your service requests</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-xl border border-orange-200">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-semibold text-orange-700">{tickets.length} Tickets</span>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Filter Options</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Status</label>
              <div className="relative">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white appearance-none font-medium text-gray-700"
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Complete">Complete</option>
                  <option value="Out of Warranty">Out of Warranty</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Month</label>
              <input
                type="month"
                value={filters.month}
                onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white font-medium text-gray-700"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ status: "", month: "" })}
                className="w-full px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all font-semibold shadow-sm hover:shadow flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {loading ? (
            <div className="p-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl mb-6 shadow-inner">
                <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Loading your tickets...</h3>
              <p className="text-gray-600">Please wait while we fetch your data</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No tickets found</h3>
              <p className="text-gray-600">You haven't raised any tickets yet or none match the filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1400px]">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600">
                    <th className="px-5 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Ticket ID</th>
                    <th className="px-5 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Dealer Info</th>
                    <th className="px-5 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Location</th>
                    <th className="px-5 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Complaint</th>
                    <th className="px-5 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Dates</th>
                    <th className="px-5 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Warranty</th>
                    <th className="px-5 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
                    <th className="px-5 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Remarks</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {tickets.map((ticket, index) => (
                    <tr
                      key={ticket._id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-orange-50/20"
                      } hover:bg-orange-50 transition-all duration-150`}
                    >
                      <td className="px-5 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="font-mono text-sm font-bold text-gray-900 bg-gradient-to-r from-orange-100 to-orange-50 px-3 py-2 rounded-lg inline-block border border-orange-200 shadow-sm">
                            #{ticket.ticketId}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="font-semibold text-gray-900 text-sm">{ticket.dealerName}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            {ticket.showroomName}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="font-medium text-gray-900 text-sm">{ticket.location}</span>
                        </div>
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {ticket.complaintRegarding?.map((complaint, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-1 rounded-lg border border-orange-300 shadow-sm"
                            >
                              {complaint}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-medium text-gray-500">Purchase:</span>
                            <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">{formatDate(ticket.purchaseDate)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-medium text-gray-500">Complaint:</span>
                            <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">{formatDate(ticket.complainDate)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border-2 shadow-sm ${
                            ticket.warrantyStatus === "In Warranty"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                              : "bg-red-50 text-red-700 border-red-300"
                          }`}
                        >
                          {ticket.warrantyStatus === "In Warranty" ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          )}
                          {ticket.warrantyStatus}
                        </span>
                      </td>
                      <td className="px-5 py-5">
                        <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border-2 shadow-sm ${statusColors[ticket.status]}`}>
                          {ticket.status === "Pending" && (
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                          )}
                          {ticket.status === "Complete" && (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-5 py-5">
                        <div className="max-w-sm space-y-2">
                          {ticket.statusRemark && (
                            <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-lg text-xs text-blue-900">
                              <div className="font-semibold text-blue-700 mb-1 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                Status:
                              </div>
                              {ticket.statusRemark.length > 60
                                ? `${ticket.statusRemark.substring(0, 60)}...`
                                : ticket.statusRemark}
                            </div>
                          )}
                          {ticket.remark && (
                            <div className="bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-xs text-gray-900">
                              <div className="font-semibold text-gray-700 mb-1">General:</div>
                              {ticket.remark}
                            </div>
                          )}
                          {!ticket.statusRemark && !ticket.remark && (
                            <span className="text-gray-400 text-xs italic">No remarks</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTicketTable;