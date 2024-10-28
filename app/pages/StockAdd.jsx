"use client"
import React, { useEffect, useState } from 'react';
import Dashboard from '../../components/ui/Dashboard';
import Link from 'next/link';

const AddStock = (props) => {
  const [formData, setFormData] = useState({
    quantity: '',
    type: '',
    specification: '',
    addedBy: '',
  });

  const [batteryType, setBatteryType] = useState('');
  const [options, setoptions] = useState([]);
  const [specification, setspecification] = useState('')

  const handleChangeStock = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChange = (e) => {
    setBatteryType(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = {
      batteryType: batteryType,
      specification: specification,
      addedBy: formData.addedBy,
      quantity: parseInt(formData.quantity, 10) // Convert to integer
    };
  
    const response = await props.handleAddStock(dataToSubmit);
    if (response) {
      setFormData({
        batteryType: '',
        specification: '',
        addedBy: '',
        quantity: '' // Keep this as a string if you want to clear it for user input
      });
    }
  };
  

  useEffect(() => {
    if (batteryType === 'Lithium-ion Battery') {
      setoptions(props.optionLithium);
    }
    else {
      setoptions(props.optionLead);
    }

  }, [batteryType])

  const handleOptions = (e) => {
    setspecification(e.target.value);
  }

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
        <Dashboard />
        <div className="mx-auto bg-white p-6 rounded-lg shadow-md mt-10 flex-1">
          <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
           {`Select ${props.type} Type`}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="batteryType" className="block text-gray-700 font-medium">
                Select Battery Type
              </label>
              <select
                id="batteryType"
                name="batteryType"
                value={batteryType}
                onChange={handleChange}
                required
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Battery Type</option>
                {props.productType.map((item, ind) => {
                  return <option key={ind} value={item}>{item}</option>
                })}
              </select>
            </div>
            <div>
              <label htmlFor="specification" className="block text-gray-700 font-medium">
                Battery Specification
              </label>
              <select
                id="specification"
                name="specification"
                value={specification}
                onChange={handleOptions}
                required
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Specification</option>
                {options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="stock1" className="block text-gray-700 font-medium">
                Stock
              </label>
              <input
                type="number"
                id="stock1"
                name="quantity"
                value={formData.quantity}
                onChange={handleChangeStock}
                placeholder={`Enter stock for ${props.firstItem}`}
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
                onChange={handleChangeStock}
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
