"use client";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-500 text-sm">&copy; 2025 ManageBudget. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm">Privacy Policy</a>
          <a href="#" className="text-gray-500 hover:text-indigo-600 text-sm">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
