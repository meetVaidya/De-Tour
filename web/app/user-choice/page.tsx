'use client'

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function UserChoice() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-50 to-sage-100">
      <div className="absolute inset-0 bg-[url('/leaf-pattern.png')] opacity-5" />

      <Navbar />

      <main className="relative container mx-auto px-4 py-12 pt-32 pb-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-forest-800 group">
              Choose Your Journey
              <span className="block h-1 w-20 bg-forest-500 mt-2 mx-auto group-hover:w-32 transition-all duration-300" />
            </h1>
            <p className="text-forest-600 text-lg">
              Select how you'd like to join our community
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* User Card */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/register')}
              className="cursor-pointer backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl p-8 border border-forest-200
                         hover:shadow-2xl transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-forest-800 text-center">Join as User</h2>
                <p className="text-forest-600 text-center">
                  Create a personal account to explore and enjoy our services
                </p>
              </div>
            </motion.div>

            {/* Merchant Card */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/merchant-register')}
              className="cursor-pointer backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl p-8 border border-forest-200
                         hover:shadow-2xl transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-forest-800 text-center">Join as Merchant</h2>
                <p className="text-forest-600 text-center">
                  Register your business and start selling with us
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
