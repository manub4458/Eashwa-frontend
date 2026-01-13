"use client";

import { useState } from "react";

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      id: "orders",
      title: "For Placing an Order",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "orange",
      items: [
        "Orders must be placed only after receiving 90% of the order amount.",
        "If the form is filled before receiving the payment, it may be rejected by the Accounts Department due to non-receipt of payment.",
        "The order form must be filled before dispatch. If the form is not filled in the portal at the time of dispatch, the order will not be considered for targets and will affect incentives.",
        "Targets, achievements, and incentives will be calculated only on the basis of orders entered in the portal.",
        "All types of orders must be mentioned, including Dealership, Distributorship, and Single Scooty orders. For Single Scooty orders, upload the Bill instead of the PI.",
        "If you face any issue while filling the form, take a screenshot and share it with the IT Department within 24 hours. Issues reported after 24 hours will not be considered.",
        "You are not allowed to place previous month orders in the next month, as this creates database issues and such orders will not be considered."
      ]
    },
    {
      id: "leads",
      title: "Leads Rules (Telecallers)",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      color: "purple",
      items: [
        "Leads will be provided only through the Employee Dashboard.",
        "Only members who upload their previous day feedback will receive new leads the next day. The last acceptable time to upload feedback is 10:15 AM; after this, it will be considered as feedback not uploaded.",
        "Saturday is a follow-up day. No new leads will be provided on Saturday. You must follow up on all leads of the week and upload weekly feedback. On the last Saturday of the month, you must upload feedback for the entire month.",
        "The data sheet must be maintained strictly as per the given sheet guidelines and instructions provided by the Reporting Manager.",
        "If you face any issue while uploading the sheet, first check the format as per guidelines. If the issue still persists, contact the IT Department immediately. Issues reported after 10:15 AM the next day will not be considered."
      ]
    },
    {
      id: "excel",
      title: "Guidelines for Maintaining Data in Excel Sheet",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "indigo",
      items: [
        "Date format must be Month/Date/Year (Example: 01/12/2026).",
        "In the Occupation field, write only the client's occupation. Example: If the client is self-employed, write 'Self-Employee'.",
        "In the Location field, write the complete address. Town example: Baghpat; State example: Uttar Pradesh.",
        "In the Status field, mention only: Interested in 2W / 3W / Both / Only 2W, or as instructed by your Reporting Manager.",
        "In the Remarks field, write the details of the conversation and feedback given by the client, as instructed by your Reporting Manager.",
        "In the Interested or Not Interested field, write only one option: Interested or Not Interested.",
        "In the Visit Required field, write only 'Yes' or 'No'. The first letter must be capitalized."
      ]
    },
    {
      id: "conveyance",
      title: "For Monthly Conveyance",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: "blue",
      items: [
        "All Area Sales Managers and Sales Personnel involved in any kind of field work must fill the Visiting Form.",
        "Backdated entries are not allowed.",
        "Conveyance will be provided only on the basis of the Visiting Form.",
        "If you face any issue while filling the form, take a screenshot and share it with the IT Department within 24 hours. Issues reported after 24 hours will not be considered."
      ]
    },
    {
      id: "service",
      title: "Raise Ticket (Service)",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: "emerald",
      items: [
        "Fill the Service Form for all service-related issues and regularly check the status.",
        "If you find that the service person is not taking the issue seriously or not updating the request, coordinate with the Service Executive. If the issue is still unresolved, file a complaint with your Reporting Manager or Amit Sir.",
        "If you have not raised a service ticket, you cannot force the Service Executive to resolve the issue."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Terms & Conditions</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please read and understand these terms carefully. They are essential for smooth operations and compliance.
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-gradient-to-r from-orange-100 to-orange-50 border-2 border-orange-300 rounded-2xl p-6 shadow-md">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-orange-900 mb-2">Important Notice</h3>
              <p className="text-orange-800 leading-relaxed">
                All terms and conditions listed below are mandatory and must be followed strictly. Non-compliance may result in rejection of requests, loss of incentives, or other consequences as specified.
              </p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <div
              key={section.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <div
                className={`bg-gradient-to-r ${
                  section.color === "orange"
                    ? "from-orange-500 to-orange-600"
                    : section.color === "blue"
                    ? "from-blue-500 to-blue-600"
                    : section.color === "purple"
                    ? "from-purple-500 to-purple-600"
                    : section.color === "indigo"
                    ? "from-indigo-500 to-indigo-600"
                    : "from-emerald-500 to-emerald-600"
                } p-6 cursor-pointer`}
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <div className="text-white">{section.icon}</div>
                    </div>
                    <div>
                      <div className="text-white/80 text-sm font-semibold mb-1">Section {idx + 1}</div>
                      <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
                      <span className="text-white font-bold text-sm">{section.items.length} Rules</span>
                    </div>
                    <svg
                      className={`w-6 h-6 text-white transition-transform duration-300 ${
                        activeSection === section.id ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div
                className={`transition-all duration-300 ${
                  activeSection === section.id ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                <div className="p-6 space-y-4">
                  {section.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors group"
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm ${
                        section.color === "orange"
                          ? "bg-orange-100 text-orange-700 border border-orange-200"
                          : section.color === "blue"
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : section.color === "purple"
                          ? "bg-purple-100 text-purple-700 border border-purple-200"
                          : section.color === "indigo"
                          ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                          : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      }`}>
                        {itemIdx + 1}
                      </div>
                      <p className="text-gray-800 leading-relaxed flex-1 text-sm md:text-base">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Notice */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-gray-600 leading-relaxed mb-3">
                If you have any questions or need clarification regarding these terms and conditions, please contact your reporting manager or the IT Department.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Support
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  View Guidelines
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center text-sm text-gray-500">
          <p>Last updated: January 2026</p>
          <p className="mt-1">© 2026 All rights reserved</p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;