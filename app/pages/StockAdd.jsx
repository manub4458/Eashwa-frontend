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
    partyName: '', // New field for Party Name
    location: '', // New field for Location
  });

  const [batteryType, setBatteryType] = useState('');
  const [options, setOptions] = useState([]);
  const [specification, setSpecification] = useState('');

  const handleChangeStock = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChange = (e) => {
    setBatteryType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = {
      batteryType: batteryType,
      specification: specification,
      addedBy: formData.addedBy,
      quantity: parseInt(formData.quantity, 10), // Convert to integer
      partyName: formData.partyName,
      location: formData.location,
    };
  
    const response = await props.handleAddStock(dataToSubmit);
    console.log("response",response);
    if (response) {
      setFormData({
        batteryType: '',
        specification: '',
        addedBy: '',
        quantity: '',
        partyName: '',
        location: '',
      });
    }
  };
  
  useEffect(() => {
    if (batteryType === 'Lithium-ion Battery') {
      setOptions(props.optionLithium);
    } else {
      setOptions(props.optionLead);
    }
  }, [batteryType]);

  const handleOptions = (e) => {
    setSpecification(e.target.value);
  };

  return (
    <div className="min-h-screen">
      <header className="w-full p-4 py-6 px-10 flex justify-between items-center shadow-lg">
        <Link href='/'>
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Logo" className="h-14 w-auto" />
          </div>
        </Link>
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
                Select Product Type
              </label>
              <select
                id="batteryType"
                name="batteryType"
                value={batteryType}
                onChange={handleChange}
                required
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Product Type</option>
                {props.productType.map((item, ind) => (
                  <option key={ind} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="specification" className="block text-gray-700 font-medium">
                Product Specification
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
              <label htmlFor="quantity" className="block text-gray-700 font-medium">
                Stock Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChangeStock}
                placeholder={`Enter stock for ${props.firstItem}`}
                required
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="partyName" className="block text-gray-700 font-medium">
                Party Name
              </label>
              <input
                type="text"
                id="partyName"
                name="partyName"
                value={formData.partyName}
                onChange={handleChangeStock}
                placeholder="Enter party name"
                required
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-gray-700 font-medium">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChangeStock}
                placeholder="Enter location"
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
