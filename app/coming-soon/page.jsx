import React from 'react';
import { FaRocket, FaClock, FaHandshake } from 'react-icons/fa';  // Importing icons from react-icons
import 'animate.css';  // Importing animate.css for animations

const ComingSoon = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-300 via-lime-200 to-indigo-200">

      {/* Main Card */}
      <div className="text-center p-8 bg-white shadow-lg rounded-xl max-w-xl w-full transform transition-all duration-700 hover:scale-105 hover:shadow-2xl">

        {/* Animated Welcome Text */}
        <h1 className="text-5xl font-semibold text-gray-800 mb-6 animate__animated animate__fadeIn animate__delay-1s">
          Coming Soon!
        </h1>

        {/* Rocket Icon */}
        <div className="text-7xl mb-8 animate__animated animate__bounceIn animate__delay-1s">
          <FaRocket className="text-teal-600" />
        </div>

        {/* Description */}
        <p className="text-xl text-gray-600 mb-6 animate__animated animate__fadeIn animate__delay-2s">
          We are working hard to bring you something amazing. Stay tuned for the exciting features we are working on!
        </p>

        {/* Progress Indicator */}
        <div className="mb-6 animate__animated animate__fadeIn animate__delay-3s">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 border-4 border-t-4 border-teal-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-sm text-gray-500">Feature in progress...</p>
        </div>

        {/* Key Features Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col items-center p-4 bg-teal-100 rounded-lg hover:bg-teal-200 transition duration-300">
            <FaClock className="text-4xl text-teal-500 mb-3 animate__animated animate__fadeIn animate__delay-2s" />
            <p className="text-lg text-gray-800 font-semibold">Patience is Key</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-lime-100 rounded-lg hover:bg-lime-200 transition duration-300">
            <FaRocket className="text-4xl text-lime-500 mb-3 animate__animated animate__fadeIn animate__delay-3s" />
            <p className="text-lg text-gray-800 font-semibold">Exciting Launch Ahead</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition duration-300">
            <FaHandshake className="text-4xl text-indigo-500 mb-3 animate__animated animate__fadeIn animate__delay-4s" />
            <p className="text-lg text-gray-800 font-semibold">Partnerships in Progress</p>
          </div>
        </div>

        {/* Animated Message */}
        <div className="mt-8 animate__animated animate__fadeIn animate__delay-5s">
          <p className="text-xl text-gray-700 font-bold mb-4">Stay Tuned for Updates!</p>
          <p className="text-lg text-gray-600">We're building something incredible for you. Check back soon for more details!</p>
        </div>
      </div>

    </div>
  );
};

export default ComingSoon;
