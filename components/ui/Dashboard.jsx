"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';

const Dashboard = () => {
    const [token, setToken] = useState(null);
    const [batteryDropdownOpen, setBatteryDropdownOpen] = useState(false);
    const [chargerDropdownOpen, setChargerDropdownOpen] = useState(false);
    const [vehicleDropdownOpen, setVehicleDropdownOpen] = useState(false);
    const [remarkDropdownOpen, setRemarkDropdownOpen] = useState(false);



    useEffect(() => {
        // Access localStorage only when in the browser environment
        if (typeof window !== "undefined") {
            setToken(localStorage.getItem('token'));
        }
    }, []);

    const toggleBatteryDropdown = () => setBatteryDropdownOpen(!batteryDropdownOpen);
    const toggleChargerDropdown = () => setChargerDropdownOpen(!chargerDropdownOpen);
    const toggleVehicleDropdown = () => setVehicleDropdownOpen(!vehicleDropdownOpen);
    const toggleRemarkDropdown = () => setRemarkDropdownOpen(!remarkDropdownOpen);



    const navigation = [
        { title: "Overview", url: "/" },
        { title: "Approval", url: "/form" },
    ];
    const remarkOptions = [
        { title: "Shortage-form", url: "/remark", requiresToken: true },
        { title: "Shortage History", url: "/remark-history", requiresToken: true },
      
    ];

    const batteryOptions = [
        { title: "Battery Stock", url: "/battery", requiresToken: true },
        { title: "Add Battery Stock", url: "/add-battery-stock", requiresToken: true },
        { title: "Add Battery Sold Stock", url: "/add-battery-sold-stock", requiresToken: true },
    ];

    const chargerOptions = [
        { title: "Charger Stock", url: "/charger" },
        { title: "Add Charger Stock", url: "/add-charger-stock", requiresToken: true },
        { title: "Add Charger Sold Stock", url: "/add-charger-sold-stock", requiresToken: true },
    ];
    const vehicleOptions = [
        { title: "Vehicle Stock", url: "/vehicle" },
        { title: "Add Vehicle Stock", url: "/add-vehicle-stock", requiresToken: true },
        { title: "Add Vehicle Sold Stock", url: "/add-vehicle-sold-stock", requiresToken: true },
    ];

    return (
        <aside className="w-full md:w-64 bg-[#d86331] text-white p-4">
            <div className="font-bold text-xl mb-6">Your Dashboard</div>
            <nav>
                <ul className="space-y-4 flex flex-col gap-y-1.5">
                    {navigation.map((item) => (
                        <Link href={item.url} key={item.url}>
                            <li className="hover:bg-green-700 p-2 rounded">{item.title}</li>
                        </Link>
                    ))}

{token&& (
                          <li className="hover:bg-green-700 p-2 rounded flex justify-between items-center">
                          <span>Shortage</span>
                          <FaPlus onClick={toggleRemarkDropdown} className="cursor-pointer" />
                      </li>
                    )}
                  
                    {remarkDropdownOpen && (
                        <ul className="pl-6 space-y-2">
                            {remarkOptions
                                .filter(item => !item.requiresToken || token) // Filter based on token presence
                                .map((item) => (
                                    <Link href={item.url} key={item.url}>
                                        <li className="hover:bg-green-700 p-2 rounded">{item.title}</li>
                                    </Link>
                                ))}
                        </ul>
                    )}


                    {/* Battery Stock with + Button */}
                    {token&& (
                          <li className="hover:bg-green-700 p-2 rounded flex justify-between items-center">
                          <span>Battery Stock</span>
                          <FaPlus onClick={toggleBatteryDropdown} className="cursor-pointer" />
                      </li>
                    )}
                  
                    {batteryDropdownOpen && (
                        <ul className="pl-6 space-y-2">
                            {batteryOptions
                                .filter(item => !item.requiresToken || token) // Filter based on token presence
                                .map((item) => (
                                    <Link href={item.url} key={item.url}>
                                        <li className="hover:bg-green-700 p-2 rounded">{item.title}</li>
                                    </Link>
                                ))}
                        </ul>
                    )}

                    {/* Charger Stock with + Button */}
                    {token&& (

<li className="hover:bg-green-700 p-2 rounded flex justify-between items-center">
<span>Charger Stock</span>
<FaPlus onClick={toggleChargerDropdown} className="cursor-pointer" />
</li>
                    )}
                  
                    {chargerDropdownOpen && (
                        <ul className="pl-6 space-y-2">
                            {chargerOptions
                                .filter(item => !item.requiresToken || token) // Filter based on token presence
                                .map((item) => (
                                    <Link href={item.url} key={item.url}>
                                        <li className="hover:bg-green-700 p-2 rounded">{item.title}</li>
                                    </Link>
                                ))}
                        </ul>
                    )}
                       {token&& (

<li className="hover:bg-green-700 p-2 rounded flex justify-between items-center">
<span>Vehicle Stock</span>
<FaPlus onClick={toggleVehicleDropdown} className="cursor-pointer" />
</li>
                    )}
                  
                    {vehicleDropdownOpen && (
                        <ul className="pl-6 space-y-2">
                            {vehicleOptions
                                .filter(item => !item.requiresToken || token) // Filter based on token presence
                                .map((item) => (
                                    <Link href={item.url} key={item.url}>
                                        <li className="hover:bg-green-700 p-2 rounded">{item.title}</li>
                                    </Link>
                                ))}
                        </ul>
                    )}

                    {token && (
                        <Link href="/transaction-history">
                            <li className="hover:bg-green-700 p-2 rounded">Transaction History</li>
                        </Link>
                    )}
                </ul>
            </nav>
        </aside>
    );
};

export default Dashboard;
