"use client";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import Link from "next/link";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const entriesPerPage = 20;

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("formHistory") || "[]");
    setHistory(savedHistory);

    const userLoggedIn = localStorage.getItem("loggedIn") === "true";
    const userRole = localStorage.getItem("role");
    if (userLoggedIn) {
      setLoggedIn(true);
      setRole(userRole);
    } else {
      setLoggedIn(false);
      setRole(null);
    }
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem("formHistory");
    setHistory([]);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const validEmail = "remark@gmail.com";
    const validPassword = "remark@123";

    if (email === validEmail && password === validPassword) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("role", "remark");
      setLoggedIn(true);
      setRole("remark");
      setLoginError("");
    } else {
      setLoginError("Invalid email or password.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("role");
    setLoggedIn(false);
    setRole(null);
    setEmail("");
    setPassword("");
  };

  const handleApprove = (index) => {
    const updatedHistory = [...history];
    updatedHistory[index].status = "Completed";
    setHistory(updatedHistory);
    localStorage.setItem("formHistory", JSON.stringify(updatedHistory));
  };

  const handleDelete = (index) => {
    const updatedHistory = history.filter((_, i) => i !== index);
    setHistory(updatedHistory);
    localStorage.setItem("formHistory", JSON.stringify(updatedHistory));
  };

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = history.slice(indexOfFirstEntry, indexOfLastEntry);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePrevious = () => setCurrentPage(currentPage - 1);
  const handleNext = () => setCurrentPage(currentPage + 1);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <header className="w-full p-4 py-6 px-6 md:px-10 flex justify-between items-center shadow-lg flex-wrap">
        <Link href="/">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Logo" className="h-10 md:h-14 w-auto" />
          </div>
        </Link>
        {loggedIn && (
          <Button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white mt-4 md:mt-0"
          >
            Logout
          </Button>
        )}
      </header>

      <main className="flex flex-col items-center justify-center flex-1">
        <div className="w-full max-w-7xl rounded-lg p-4 md:p-8 mt-10 md:mt-20 mx-auto">
          {loggedIn ? (
            <>
              <div className="w-full overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-gray-300 text-sm md:text-base">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 px-2 md:px-4 py-2">S.No.</th>
                      <th className="border border-gray-300 px-2 md:px-4 py-2">Date</th>
                      <th className="border border-gray-300 px-2 md:px-4 py-2">Name</th>
                      <th className="border border-gray-300 px-2 md:px-4 py-2">Product</th>
                      <th className="border border-gray-300 px-2 md:px-4 py-2">Specifications</th>
                      <th className="border border-gray-300 px-2 md:px-4 py-2">Quantity</th>
                      <th className="border border-gray-300 px-2 md:px-4 py-2">Description</th>
                      <th className="border border-gray-300 px-2 md:px-4 py-2">Status</th>
                      <th className="border border-gray-300 px-2 md:px-4 py-2">Action</th>
                      <th className="border border-gray-300 px-2 md:px-4 py-2">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEntries.map((entry, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-2 md:px-4 py-2">
                          {indexOfFirstEntry + index + 1}
                        </td>
                        <td className="border border-gray-300 px-2 md:px-4 py-2">{entry.date}</td>
                        <td className="border border-gray-300 px-2 md:px-4 py-2">{entry.name}</td>
                        <td className="border border-gray-300 px-2 md:px-4 py-2">{entry.product}</td>
                        <td className="border border-gray-300 px-2 md:px-4 py-2">{entry.specifications}</td>
                        <td className="border border-gray-300 px-2 md:px-4 py-2">
                          {entry.status === "Incomplete" ? (
                            <span className="text-red-500">{entry.quantity} (Shortage)</span>
                          ) : (
                            entry.quantity
                          )}
                        </td>
                        <td className="border border-gray-300 px-2 md:px-4 py-2">{entry.description}</td>
                        <td className="border border-gray-300 px-2 md:px-4 py-2">
                          {entry.status || "Incomplete"}
                        </td>
                        <td className="border border-gray-300 px-2 md:px-4 py-2">
                          {entry.status !== "Completed" && (
                            <Button
                              onClick={() => handleApprove(index)}
                              className="bg-green-500 hover:bg-green-700 text-white"
                            >
                              Close
                            </Button>
                          )}
                        </td>
                        <td className="border border-gray-300 px-2 md:px-4 py-2">
                          <Button
                            onClick={() => handleDelete(index)}
                            className="bg-red-500 hover:bg-red-700 text-white"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-between items-center space-x-4 flex-wrap">
                <Button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-500 cursor-pointer hover:bg-gray-300"
                >
                  Previous
                </Button>
                <div className="flex space-x-2 mt-2 sm:mt-0">
                  {Array.from(
                    { length: Math.ceil(history.length / entriesPerPage) },
                    (_, index) => (
                      <Button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`px-4 py-2 ${
                          currentPage === index + 1
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {index + 1}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  onClick={handleNext}
                  disabled={currentPage === Math.ceil(history.length / entriesPerPage)}
                  className="px-4 py-2 bg-gray-200 text-gray-500 cursor-pointer hover:bg-gray-300"
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <div className="mt-4 text-center w-full max-w-md mx-auto">
              <p className="text-gray-500">Please log in to view your history.</p>
              <form onSubmit={handleLoginSubmit} className="space-y-4 mt-4">
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white"
                >
                  Login
                </Button>
              </form>
              {loginError && <p className="text-red-500 mt-2">{loginError}</p>}
            </div>
          )}
        </div>
      </main>

 
    </div>
  );
};

export default HistoryPage;
