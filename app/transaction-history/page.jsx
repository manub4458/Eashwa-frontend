"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import dayjs from 'dayjs';
import Link from "next/link";

const page = () => {
    const [data, setData] = useState([]);

    const [selectValue, setSelectValue] = useState("battery");

    const handleFilterChange = (event) => {
        setSelectValue(event.target.value);
    };

    useEffect(() => {
        const tabelData = async () => {
            try {
                const resposne = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/stock-history/${selectValue}`);
                console.log("ss", resposne.data.history);
                setData(resposne.data.history)

            } catch (err) {
                console.log(err);
            }

        }
        tabelData();


    }, [selectValue])


    return (
        <div className="w-full max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
            <Link href="/">
                <p>Go Back</p>
            </Link>
            <div className="flex justify-between">
                <h2 className="text-2xl font-semibold text-green-700 mb-4">
                    {selectValue.charAt(0).toUpperCase()
                        + selectValue.slice(1)} Stock Data
                </h2>
                <div className="mb-4 flex items-center">
                    <select
                        value={selectValue}
                        onChange={handleFilterChange}
                        className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 w-48"
                    >
                        <option value="battery">Battery</option>
                        <option value="charger">Charger</option>
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-md overflow-hidden">
                    <thead className="bg-green-600 text-white">
                        <tr>
                            <th className="px-4 py-2 text-left">Sr. No</th>
                            <th className="px-4 py-2 text-left">{selectValue.charAt(0).toUpperCase()
                        + selectValue.slice(1)} Type</th>
                            <th className="px-4 py-2 text-left">Action</th>
                            <th className="px-4 py-2 text-left">Quantity</th>
                            <th className="px-4 py-2 text-left">Updated By</th>
                            <th className="px-4 py-2 text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={index} className="border-b last:border-none">

                                    <td className="px-4 py-2 capitalize">{index + 1}</td>
                                    <td className="px-4 py-2 capitalize">{item.item}</td>
                                    <td className="px-4 py-2 capitalize">{item.action}</td>
                                    <td className="px-4 py-2 capitalize">{item.quantity}</td>
                                    <td className="px-4 py-2 capitalize">{item.user}</td>
                                    <td className="px-4 py-2 capitalize"> {dayjs(item.date).format("D MMMM YYYY")}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default page;
