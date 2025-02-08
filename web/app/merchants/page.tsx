"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import { motion } from "framer-motion"

interface Merchant {
  id: string
  business_name: string
  owner_name: string
  email: string
  phone: string
  business_type: string
  address: string
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function MerchantListing() {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchMerchants() {
      try {
        const { data, error } = await supabase.from("merchants").select("*").order("business_name", { ascending: true })
        if (error) throw error
        setMerchants(data || [])
      } catch (error) {
        console.error("Error fetching merchants:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMerchants()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-forest-50 to-sage-100 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-forest-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-50 to-sage-100">
      <div className="absolute inset-0 bg-[url('/leaf-pattern.png')] opacity-5" />

      <div className="relative container mx-auto px-4 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="space-y-4 mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-forest-800 group">
            Our Merchant Community
            <span className="block h-1 w-20 bg-forest-500 mt-2 group-hover:w-32 transition-all duration-300" />
          </h1>
          <p className="text-forest-600 text-lg">
            Discover our network of registered businesses
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {merchants.map((merchant, index) => (
            <motion.div
              key={merchant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="backdrop-blur-sm bg-white/90 rounded-xl shadow-lg p-6 border border-forest-200 hover:shadow-xl transition-all duration-300"
            >
              <h2 className="text-xl font-semibold text-forest-800 mb-3">{merchant.business_name}</h2>
              <div className="space-y-2 text-forest-600 mb-4">
                <p><span className="font-medium">Owner:</span> {merchant.owner_name}</p>
                <p><span className="font-medium">Type:</span> {merchant.business_type}</p>
                <p><span className="font-medium">Address:</span> {merchant.address}</p>
              </div>
              <Link
                href={`/merchants/${merchant.id}`}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-forest-600 to-forest-500 hover:from-forest-700 hover:to-forest-600 text-white rounded-lg transition-all duration-200 group"
              >
                <span>View Details</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
