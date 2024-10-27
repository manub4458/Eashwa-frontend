"use client"
import React, { useState } from 'react';
import Dashboard from '../../components/ui/Dashboard';
import Link from 'next/link';

const AddStock = (props) => {
  const [formData, setFormData] = useState({
    stock1: '',
    stock2: '',
    addedBy: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   const resposne = await  props.handleAddStock(formData);
   if(resposne){
    setFormData({
        stock1: '',
        stock2: '',
        addedBy: '',
      }
    )
   }
  };

  return (
    <div className='min-h-screen'>
       <header className="w-full p-4 py-6 px-10 flex justify-between items-center shadow-lg">
       <Link href='/'>
       
       <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Logo" className="h-14 w-auto" />
        </div>
       </Link>

        <div className="bg-white text-black p-2 rounded shadow-sm flex items-center w-full max-w-xs">
          <input
            type="search"
            placeholder="Search"
            className="border-none w-full focus:ring-0 outline-none px-2"
          />
          <button className="text-white bg-green-600 px-3 py-1 rounded">Search</button>
        </div>
      </header>
 
    <div className="flex flex-col md:flex-row flex-1">
    <Dashboard/>
    <div className="mx-auto bg-white p-6 rounded-lg shadow-md mt-10 flex-1">
      <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
        {props.type}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="stock1" className="block text-gray-700 font-medium">
            {props.firstItem}
          </label>
          <input
            type="number"
            id="stock1"
            name="stock1"
            value={formData.stock1}
            onChange={handleChange}
            placeholder={`Enter stock for ${props.firstItem}`}
            required
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="stock2" className="block text-gray-700 font-medium">
            {props.secondItem}
          </label>
          <input
            type="number"
            id="stock2"
            name="stock2"
            value={formData.stock2}
            onChange={handleChange}
            placeholder={`Enter stock for ${props.secondItem}`}
            required
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="addedBy" className="block text-gray-700 font-medium">
            Added By
          </label>
          <input
            type="text"
            id="addedBy"
            name="addedBy"
            value={formData.addedBy}
            onChange={handleChange}
            placeholder="Enter name"
            required
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
    </div>
    </div>
  );
};

export default AddStock;
