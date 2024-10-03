"use client";
import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Coins,
  Users,
  Activity,
  BarChart2,
  TrendingUp,
  Download,
} from "lucide-react";

const ChitFundDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Simulating data loading
    const timer = setTimeout(() => {
      const loader = document.getElementById("initial-loader");
      if (loader) {
        loader.classList.add("opacity-0");
        setTimeout(() => (loader.style.display = "none"), 500);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const TabButton = ({ name, icon: Icon, isActive }: any) => (
    <button
      onClick={() => setActiveTab(name)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
          : "text-gray-400 hover:text-white hover:bg-gray-800"
      }`}
    >
      <Icon size={18} />
      <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
    </button>
  );

  const StatCard = ({ title, value, icon: Icon, trend }: any) => (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
        <Icon size={24} className="text-indigo-400" />
      </div>
      <p className="text-3xl font-bold text-white mb-2">{value}</p>
      <p className={`text-sm ${trend > 0 ? "text-green-400" : "text-red-400"}`}>
        {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% from last cycle
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white mt-[85px]">
      <div
        id="initial-loader"
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 transition-opacity duration-500"
      >
        <div className="w-16 h-16 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
      </div>

      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text animate-gradient text-center pt-6">
        Solana Chit Fund Dashboard
      </h1>


      <nav className="bg-gray-800 border-b border-gray-700 md:mx-[10%] rounded-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-8"
                  src="/api/placeholder/32/32"
                  alt="Logo"
                />
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <TabButton
                    name="overview"
                    icon={Activity}
                    isActive={activeTab === "overview"}
                  />
                  <TabButton
                    name="analytics"
                    icon={BarChart2}
                    isActive={activeTab === "analytics"}
                  />
                  <TabButton
                    name="members"
                    icon={Users}
                    isActive={activeTab === "members"}
                  />
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <button className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  <span className="sr-only">View notifications</span>
                  <AlertCircle className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Members" value="10" icon={Users} trend={5} />
            <StatCard
              title="Pool Amount"
              value="10,000 SOL"
              icon={Coins}
              trend={12}
            />
            <StatCard
              title="Current Cycle"
              value="3/10"
              icon={CheckCircle2}
              trend={0}
            />
            <StatCard
              title="Your Balance"
              value="1,000 SOL"
              icon={TrendingUp}
              trend={-2}
            />
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-gray-300">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span>You contributed 1,000 SOL</span>
                <span className="text-gray-500 text-sm">2 hours ago</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-300">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <span>Withdrawal auction started</span>
                <span className="text-gray-500 text-sm">1 day ago</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-300">
                <Coins className="h-5 w-5 text-blue-400" />
                <span>Member withdrawn 9,800 SOL at 2% interest</span>
                <span className="text-gray-500 text-sm">3 days ago</span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">
                Contribution History
              </h2>
              <div className="relative h-64">
                <img
                  src="/api/placeholder/400/256"
                  alt="Contribution History Chart"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">
                Auction Interest Rates
              </h2>
              <div className="relative h-64">
                <img
                  src="/api/placeholder/400/256"
                  alt="Auction Interest Rates Chart"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default ChitFundDashboard;
