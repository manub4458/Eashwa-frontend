"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify"; 

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i); // 2 years back, 2 ahead

const DailyLeadsDashboard = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId;

  const [data, setData] = useState({ dailyLeads: [], monthlyTotals: [] });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Filter state (separate from applied so user can change and hit Apply)
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  const fetchData = async () => {
    if (!userId || userId.length !== 24) {
      toast.error("Invalid user ID");
      setLoading(false);
      return;
    }

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
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to load data");
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      toast.error(error.message || "Error fetching daily leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId, currentMonth, currentYear]);

  const handleApplyFilters = () => {
    setCurrentMonth(filterMonth);
    setCurrentYear(filterYear);
  };

  const handleResetFilters = () => {
    const now = new Date();
    const m = now.getMonth() + 1;
    const y = now.getFullYear();
    setFilterMonth(m);
    setFilterYear(y);
    setCurrentMonth(m);
    setCurrentYear(y);
  };

  // Derived values from current month summary
  const monthlySummary = data.monthlyTotals?.[0] || {};
  const totalLeads = monthlySummary.totalLeads || 0;
  const interestedLeads = monthlySummary.totalInterested || 0;
  const notInterestedFake = monthlySummary.totalNotInterestedFake || 0;
  const nextMonthConnect = monthlySummary.totalNextMonthConnect || 0;
  const newDealersThisMonth = monthlySummary.totalNewDealers || 0;
  const conversionsFromOldMonth = monthlySummary.totalOldDealers || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
          <p className="mt-6 text-lg text-gray-700">Loading user lead data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Daily Leads Dashboard</h1>
          </div>
        </div>

        {/* ── Filters Bar ── */}
        <div className="bg-white rounded-2xl shadow border border-gray-200 px-6 py-4 mb-8 flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Month</label>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Year</label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleApplyFilters}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
          >
            Apply Filters
          </button>

          <button
            onClick={handleResetFilters}
            className="border border-gray-300 text-gray-600 hover:bg-gray-100 px-5 py-2 rounded-lg text-sm font-medium transition"
          >
            Reset
          </button>

          {/* Active filter badge */}
          <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium text-gray-700">Showing:</span>
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold">
              {MONTHS.find((m) => m.value === currentMonth)?.label} {currentYear}
            </span>
          </div>
        </div>

        {/* Monthly Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Total Leads</h3>
            <p className="text-4xl font-bold text-orange-600">{totalLeads}</p>
            <p className="text-sm text-gray-500 mt-2">Fake / Not Interested: {notInterestedFake}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Interested Leads</h3>
            <p className="text-4xl font-bold text-green-600">{interestedLeads}</p>
            <p className="text-sm text-gray-500 mt-2">New Dealers: {newDealersThisMonth}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Lead Conversions</h3>
            <p className="text-3xl font-bold text-blue-600">
              {newDealersThisMonth} new + {conversionsFromOldMonth} old
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This month: {newDealersThisMonth} | Old: {conversionsFromOldMonth}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Next Month Connect</h3>
            <p className="text-4xl font-bold text-yellow-600">{nextMonthConnect}</p>
          </div>
        </div>

        {/* Daily History Table */}
        <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Daily Leads History –{" "}
              {MONTHS.find((m) => m.value === currentMonth)?.label} {currentYear}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"># Leads</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interested</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Not Interested / Fake</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Month Connect</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dealers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.dailyLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                      No daily entries found for this month.
                    </td>
                  </tr>
                ) : (
                  data.dailyLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {new Date(lead.date).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.numberOfLeads}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.interestedLeads}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.notInterestedFake}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.nextMonthConnect}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.newDealers + lead.oldDealers}</td>
                    </tr>
                  ))
                )}

                {data.dailyLeads.length > 0 && (
                  <tr className="bg-orange-50 font-semibold">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-800">Month Total</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-800">{totalLeads}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-800">{interestedLeads}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-800">{notInterestedFake}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-800">{nextMonthConnect}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-800">
                      Total Dealers: {newDealersThisMonth + conversionsFromOldMonth}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyLeadsDashboard;