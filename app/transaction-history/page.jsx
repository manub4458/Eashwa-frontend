"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";

const page = () => {
    const [data, setData] = useState([]);
    const [selectValue, setSelectValue] = useState("battery");
    const [monthFilter, setMonthFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 20;

    const handleFilterChange = (event) => {
        setSelectValue(event.target.value);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handleMonthChange = (event) => {
        setMonthFilter(event.target.value);
        setCurrentPage(1); // Reset to first page on month filter change
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/products/stock-history/${selectValue}`
                );
                console.log("response", response);
                const sortedData = response.data.history.sort(
                    (a, b) => new Date(b.date) - new Date(a.date)
                );
                setData(sortedData);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, [selectValue]);

    // Filter data based on month selection
    const filteredData = monthFilter
        ? data.filter((item) => dayjs(item.date).format("MMMM") === monthFilter)
        : data;

    // Calculate total pages
    const totalPages = Math.ceil(filteredData.length / entriesPerPage);

    // Calculate data for the current page
    const paginatedData = filteredData.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
    );

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
            <Link href="/">
                <p className="text-blue-500 underline mb-4">Go Back</p>
            </Link>
            <div className="flex flex-col md:flex-row justify-between md:items-center">
                <h2 className="text-2xl font-semibold text-green-700 mb-4">
                    {selectValue.charAt(0).toUpperCase() + selectValue.slice(1)} Stock Data
                </h2>
                <div className="flex flex-col sm:flex-row mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
                    <select
                        value={selectValue}
                        onChange={handleFilterChange}
                        className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-48"
                    >
                        <option value="battery">Battery</option>
                        <option value="charger">Charger</option>
                        <option value="vehicle">Vehicle</option> {/* Added option for vehicle */}
                    </select>
                    <select
                        value={monthFilter}
                        onChange={handleMonthChange}
                        className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 w-full sm:w-48"
                    >
                        <option value="">All Months</option>
                        <option value="January">January</option>
                        <option value="February">February</option>
                        <option value="March">March</option>
                        <option value="April">April</option>
                        <option value="May">May</option>
                        <option value="June">June</option>
                        <option value="July">July</option>
                        <option value="August">August</option>
                        <option value="September">September</option>
                        <option value="October">October</option>
                        <option value="November">November</option>
                        <option value="December">December</option>
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-md overflow-hidden">
                    <thead className="bg-green-600 text-white">
                        <tr>
                            <th className="px-2 sm:px-4 py-2 text-left">Sr. No</th>
                            <th className="px-2 sm:px-4 py-2 text-left">{selectValue.charAt(0).toUpperCase() + selectValue.slice(1)} Type</th>
                            <th className="px-2 sm:px-4 py-2 text-left">Action</th>
                            <th className="px-2 sm:px-4 py-2 text-left">Quantity</th>
                            <th className="px-2 sm:px-4 py-2 text-left">Updated By</th>
                            <th className="px-2 sm:px-4 py-2 text-left">Specification</th>
                            <th className="px-2 sm:px-4 py-2 text-left">Party Name</th>
                            <th className="px-2 sm:px-4 py-2 text-left">Location</th>
                            <th className="px-2 sm:px-4 py-2 text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData && paginatedData.length > 0 ? (
                            paginatedData.map((item, index) => (
                                <tr key={index} className="border-b last:border-none">
                                    <td className="px-2 sm:px-4 py-2 capitalize">
                                        {(currentPage - 1) * entriesPerPage + index + 1}
                                    </td>
                                    <td className="px-2 sm:px-4 py-2 capitalize">{item.item}</td>
                                    <td className="px-2 sm:px-4 py-2 capitalize">{item.action}</td>
                                    <td className="px-2 sm:px-4 py-2 capitalize">{item.quantity}</td>
                                    <td className="px-2 sm:px-4 py-2 capitalize">{item.user}</td>
                                    <td className="px-2 sm:px-4 py-2 capitalize">{item.specification || "-"}</td>
                                    <td className="px-2 sm:px-4 py-2 capitalize">{item.partyName || "-"}</td>
                                    <td className="px-2 sm:px-4 py-2 capitalize">{item.location || "-"}</td>
                                    <td className="px-2 sm:px-4 py-2 capitalize">
                                        {dayjs(item.date).format("D MMMM YYYY")}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="px-4 py-4 text-center text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-4 sm:space-y-0">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-center">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default page;
