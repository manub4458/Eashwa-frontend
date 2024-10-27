"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const Register = () => {
  const [name, setName] = useState('');  // Name field
  const [email, setEmail] = useState(''); // Email field
  const [password, setPassword] = useState(''); // Password field
  const [error, setError] = useState(''); // Error message
  const [isClient, setIsClient] = useState(false); // Check if it's client-side

  let router;
  if (typeof window !== "undefined") {
    router = useRouter();
  }

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://e-ashwa-backend.onrender.com/api/user/register', { name, email, password });

      if (response.data.ok) {
        // Store the auth token in cookies if needed
        Cookies.set('authToken', response.data.authToken, { expires: 1 });

        // Redirect to login or dashboard
        if (isClient && router) {
          router.push('/login'); // Redirect to login page
        }
      } else {
        setError(response.data.message); // Show error message
      }
    } catch (err) {
      setError('Registration failed. Please try again.'); // General error message
    }
  };

  if (!isClient) {
    return null; // Avoid rendering anything on the server
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg md:w-[32rem] p-6 sm:p-10 transition duration-500 hover:scale-105 mx-4 sm:mx-auto">
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="EV Battery Logo" className="w-20 h-20 sm:w-28 sm:h-24" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Register to E-ashwa
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 sm:mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-2 w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-300"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4 sm:mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-300"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4 sm:mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-300"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none"
          >
            Register
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-green-500 hover:text-green-700">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
