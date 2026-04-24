"use client";

import { useState, useEffect } from "react";

/* ─── Pending reason dialog ─── */
const PendingDialog = ({ isOpen, onClose, onSubmit, loading }) => {
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
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Reason for Pending Status</h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Please provide a detailed reason</label>
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
            <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 transition-all font-medium shadow-lg">
              {loading ? <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Updating...</div> : "Update Status"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Complete / Close dialog — admin sets warrantyStatus ─── */
const CompleteDialog = ({ isOpen, onClose, onSubmit, loading }) => {
  const [warrantyStatus, setWarrantyStatus] = useState("");
  const [statusRemark, setStatusRemark] = useState("");
  const isOutOfWarranty = warrantyStatus === "Out of Warranty";
  const canSubmit = warrantyStatus && (!isOutOfWarranty || statusRemark.trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(warrantyStatus, statusRemark);
    setWarrantyStatus("");
    setStatusRemark("");
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Close Ticket</h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Warranty Status <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["In Warranty", "Out of Warranty"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { setWarrantyStatus(opt); setStatusRemark(""); }}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                    warrantyStatus === opt
                      ? opt === "In Warranty"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Remark — only shown & required when Out of Warranty */}
          {isOutOfWarranty && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reason for Out of Warranty <span className="text-red-500">*</span>
              </label>
              <textarea
                value={statusRemark}
                onChange={(e) => setStatusRemark(e.target.value)}
                placeholder="Explain why this is out of warranty..."
                rows={3}
                required
                className="w-full p-4 border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all resize-none"
              />
              {!statusRemark.trim() && (
                <p className="mt-1 text-xs text-red-500">This field is required for Out of Warranty.</p>
              )}
            </div>
          )}

          {/* Optional remark for In Warranty */}
          {warrantyStatus === "In Warranty" && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Resolution Note (optional)</label>
              <textarea
                value={statusRemark}
                onChange={(e) => setStatusRemark(e.target.value)}
                placeholder="Add a closing note..."
                rows={2}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all resize-none text-sm"
              />
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">Cancel</button>
            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-all font-medium shadow-lg"
            >
              {loading ? <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Closing...</div> : "Close Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Helper: render component detail cell ─── */
const ComponentCell = ({ detail }) => {
  if (!detail || (!detail.code && !detail.serialNumber)) {
    return <span className="text-gray-300">—</span>;
  }
  return (
    <div className="text-xs space-y-0.5">
      {detail.code && <div><span className="text-gray-500">Code:</span> <span className="font-medium text-gray-800">{detail.code}</span></div>}
      {detail.serialNumber && <div><span className="text-gray-500">S/N:</span> <span className="font-medium text-gray-800">{detail.serialNumber}</span></div>}
    </div>
  );
};

/* ─── Main component ─── */
const TicketTable = ({ isAdmin = false, onRefresh }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", month: "" });
  const [pagination, setPagination] = useState({
    total: 0, page: 1, limit: 10, totalPages: 1, hasNextPage: false, hasPrevPage: false,
  });
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const warrantyColors = {
    "In Warranty": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Out of Warranty": "bg-red-50 text-red-700 border-red-200",
  };

  const statusColors = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Complete: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Out of Warranty": "bg-red-50 text-red-700 border-red-200",
  };

  const typeColors = {
    Replacement: "bg-blue-50 text-blue-700 border-blue-200",
    Short: "bg-purple-50 text-purple-700 border-purple-200",
    Bill: "bg-teal-50 text-teal-700 border-teal-200",
  };

  const fetchTickets = async (page = pagination.page) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.month) queryParams.append("month", filters.month);
      queryParams.append("page", page);
      queryParams.append("limit", pagination.limit);

      const response = await fetch(
        `https://eashwa-backend.vercel.app/api/tickets?${queryParams}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets);
        setPagination(data.pagination);
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
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchTickets(1);
  }, [filters]);

  const handleStatusUpdate = async (ticketId, status, warrantyStatus = "", statusRemark = "") => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const body = { status, statusRemark };
      if (warrantyStatus) body.warrantyStatus = warrantyStatus;
      const response = await fetch(
        `https://eashwa-backend.vercel.app/api/tickets/${ticketId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
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
      setShowCompleteDialog(false);
      setSelectedTicket(null);
    }
  };

  const handleActionClick = (ticket, status) => {
    if (status === "Pending") {
      setSelectedTicket(ticket);
      setShowStatusDialog(true);
    } else if (status === "Complete") {
      setSelectedTicket(ticket);
      setShowCompleteDialog(true);
    } else {
      handleStatusUpdate(ticket._id, status);
    }
  };

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString("en-IN") : "—";

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Filter by Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Complete">Complete</option>
              <option value="Out of Warranty">Out of Warranty</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Filter by Month</label>
            <input
              type="month"
              value={filters.month}
              onChange={(e) => setFilters((prev) => ({ ...prev, month: e.target.value }))}
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

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading tickets...</h3>
            <p className="text-gray-600">Please wait while we fetch your data</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-600">No tickets match your current filter criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1600px]">
              <thead className="bg-gradient-to-r from-orange-500 to-orange-600">
                <tr>
                  {[
                    "Ticket ID", "Dealer Name", "Location", "Agent Name",
                    "Complaint", "Battery", "Charger", "Motor", "Controller",
                    "Type", "Problem Description", "Purchase Date", "Complaint Date",
                    "Status", "Warranty Status", "Status Remark",
                    ...(!isAdmin ? ["Actions"] : []),
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {tickets.map((ticket, index) => (
                  <tr
                    key={ticket._id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-blue-50/50 transition-colors`}
                  >
                    <td className="px-4 py-4">
                      <div className="font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg inline-block">
                        #{ticket.ticketId}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900 whitespace-nowrap">{ticket.dealerName}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-600 whitespace-nowrap">{ticket.location}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900 whitespace-nowrap">{ticket.agentName}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[140px]">
                        {ticket.complaintRegarding?.map((c, i) => (
                          <span key={i} className="inline-block bg-orange-50 text-orange-700 text-xs px-2 py-1 rounded-md border border-orange-200 whitespace-nowrap">
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4"><ComponentCell detail={ticket.battery} /></td>
                    <td className="px-4 py-4"><ComponentCell detail={ticket.charger} /></td>
                    <td className="px-4 py-4"><ComponentCell detail={ticket.motor} /></td>
                    <td className="px-4 py-4"><ComponentCell detail={ticket.controller} /></td>
                    <td className="px-4 py-4">
                      {ticket.type ? (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${typeColors[ticket.type] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                          {ticket.type}
                        </span>
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-4">
                      <div className="max-w-[200px] text-sm text-gray-700 truncate" title={ticket.problemDescription}>
                        {ticket.problemDescription || <span className="text-gray-300">—</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 whitespace-nowrap">{formatDate(ticket.purchaseDate)}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 whitespace-nowrap">{formatDate(ticket.complainDate)}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[ticket.status]}`}>
                        {ticket.status === "Pending" && <div className="w-2 h-2 bg-amber-400 rounded-full mr-2 animate-pulse" />}
                        {ticket.status === "Complete" && (
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        {ticket.status}
                      </span>
                    </td>
                    {/* Warranty Status */}
                    <td className="px-4 py-4">
                      {ticket.warrantyStatus ? (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${warrantyColors[ticket.warrantyStatus]}`}>
                          {ticket.warrantyStatus}
                        </span>
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-4">
                      <div className="max-w-[160px]">
                        {ticket.statusRemark ? (
                          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg" title={ticket.statusRemark}>
                            {ticket.statusRemark.length > 50 ? `${ticket.statusRemark.substring(0, 50)}...` : ticket.statusRemark}
                          </div>
                        ) : <span className="text-gray-300">—</span>}
                      </div>
                    </td>
                    {!isAdmin && (
                      <td className="px-4 py-4">
                        {ticket.status === "Pending" ? (
                          <div className="flex flex-col gap-2">
                            <button onClick={() => handleActionClick(ticket, "Complete")} disabled={actionLoading} className="px-3 py-1.5 bg-emerald-500 text-white text-xs rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 font-medium shadow-sm">
                              Complete
                            </button>
                            <button onClick={() => handleActionClick(ticket, "Pending")} disabled={actionLoading} className="px-3 py-1.5 bg-amber-500 text-white text-xs rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 font-medium shadow-sm">
                              Pending
                            </button>
                            <button onClick={() => handleActionClick(ticket, "Out of Warranty")} disabled={actionLoading} className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 font-medium shadow-sm whitespace-nowrap">
                              Out of Warranty
                            </button>
                          </div>
                        ) : <span className="text-gray-300">—</span>}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && tickets.length > 0 && (
        <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium text-gray-900">{(pagination.page - 1) * pagination.limit + 1}</span>
            {" "}to{" "}
            <span className="font-medium text-gray-900">{Math.min(pagination.page * pagination.limit, pagination.total)}</span>
            {" "}of{" "}
            <span className="font-medium text-gray-900">{pagination.total}</span> tickets
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchTickets(pagination.page - 1)}
              disabled={!pagination.hasPrevPage || loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => fetchTickets(item)}
                      className={`w-9 h-9 text-sm font-medium rounded-xl transition-colors ${item === pagination.page ? "bg-orange-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                      {item}
                    </button>
                  )
                )}
            </div>
            <button
              onClick={() => fetchTickets(pagination.page + 1)}
              disabled={!pagination.hasNextPage || loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <PendingDialog
        isOpen={showStatusDialog}
        onClose={() => { setShowStatusDialog(false); setSelectedTicket(null); }}
        onSubmit={(reason) => handleStatusUpdate(selectedTicket._id, "Pending", "", reason)}
        loading={actionLoading}
      />
      <CompleteDialog
        isOpen={showCompleteDialog}
        onClose={() => { setShowCompleteDialog(false); setSelectedTicket(null); }}
        onSubmit={(warrantyStatus, statusRemark) => handleStatusUpdate(selectedTicket._id, "Complete", warrantyStatus, statusRemark)}
        loading={actionLoading}
      />
    </div>
  );
};

export default TicketTable;
