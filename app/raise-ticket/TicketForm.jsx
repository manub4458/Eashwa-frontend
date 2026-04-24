"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const COMPLAINT_OPTIONS = ["Battery", "Charger", "Motor", "Controller"];

const COMPONENT_KEYS = {
  Battery: "battery",
  Charger: "charger",
  Motor: "motor",
  Controller: "controller",
};

const TicketForm = () => {
  const router = useRouter();

  /* ── Dealer list ── */
  const [dealers, setDealers] = useState([]);
  const [dealersLoading, setDealersLoading] = useState(true);

  /* ── Form state ── */
  const [formData, setFormData] = useState({
    dealer: "",          // ObjectId
    dealerName: "",      // auto-filled from selection
    location: "",
    agentName: "",
    complaintRegarding: [],
    battery: { code: "", serialNumber: "" },
    charger: { code: "", serialNumber: "" },
    motor: { code: "", serialNumber: "" },
    controller: { code: "", serialNumber: "" },
    type: "",
    problemDescription: "",
    purchaseDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /* ── Fetch dealers on mount ── */
  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://eashwa-backend.vercel.app/api/dealers?isActive=true",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const data = await res.json();
          setDealers(data.dealers || []);
        }
      } catch (err) {
        console.error("Failed to load dealers", err);
      } finally {
        setDealersLoading(false);
      }
    };
    fetchDealers();
  }, []);

  /* ── Handlers ── */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDealerChange = (e) => {
    const dealerId = e.target.value;
    const selected = dealers.find((d) => d._id === dealerId);
    setFormData((prev) => ({
      ...prev,
      dealer: dealerId,
      dealerName: selected ? selected.name : "",
      location: selected?.location || prev.location,
    }));
    if (errors.dealer) setErrors((prev) => ({ ...prev, dealer: "" }));
  };

  const handleCheckboxChange = (option) => {
    setFormData((prev) => ({
      ...prev,
      complaintRegarding: prev.complaintRegarding.includes(option)
        ? prev.complaintRegarding.filter((item) => item !== option)
        : [...prev.complaintRegarding, option],
    }));
    if (errors.complaintRegarding)
      setErrors((prev) => ({ ...prev, complaintRegarding: "" }));
  };

  const handleComponentChange = (component, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [component]: { ...prev[component], [field]: value },
    }));
  };

  /* ── Validation ── */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.dealer) newErrors.dealer = "Please select a dealer";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.agentName.trim()) newErrors.agentName = "Agent name is required";
    if (formData.complaintRegarding.length === 0)
      newErrors.complaintRegarding = "Please select at least one complaint type";
    if (!formData.type) newErrors.type = "Please select a type";
    if (!formData.purchaseDate) newErrors.purchaseDate = "Purchase date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    // Build payload — only include component details for selected complaints
    const payload = {
      dealer: formData.dealer,
      dealerName: formData.dealerName,
      location: formData.location,
      agentName: formData.agentName,
      complaintRegarding: formData.complaintRegarding,
      type: formData.type,
      problemDescription: formData.problemDescription,
      purchaseDate: formData.purchaseDate,
    };

    formData.complaintRegarding.forEach((complaint) => {
      const key = COMPONENT_KEYS[complaint];
      if (key) payload[key] = formData[key];
    });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://eashwa-backend.vercel.app/api/tickets/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        toast.success("Ticket Raised Successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        router.push("/employees");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit ticket");
      }
    } catch (error) {
      toast.error("Error submitting ticket: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => router.push("/employees");

  /* ── Complaint today date string ── */
  const todayStr = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const inputCls = (field) =>
    `w-full p-3.5 border-2 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-200 ${
      errors[field]
        ? "border-red-300 bg-red-50"
        : "border-gray-200 hover:border-gray-300"
    }`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Raise a Service Ticket</h2>
              <p className="text-orange-100 mt-1">
                Complaint Date: {todayStr}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">

            {/* ── Row 1: Dealer, Location, Agent ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Dealer Name Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dealer Name <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.dealer}
                  onChange={handleDealerChange}
                  className={inputCls("dealer")}
                  disabled={dealersLoading}
                >
                  <option value="">
                    {dealersLoading ? "Loading dealers…" : "Select Dealer"}
                  </option>
                  {dealers.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                {errors.dealer && (
                  <p className="mt-1 text-sm text-red-600">{errors.dealer}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={inputCls("location")}
                  placeholder="Enter location"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              {/* Agent Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Agent Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="agentName"
                  value={formData.agentName}
                  onChange={handleInputChange}
                  className={inputCls("agentName")}
                  placeholder="Enter agent name"
                />
                {errors.agentName && (
                  <p className="mt-1 text-sm text-red-600">{errors.agentName}</p>
                )}
              </div>
            </div>

            {/* ── Complaint Regarding ── */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Complaint Regarding <span className="text-red-500">*</span>
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (Select all that apply)
                </span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {COMPLAINT_OPTIONS.map((option) => {
                  const checked = formData.complaintRegarding.includes(option);
                  return (
                    <label
                      key={option}
                      className={`flex items-center space-x-3 cursor-pointer px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                        checked
                          ? "border-orange-400 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleCheckboxChange(option)}
                        className="w-4 h-4 text-orange-500 border-2 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="font-medium text-gray-700">{option}</span>
                    </label>
                  );
                })}
              </div>
              {errors.complaintRegarding && (
                <p className="mt-2 text-sm text-red-600">{errors.complaintRegarding}</p>
              )}
            </div>

            {/* ── Per-Component Code + Serial (only for selected complaints) ── */}
            {formData.complaintRegarding.length > 0 && (
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Component Details
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.complaintRegarding.map((complaint) => {
                    const key = COMPONENT_KEYS[complaint];
                    return (
                      <div
                        key={complaint}
                        className="border-2 border-orange-100 bg-orange-50/40 rounded-xl p-4 space-y-3"
                      >
                        <h4 className="font-semibold text-orange-700 text-sm">
                          {complaint}
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              {complaint} Code
                            </label>
                            <input
                              type="text"
                              value={formData[key].code}
                              onChange={(e) =>
                                handleComponentChange(key, "code", e.target.value)
                              }
                              placeholder={`${complaint} code`}
                              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-400 text-sm transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Serial Number
                            </label>
                            <input
                              type="text"
                              value={formData[key].serialNumber}
                              onChange={(e) =>
                                handleComponentChange(key, "serialNumber", e.target.value)
                              }
                              placeholder="Serial number"
                              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-400 text-sm transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Row 2: Type, Purchase Date ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={inputCls("type")}
                >
                  <option value="">Select Type</option>
                  <option value="Replacement">Replacement</option>
                  <option value="Short">Short</option>
                  <option value="Bill">Bill</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                )}
              </div>

              {/* Purchase Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Purchase Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleInputChange}
                  className={inputCls("purchaseDate")}
                />
                {errors.purchaseDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.purchaseDate}</p>
                )}
              </div>
            </div>

            {/* ── Problem Description ── */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Problem Description
              </label>
              <textarea
                name="problemDescription"
                value={formData.problemDescription}
                onChange={handleInputChange}
                placeholder="Describe the problem in detail…"
                rows={4}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 hover:border-gray-300 transition-all duration-200 resize-none"
              />
            </div>

            {/* ── Footer Buttons ── */}
            <div className="border-t border-gray-200 pt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Submitting…</span>
                  </span>
                ) : (
                  "Submit Ticket"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketForm;
