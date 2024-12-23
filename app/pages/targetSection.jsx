import React from 'react'

const TargetSection = ({targets}) => {
  return (
   <>
    <div className="bg-indigo-50 shadow-lg rounded-lg overflow-hidden border-2 border-indigo-300">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-indigo-800 mb-4">Your Targets</h2>
        {/* <ul className="space-y-3">
          {targets?.map((target) => (
            <li
              key={target.id}
              className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
            >
              <span className="text-gray-700">{target.name}</span>
              <span
                className={`text-sm font-medium px-2 py-1 rounded ${
                  target.status === 'Completed'
                    ? 'bg-green-100 text-green-600'
                    : target.status === 'In Progress'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {target.status}
              </span>
            </li>
          ))}
        </ul> */}
      </div>
    </div>
   
   </>
  )
}

export default TargetSection