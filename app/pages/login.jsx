"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);

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
      const response = await axios.post('https://backend-eashwa-1.onrender.com/api/user/login', { email, password });
      if (response.data.ok) {
        Cookies.set('authToken', response.data.authToken, { expires: 1 });
        localStorage.setItem('token', response.data.authToken);
        // Redirect based on the email
        const emailToCheck = "admin@gmail.com"; // Email to check (case-insensitive)
        if (isClient && router) {
          if (email.toLowerCase() === emailToCheck.toLowerCase()) {
            router.push('/dashboard'); // Redirect to dashboard
          } else {
            router.push('/'); // Redirect to home
          }
        }
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md md:w-[32rem] p-6 sm:p-10 transition duration-500 hover:scale-105 mx-4 sm:mx-auto">
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="EV Battery Logo" className="w-20 h-20 sm:w-28 sm:h-24" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          E-ashwa Login
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
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
            Login
          </button>
        </form>
       
      </div>
    </div>
  );
};

export default Login;
