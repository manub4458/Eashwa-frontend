"use client";

import { useState, useEffect } from "react";

const API = "https://eashwa-backend.vercel.app/api/dealers";

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : "";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

/* ── Empty form shape ── */
const EMPTY = { name: "", phone: "", location: "", showroomName: "" };

/* ── Modal ── */
const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

/* ── Confirm delete dialog ── */
const ConfirmDialog = ({ dealer, onConfirm, onCancel, loading }) => (
  <Modal title="Delete Dealer" onClose={onCancel}>
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </div>
      <div>
        <p className="text-gray-800 font-semibold text-lg">Delete <span className="text-orange-600">{dealer?.name}</span>?</p>
        <p className="text-gray-500 text-sm mt-1">This action cannot be undone. The dealer will be permanently removed.</p>
      </div>
      <div className="flex gap-3 justify-center pt-2">
        <button onClick={onCancel} className="px-6 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={loading} className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 font-medium transition-all shadow-lg">
          {loading ? "Deleting…" : "Yes, Delete"}
        </button>
      </div>
    </div>
  </Modal>
);

/* ── Dealer Form ── */
const DealerForm = ({ initial = EMPTY, onSubmit, loading, onCancel }) => {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Dealer name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  const inputCls = (field) =>
    `w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all text-sm ${
      errors[field] ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-gray-300"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Dealer Name <span className="text-red-500">*</span>
        </label>
        <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Sharma Motors" className={inputCls("name")} />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit number" type="tel" className={inputCls("phone")} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
          <input name="location" value={form.location} onChange={handleChange} placeholder="City / Area" className={inputCls("location")} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Showroom Name</label>
        <input name="showroomName" value={form.showroomName} onChange={handleChange} placeholder="Optional showroom name" className={inputCls("showroomName")} />
      </div>

      <div className="flex gap-3 pt-2 justify-end">
        <button type="button" onClick={onCancel} className="px-6 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 font-medium shadow-lg transition-all">
          {loading ? "Saving…" : "Save Dealer"}
        </button>
      </div>
    </form>
  );
};

/* ── Main Page ── */
const DealerManagement = () => {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "active" | "inactive"

  const [showAdd, setShowAdd] = useState(false);
  const [editDealer, setEditDealer] = useState(null);
  const [deleteDealer, setDeleteDealer] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null); // { type: "success"|"error", msg }

  /* ── Fetch ── */
  const fetchDealers = async () => {
    setLoading(true);
    try {
      const res = await fetch(API, { headers: authHeaders() });
      const data = await res.json();
      setDealers(data.dealers || []);
    } catch {
      showToast("error", "Failed to load dealers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDealers(); }, []);

  /* ── Toast ── */
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── CRUD ── */
  const handleAdd = async (form) => {
    setSaving(true);
    try {
      const res = await fetch(API, { method: "POST", headers: authHeaders(), body: JSON.stringify(form) });
      if (!res.ok) throw new Error((await res.json()).message);
      showToast("success", "Dealer added successfully");
      setShowAdd(false);
      fetchDealers();
    } catch (err) {
      showToast("error", err.message || "Failed to add dealer");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (form) => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/${editDealer._id}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(form) });
      if (!res.ok) throw new Error((await res.json()).message);
      showToast("success", "Dealer updated successfully");
      setEditDealer(null);
      fetchDealers();
    } catch (err) {
      showToast("error", err.message || "Failed to update dealer");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (dealer) => {
    try {
      const res = await fetch(`${API}/${dealer._id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ ...dealer, isActive: !dealer.isActive }),
      });
      if (!res.ok) throw new Error();
      showToast("success", `Dealer ${dealer.isActive ? "deactivated" : "activated"}`);
      fetchDealers();
    } catch {
      showToast("error", "Failed to update status");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${API}/${deleteDealer._id}`, { method: "DELETE", headers: authHeaders() });
      if (!res.ok) throw new Error((await res.json()).message);
      showToast("success", "Dealer deleted");
      setDeleteDealer(null);
      fetchDealers();
    } catch (err) {
      showToast("error", err.message || "Failed to delete dealer");
    } finally {
      setDeleting(false);
    }
  };

  /* ── Filtered list ── */
  const filtered = dealers.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.location?.toLowerCase().includes(search.toLowerCase());
    const matchActive =
      activeFilter === "all" ? true :
      activeFilter === "active" ? d.isActive :
      !d.isActive;
    return matchSearch && matchActive;
  });

  const stats = {
    total: dealers.length,
    active: dealers.filter((d) => d.isActive).length,
    inactive: dealers.filter((d) => !d.isActive).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-gray-50">
      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white font-medium text-sm transition-all animate-fade-in ${
          toast.type === "success" ? "bg-emerald-500" : "bg-red-500"
        }`}>
          {toast.type === "success" ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          {toast.msg}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Dealer Management</h1>
            <p className="text-gray-500 mt-1 text-sm">Add, edit and manage all dealers for the ticket system</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all font-semibold shadow-lg hover:shadow-xl active:scale-95 text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Dealer
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Dealers", value: stats.total, color: "orange", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
            { label: "Active", value: stats.active, color: "emerald", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
            { label: "Inactive", value: stats.inactive, color: "gray", icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" },
          ].map(({ label, value, color, icon }) => (
            <div key={label} className="bg-white rounded-2xl px-6 py-5 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${color}-100`}>
                <svg className={`w-6 h-6 text-${color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or location…"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm transition-all"
            />
          </div>
          <div className="flex gap-2">
            {["all", "active", "inactive"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                  activeFilter === f
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-16 text-center">
              <div className="w-14 h-14 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Loading dealers…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-gray-700 font-semibold">No dealers found</p>
              <p className="text-gray-400 text-sm mt-1">
                {search ? "Try a different search term" : "Click \"Add Dealer\" to get started"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-orange-500 to-orange-600">
                  <tr>
                    {["#", "Dealer Name", "Phone", "Location", "Showroom", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((dealer, i) => (
                    <tr key={dealer._id} className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"} hover:bg-orange-50/50 transition-colors`}>
                      <td className="px-5 py-4 text-sm text-gray-400 font-mono">{i + 1}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
                            {dealer.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-900">{dealer.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{dealer.phone || <span className="text-gray-300">—</span>}</td>
                      <td className="px-5 py-4 text-sm text-gray-700">{dealer.location || <span className="text-gray-300">—</span>}</td>
                      <td className="px-5 py-4 text-sm text-gray-700">{dealer.showroomName || <span className="text-gray-300">—</span>}</td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleToggleActive(dealer)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                            dealer.isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${dealer.isActive ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
                          {dealer.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditDealer(dealer)}
                            className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-all"
                            title="Edit dealer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteDealer(dealer)}
                            className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all"
                            title="Delete dealer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Footer count ── */}
        {!loading && filtered.length > 0 && (
          <p className="text-center text-sm text-gray-400">
            Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of{" "}
            <span className="font-semibold text-gray-600">{dealers.length}</span> dealers
          </p>
        )}
      </div>

      {/* ── Modals ── */}
      {showAdd && (
        <Modal title="Add New Dealer" onClose={() => setShowAdd(false)}>
          <DealerForm onSubmit={handleAdd} loading={saving} onCancel={() => setShowAdd(false)} />
        </Modal>
      )}
      {editDealer && (
        <Modal title="Edit Dealer" onClose={() => setEditDealer(null)}>
          <DealerForm initial={{ name: editDealer.name, phone: editDealer.phone || "", location: editDealer.location || "", showroomName: editDealer.showroomName || "" }} onSubmit={handleEdit} loading={saving} onCancel={() => setEditDealer(null)} />
        </Modal>
      )}
      {deleteDealer && (
        <ConfirmDialog dealer={deleteDealer} onConfirm={handleDelete} onCancel={() => setDeleteDealer(null)} loading={deleting} />
      )}
    </div>
  );
};

export default DealerManagement;
