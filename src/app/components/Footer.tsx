import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 py-8 px-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p>&copy; 2023 ChitChain. All rights reserved.</p>
        </div>
        <div className="flex space-x-4 mb-4 md:mb-0">{/* Social links */}</div>
        <div className="flex space-x-4">
          <Link
            href="/terms"
            className="hover:text-purple-400 transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="hover:text-purple-400 transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
