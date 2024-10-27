// components/Sidebar.js

import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="w-full md:w-64 bg-[#d86331] text-white p-4">
      <div className="font-bold text-xl mb-6">Your Dashboard</div>
      <nav>
        <ul className="space-y-4">
          <li className="hover:bg-green-700 p-2 rounded">Overview</li>
          <Link href='/form'>
            <li className="hover:bg-green-700 p-2 rounded">Form</li>
          </Link>
          <Link href='/battery'>
            <li className="hover:bg-green-700 p-2 rounded">Battery Stock</li>
          </Link>
          <li className="hover:bg-green-700 p-2 rounded">Charger Stock</li>
          <li className="hover:bg-green-700 p-2 rounded">Transactions</li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
