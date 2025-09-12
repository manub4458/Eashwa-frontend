"use client";

// components/TicketTable.js
import { useState, useEffect } from "react";

const StatusDialog = ({ isOpen, onClose, onSubmit, loading }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(reason);
    setReason("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            Reason for Pending Status
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Please provide a detailed reason
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe why this ticket is being marked as pending..."
              rows={4}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Updating...
                </div>
              ) : (
                "Update Status"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TicketTable = ({ isAdmin = false, onRefresh }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    month: "",
  });
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const statusColors = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Complete: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Out of Warranty": "bg-red-50 text-red-700 border-red-200",
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams();

      if (filters.status) queryParams.append("status", filters.status);
      if (filters.month) queryParams.append("month", filters.month);

      const response = await fetch(
        `https://backend-eashwa.vercel.app/api/tickets?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      } else {
        throw new Error("Failed to fetch tickets");
      }
    } catch (error) {
      alert("Error fetching tickets: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const handleStatusUpdate = async (ticketId, status, statusRemark = "") => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://backend-eashwa.vercel.app/api/tickets/${ticketId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status, statusRemark }),
        }
      );

      if (response.ok) {
        fetchTickets();
        if (onRefresh) onRefresh();
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      alert("Error updating status: " + error.message);
    } finally {
      setActionLoading(false);
      setShowStatusDialog(false);
      setSelectedTicket(null);
    }
  };

  const handleActionClick = (ticket, status) => {
    if (status === "Pending") {
      setSelectedTicket(ticket);
      setShowStatusDialog(true);
    } else {
      handleStatusUpdate(ticket._id, status);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Filter by Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Complete">Complete</option>
              <option value="Out of Warranty">Out of Warranty</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Filter by Month
            </label>
            <input
              type="month"
              value={filters.month}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, month: e.target.value }))
              }
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: "", month: "" })}
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Loading tickets...
            </h3>
            <p className="text-gray-600">
              Please wait while we fetch your data
            </p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tickets found
            </h3>
            <p className="text-gray-600">
              No tickets match your current filter criteria
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1400px]">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Ticket ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Dealer Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Dealer Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Showroom
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Agent Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Agent Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Complaint
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Purchase Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Complaint Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Warranty
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status Remark
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Remark
                  </th>
                  {!isAdmin && (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {tickets.map((ticket, index) => (
                  <tr
                    key={ticket._id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    } hover:bg-blue-50/50 transition-colors`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg inline-block">
                        {ticket.ticketId}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {ticket.dealerName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {ticket.dealerPhone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {ticket.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {ticket.showroomName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {ticket.agentName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {ticket.agentPhone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {ticket.complaintRegarding?.map((complaint, i) => (
                          <span
                            key={i}
                            className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md border border-blue-200"
                          >
                            {complaint}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(ticket.purchaseDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(ticket.complainDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border text-nowrap ${
                          ticket.warrantyStatus === "In Warranty"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {ticket.warrantyStatus === "In Warranty" && (
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {ticket.warrantyStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                          statusColors[ticket.status]
                        }`}
                      >
                        {ticket.status === "Pending" && (
                          <div className="w-2 h-2 bg-amber-400 rounded-full mr-2 animate-pulse"></div>
                        )}
                        {ticket.status === "Complete" && (
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        {ticket.statusRemark ? (
                          <div
                            className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg"
                            title={ticket.statusRemark}
                          >
                            {ticket.statusRemark.length > 50
                              ? `${ticket.statusRemark.substring(0, 50)}...`
                              : ticket.statusRemark}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div
                          className="text-sm text-gray-900 truncate"
                          title={ticket.remark}
                        >
                          {ticket.remark || (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </div>
                    </td>
                    {!isAdmin && (
                      <td className="px-6 py-4">
                        {ticket.status === "Pending" ? (
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() =>
                                handleActionClick(ticket, "Complete")
                              }
                              disabled={actionLoading}
                              className="px-3 py-1.5 bg-emerald-500 text-white text-xs rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 font-medium shadow-sm"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() =>
                                handleActionClick(ticket, "Pending")
                              }
                              disabled={actionLoading}
                              className="px-3 py-1.5 bg-amber-500 text-white text-xs rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 font-medium shadow-sm"
                            >
                              Pending
                            </button>
                            <button
                              onClick={() =>
                                handleActionClick(ticket, "Out of Warranty")
                              }
                              disabled={actionLoading}
                              className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 font-medium shadow-sm"
                            >
                              Out of Warranty
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Status Dialog */}
      <StatusDialog
        isOpen={showStatusDialog}
        onClose={() => {
          setShowStatusDialog(false);
          setSelectedTicket(null);
        }}
        onSubmit={(reason) =>
          handleStatusUpdate(selectedTicket._id, "Pending", reason)
        }
        loading={actionLoading}
      />
    </div>
  );
};

export default TicketTable;
