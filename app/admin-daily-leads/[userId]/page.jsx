// app/admin/daily-leads/[userId]/page.tsx or similar

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
// import DailyLeadsForm from "@/components/DailyLeadsForm"; // Adjust path
import { FiEdit, FiTrash2 } from "react-icons/fi"; // Install @heroicons/react if needed

const AdminDailyLeadsDashboard = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId;

  const [data, setData] = useState({
    dailyLeads: [],
    monthlyTotals: [],
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editLeadId, setEditLeadId] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const fetchData = async () => {
    if (!userId) return toast.error("Invalid user ID");

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required");
        router.push("/login");
        return;
      }

      const url = `https://backend-eashwa.vercel.app/api/daily-leads/user/${userId}?month=${currentMonth}&year=${currentYear}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to load data");

      const result = await response.json();
      setData(result);
    } catch (error) {
      toast.error(error.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId, currentMonth, currentYear]);

  const handleDelete = async (leadId) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://backend-eashwa.vercel.app/api/daily-leads/${leadId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Entry deleted successfully");
      fetchData(); // Refresh data
    } catch (error) {
      toast.error(error.message || "Error deleting entry");
    }
  };

  const handleEdit = (leadId) => {
    router.push(`/edit-daily-lead/${leadId}?userId=${userId}`);
  };

  // Derived metrics
  const monthlySummary = data.monthlyTotals?.[0] || {};
  const totalLeads = monthlySummary.totalLeads || 0;
  const interestedLeads = monthlySummary.totalInterestedLeads || 0;
  const notInterestedFake = monthlySummary.totalNotInterestedFake || 0;
  const nextMonthConnect = monthlySummary.totalNextMonthConnect || 0;
  const totalDealer = monthlySummary.totalDealer || 0;
  const newDealersThisMonth = totalDealer;
  const conversionsFromOldMonth = 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Daily Leads – User Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              ← Back
            </button>
            <button
              onClick={() => {
                router.push(`/add-daily-lead/${userId}`);
              }}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg font-medium"
            >
              + Add Daily Entry
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-8 flex gap-4">
          <select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(Number(e.target.value))}
            className="p-3 border rounded-lg"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={currentYear}
            onChange={(e) => setCurrentYear(Number(e.target.value))}
            min={2000}
            max={new Date().getFullYear() + 1}
            className="p-3 border rounded-lg w-24"
          />
        </div>

        {/* Summary Cards */}
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Total Leads</h3>
            <p className="text-4xl font-bold text-orange-600">{totalLeads}</p>
            <p className="text-sm text-gray-500 mt-2">Fake / Next Month: {notInterestedFake}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Interested Leads</h3>
            <p className="text-4xl font-bold text-green-600">{interestedLeads}</p>
            <p className="text-sm text-gray-500 mt-2">New Dealers: {newDealersThisMonth}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Conversions</h3>
            <p className="text-3xl font-bold text-blue-600">
              {newDealersThisMonth} new + {conversionsFromOldMonth} old
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This month: {totalLeads} | Old: {conversionsFromOldMonth}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Pending Next Month</h3>
            <p className="text-4xl font-bold text-yellow-600">{nextMonthConnect}</p>
            <p className="text-sm text-gray-500 mt-2">Fake leads included: 0</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow border overflow-hidden">
          <div className="px-6 py-5 border-b">
            <h2 className="text-xl font-semibold">
              Daily Leads History – {currentMonth}/{currentYear}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase"># Leads</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Interested</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Not Interested / Fake</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Next Month Connect</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Dealers</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.dailyLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{new Date(lead.date).toLocaleDateString("en-GB")}</td>
                    <td className="px-6 py-4 text-sm">{lead.numberOfLeads}</td>
                    <td className="px-6 py-4 text-sm">{lead.interestedLeads}</td>
                    <td className="px-6 py-4 text-sm">{lead.notInterestedFake}</td>
                    <td className="px-6 py-4 text-sm">{lead.nextMonthConnect}</td>
                    <td className="px-6 py-4 text-sm">{lead.totalDealer}</td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <button onClick={() => handleEdit(lead._id)} className="text-blue-600 hover:text-blue-800">
                      <FiEdit size={20} />
                      </button>
                      <button onClick={() => handleDelete(lead._id)} className="text-red-600 hover:text-red-800">
                       <FiTrash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
                {/* Month Total Row */}
                {data.dailyLeads.length > 0 && (
                  <tr className="bg-orange-50 font-semibold">
                    <td className="px-6 py-4 text-sm text-orange-800">Month Total</td>
                    <td className="px-6 py-4 text-sm text-orange-800">{totalLeads}</td>
                    <td className="px-6 py-4 text-sm text-orange-800">{interestedLeads}</td>
                    <td className="px-6 py-4 text-sm text-orange-800">{notInterestedFake}</td>
                    <td className="px-6 py-4 text-sm text-orange-800">{nextMonthConnect}</td>
                    <td className="px-6 py-4 text-sm text-orange-800">New Dealers: {newDealersThisMonth}</td>
                    <td></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* {showForm && (
        <DailyLeadsForm
          userId={userId}
          leadId={editLeadId}
          onClose={() => {
            setShowForm(false);
            setEditLeadId(null);
            fetchData();
          }}
        />
      )} */}
    </div>
  );
};

export default AdminDailyLeadsDashboard;