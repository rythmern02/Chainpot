"use client"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { AnimatePresence, motion } from "framer-motion";
import { Home, HelpCircle, Layers } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
const headerVariants = {
  hidden: { y: -100 },
  visible: { y: 0, transition: { type: "spring", stiffness: 100 } },
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState();
  return (
    <div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween" }}
            className="fixed inset-y-0 right-0 w-64 bg-gray-900 z-40 p-4"
          >
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="flex items-center space-x-2 hover:text-purple-400 transition-colors"
              >
                <Home size={20} />
                <span>Home</span>
              </Link>
              <Link
                href="#how-it-works"
                className="flex items-center space-x-2 hover:text-purple-400 transition-colors"
              >
                <HelpCircle size={20} />
                <span>How It Works</span>
              </Link>
              <Link
                href="#features"
                className="flex items-center space-x-2 hover:text-purple-400 transition-colors"
              >
                <Layers size={20} />
                <span>Features</span>
              </Link>
              <div className="border hover:border-slate-900 rounded">
                <WalletMultiButton style={{}} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div>
        <motion.header
          className="fixed top-0 left-0 right-0 z-50 bg-opacity-90 bg-gray-900 backdrop-blur-md"
          initial="hidden"
          animate="visible"
          variants={headerVariants}
        >
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              ChainPot
            </Link>
            <nav className="hidden md:flex space-x-6 items-center">
              <Link
                href="/"
                className="hover:text-purple-400 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="hover:text-purple-400 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="#how-it-works"
                className="hover:text-purple-400 transition-colors"
              >
                Deploy
              </Link>
              <Link
                href="#features"
                className="hover:text-purple-400 transition-colors"
              >
                Get Domain
              </Link>
            </nav>
            <div className="border hover:border-slate-900 rounded">
              <WalletMultiButton style={{}} />
            </div>
          </div>
        </motion.header>
      </div>
    </div>
  );
};

export default Navbar;
