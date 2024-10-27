"use client"
import Link from 'next/link'
import React from 'react';


const Dashboard = () => {
    const token = localStorage.getItem('token');

    const navigation = [
        {
            "title": "Overview",
            "url": "/"
        },
        {
            "title": "Form",
            "url": "/form"
        },
        {
            "title": "Battery Stock",
            "url": "/battery"
        },
        {
            "title": "Charger Stock",
            "url": "/charger"
        },
        {
            "title": "Add Battery Stock",
            "url": "/add-battery-stock",
            "requiresToken": true
        },
        {
            "title": "Add Battery Sold Stock",
            "url": "/add-battery-sold-stock",
            "requiresToken": true
        },
        {
            "title": "Add Charger Stock",
            "url": "/add-charger-stock",
            "requiresToken": true
        },
        {
            "title": "Add Charger Sold Stock",
            "url": "/add-charger-sold-stock",
            "requiresToken": true
        },
        {
            "title": "Transcation History",
            "url": "/transation-history",
            "requiresToken": true
        },
    ]
    return (
        <aside className="w-full md:w-64 bg-[#d86331] text-white p-4">
            <div className="font-bold text-xl mb-6">Your Dashboard</div>
            <nav>
                <ul className="space-y-4 flex flex-col gap-y-1.5">

                {navigation
                        .filter(item => !item.requiresToken || token) // Filter based on token presence
                        .map((item) => (
                            <Link href={item.url} key={item.url}>
                                <li className="hover:bg-green-700 p-2 rounded">{item.title}</li>
                            </Link>
                        ))}
                </ul>
            </nav>
        </aside>
    )
}

export default Dashboard