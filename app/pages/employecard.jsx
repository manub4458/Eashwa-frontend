
import React from "react";

const EmployeCard = ({ name, image, phone, email, address, aadhar, joiningDate, position, empId, targetAchieved, isTopEmployer }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-300 transform hover:-translate-y-2 transition-all duration-300">
      {/* Header with Image and Details */}
      <div className="flex items-center bg-gradient-to-r from-indigo-600 to-blue-500 p-5 text-white">
        <img
          src={image}
          alt={name}
          className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
        />
        <div className="ml-4">
          <h2 className="text-2xl font-bold">{name}</h2>
          <p className="text-sm opacity-90">{position}</p>
        </div>
      </div>

      {/* Body Section */}
      <div className="p-6">
        <p className="text-gray-800 mb-2">
          <span className="font-semibold text-indigo-600">Employment ID:</span> {empId}
        </p>
        <p className="text-gray-800 mb-2">
          <span className="font-semibold text-indigo-600">Email:</span> {email}
        </p>
        <p className="text-gray-800 mb-2">
          <span className="font-semibold text-indigo-600">Phone:</span> {phone}
        </p>
        <p className="text-gray-800 mb-2">
          <span className="font-semibold text-indigo-600">Address:</span> {address}
        </p>
        <p className="text-gray-800 mb-2">
          <span className="font-semibold text-indigo-600">Aadhar Number:</span> {aadhar}
        </p>
        <p className="text-gray-800 mb-4">
          <span className="font-semibold text-indigo-600">Joining Date:</span> {joiningDate}
        </p>

        {/* Targets Section */}
        <div className="bg-gray-100 rounded-lg p-4 shadow-inner">
          <h3 className="text-indigo-600 font-semibold mb-2">Target Achievements</h3>
          <p className="text-gray-800 text-lg font-medium">{targetAchieved}</p>
        </div>

        {/* Badge Section */}
        {isTopEmployer && (
          <div className="mt-4 text-center">
            <span className="bg-green-500 text-white text-sm font-semibold py-2 px-4 rounded-full shadow-md">
              ⭐ Top Employer
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeCard;
