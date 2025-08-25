import { useState } from 'react';
import {
  Home,
  Users,
  PackageSearch,
  ShoppingCart,
  Bell,
  Settings,
  LogOut,
  Moon,
  Sun,
  LayoutDashboard,
} from 'lucide-react';
import { Outlet } from 'react-router-dom';

const navItems = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { icon: <Users size={20} />, label: 'Users' },
  { icon: <ShoppingCart size={20} />, label: 'Orders' },
  { icon: <PackageSearch size={20} />, label: 'Products' },
  { icon: <Bell size={20} />, label: 'Notifications' },
  { icon: <Settings size={20} />, label: 'Settings' },
];

export default function DashboardLayout() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-[#191922] text-white' : 'bg-[#EFEFF5]'}`}>
      {/* Sidebar */}
      <div className={`w-64   shadow-md flex flex-col justify-between ${darkMode ? 'bg-[#191922] text-white' : 'bg-[#EFEFF5]'}`}>
        <div>
          <div className="p-6 text-3xl font-bold text-blue-600 shadow">ShopSphere</div>
          <nav className="mt-4">
            {navItems.map((item) => (
              <a href={`/seller-store/${item.label.toLowerCase()}`}
                key={item.label}
                onClick={() => setActiveItem(item.label)}
                className={`flex items-center gap-3 p-4 cursor-pointer transition-all duration-300 border-l-4 
                ${activeItem === item.label
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'hover:bg-blue-100 hover:text-blue-600 border-transparent'}
              `}
              >
                <span>{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-3 text-red-500 hover:text-red-700 transition">
            <LogOut size={20} /> <span>Sign out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className={`flex items-center justify-between p-6 shadow-md ${darkMode ? 'bg-[#191922] text-white' : 'bg-[#EFEFF5] text-gray-800'}`}>
          <div></div>
          <div className="flex items-center gap-4">
            <button
              className={`p-2  rounded-xl shadow-md hover:shadow-xs hover:shadow-blue-400 ${darkMode ? 'bg-[#191929] text-white' : 'bg-[#ECECF3] text-blue-800'}`}
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div               className={`relative p-2  rounded-xl shadow-md hover:shadow-xs hover:shadow-blue-400 ${darkMode ? 'bg-[#191929] text-white' : 'bg-[#ECECF3] text-blue-800'}`}
>
              <Bell size={20} />
              <span className="absolute -top-3 -right-2 text-xs bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </div>
            <div className="relative">
              <img
                src="https://i.pravatar.cc/40"
                alt="Profile"
                className="w-9 h-9 rounded-full cursor-pointer"
                onClick={() => setProfileOpen(!profileOpen)}
              />
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56  border shadow-lg rounded-md overflow-hidden z-50">
                  <div className="p-3 font-semibold border-b">Admin Account</div>
                  <div>
                    <button className="w-full text-left px-4 py-2 hover:bg-blue-300 transition">Profile Settings</button>
                    <button className="w-full text-left px-4 py-2 hover:bg-blue-300 transition">Account Settings</button>
                  </div>
                  <div className="border-t"></div>
                  <button className="w-full text-left px-4 py-2 text-red-500 hover:text-red-700 hover:bg-red-100 transition">Sign out</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <h1 className="text-2xl font-bold">Welcome to Seller Dashboard</h1>
          <Outlet/>
        </div>
      </div>
    </div>
  );
}
