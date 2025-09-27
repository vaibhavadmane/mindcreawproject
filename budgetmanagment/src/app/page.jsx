"use client";
import React from "react";
import Navbar from "./_components/Navbar/page.jsx";
import Footer from "./_components/Footer/page.jsx";
import BudgetPredictor from "./_components/BudgetPredictor/page.jsx";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-20 bg-gray-50">
        <BudgetPredictor />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
