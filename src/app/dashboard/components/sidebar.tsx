import { motion } from 'framer-motion'
import React from 'react'

const sidebarVariants = {
    open: { width: '240px', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { width: '60px', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  }
  
const sidebar = () => {
  return (
    <motion.nav
    className="fixed top-0 left-0 h-full bg-gray-800 z-20"
    variants={sidebarVariants}
    animate={isSidebarOpen ? 'open' : 'closed'}
  >
    <div className="p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <motion.h1
          className="text-xl font-bold"
          animate={{ opacity: isSidebarOpen ? 1 : 0 }}
        >
          ChitChain
        </motion.h1>
        <button onClick={toggleSidebar} className="text-white">
          {isSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
      </div>
      <nav className="space-y-4 flex-grow">
        {[
          { icon: <LayoutDashboard size={20} />, label: 'Dashboard', id: 'dashboard' },
          { icon: <Wallet size={20} />, label: 'My Contributions', id: 'contributions' },
          { icon: <Gavel size={20} />, label: 'Auctions', id: 'auctions' },
          { icon: <Ticket size={20} />, label: 'Lottery', id: 'lottery' },
          { icon: <Settings size={20} />, label: 'Settings', id: 'settings' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`flex items-center space-x-2 w-full p-2 rounded-lg transition-colors ${
              activeSection === item.id ? 'bg-purple-600' : 'hover:bg-gray-700'
            }`}
          >
            {item.icon}
            <motion.span
              animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? 'auto' : 0 }}
              className="whitespace-nowrap overflow-hidden"
            >
              {item.label}
            </motion.span>
          </button>
        ))}
      </nav>
    </div>
  </motion.nav>

  )
}

export default sidebar