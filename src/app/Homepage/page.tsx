"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Wallet, Layers, GitBranch } from "lucide-react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { connected } = useWallet(); // Destructure 'connected' to check wallet status
  const router = useRouter(); // Get the router object for redirection

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleGetStarted = () => {
    if (connected) {
      router.push("/dashboard"); // Redirect to dashboard if wallet is connected
    } else {
      alert("Please connect your wallet first!"); // Show an alert if the wallet is not connected
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const featureVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
      <main className="pt-20">
        <motion.section
          className="min-h-screen flex items-center justify-center text-center px-4"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Decentralizing Chit Funds with Blockchain
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Experience the future of community savings with unparalleled
              security and transparency.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-3 rounded-full transition-colors inline-flex items-center space-x-2"
              onClick={handleGetStarted} // Call the handler function on click
            >
              <span>Get Started</span>
              <ArrowRight size={20} />
            </motion.button>
          </div>
        </motion.section>

        {/* Rest of the sections remain unchanged */}

        <motion.section
          id="features"
          className="py-20 px-4 bg-gray-900"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield size={48} />,
                title: "Enhanced Security",
                description:
                  "Blockchain technology ensures your funds are safe and transactions are immutable.",
              },
              {
                icon: <Layers size={48} />,
                title: "Full Transparency",
                description:
                  "Every transaction is recorded on the blockchain, visible to all participants.",
              },
              {
                icon: <Zap size={48} />,
                title: "Smart Automation",
                description:
                  "Smart contracts automate payouts and enforce rules without human intervention.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 rounded-lg p-6 text-center"
                variants={featureVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="mb-4 text-purple-400 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
      

    </div>
  );
}
