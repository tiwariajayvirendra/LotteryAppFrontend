import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const firstRowColors = ["#00C851", "#33b5e5", "#ff4444", "#ffbb33"];
  const sidebarItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Tickets", path: "/tickets" },
    { label: "Info", path: "/info" },
  ];

  const handleCardClick = (powerNumber) => {
    navigate(`/lottery/${powerNumber}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden sm:flex w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6 rounded-r-xl shadow-lg flex-col">
          <div className="mb-6 border-b border-gray-700 pb-3">
            <h2 className="text-2xl font-bold tracking-wide text-yellow-400 hover:text-yellow-300 transition-colors duration-300">
              JiGOOGLE Powers
            </h2>
            <p className="text-sm text-gray-300 mt-1">Legacy tools & onboarding modules</p>
          </div>
          <ul className="space-y-3">
            {sidebarItems.map(({ label, path }) => (
              <li
                key={label}
                onClick={() => navigate(path)}
                className="bg-gray-700 hover:bg-yellow-500 hover:text-gray-900 transition-all duration-300 px-3 py-2 rounded-md cursor-pointer shadow-sm"
              >
                {label}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Navbar */}
          <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
            <h1 className="text-lg font-semibold">Welcome to Jigoogle Lottery</h1>
          </nav>

          {/* Scrollable Content */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* Row 1: Lottery Skims */}
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {firstRowColors.map((color, index) => (
                <div
                  key={index}
                  onClick={() => handleCardClick(index + 1)}
                  className="rounded-xl p-6 flex flex-col justify-center items-center cursor-pointer transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
                  style={{ backgroundColor: color, minHeight: "200px" }}
                >
                  <h3 className="text-lg font-bold mb-2 text-white text-center">
                    Skim No: {index + 1} — Starts from ₹50
                  </h3>
                  <p className="text-sm text-white text-center">
                    Click to view available lottery numbers
                  </p>
                </div>
              ))}
            </section>

            {/* Row 2: Info Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1A237E] rounded-xl shadow-lg p-6 flex flex-col justify-center items-center transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <h3 className="text-lg font-bold text-white mb-2">Indian Blue Card</h3>
                <p className="text-white text-center">
                  Information about Indian Blue background
                </p>
              </div>
              <div className="bg-[#FF9933] rounded-xl shadow-lg p-6 flex flex-col justify-center items-center transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <h3 className="text-lg font-bold text-white mb-2">Indian Saffron Card</h3>
                <p className="text-white text-center">
                  Information about Indian Saffron background
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white p-4 mt-4 flex flex-col md:flex-row justify-between items-center shadow-inner">
        <p className="text-sm mb-2 md:mb-0">
          All rights reserved on Jigoogle.com @2025 to @2040
        </p>
        <div className="flex items-center space-x-4 text-lg">
          <a href="#" onClick={(e) => e.preventDefault()} aria-label="Facebook" className="hover:text-blue-500 transition-colors duration-300">
            <FaFacebookF />
          </a>
          <a href="#" onClick={(e) => e.preventDefault()} aria-label="Twitter" className="hover:text-blue-400 transition-colors duration-300">
            <FaTwitter />
          </a>
          <a href="#" onClick={(e) => e.preventDefault()} aria-label="Instagram" className="hover:text-pink-500 transition-colors duration-300">
            <FaInstagram />
          </a>
          <a href="#" onClick={(e) => e.preventDefault()} aria-label="LinkedIn" className="hover:text-blue-700 transition-colors duration-300">
            <FaLinkedinIn />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
