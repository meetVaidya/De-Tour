"use client";

import { useState } from "react";
import RegisterForm from "@/components/RegisterForm";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Register() {
  const [step, setStep] = useState<"registration" | "additional">("registration");
  const [merchantId, setMerchantId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-50 to-sage-100">
      {/* Nature-inspired background pattern */}
      <div className="absolute inset-0 bg-[url('/leaf-pattern.png')] opacity-5" />

      <div className="relative container mx-auto px-4 py-8 max-w-md">

          <>
            <RegisterForm
              onSuccess={(id: string) => {
                setMerchantId(id);
                setStep("additional");
              }}
            />

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-center"
            >
              <p className="text-forest-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-forest-700 hover:text-forest-800 font-medium
                           underline decoration-2 decoration-forest-300
                           hover:decoration-forest-500 transition-all duration-200"
                >
                  Login here
                </Link>
              </p>
            </motion.div>
          </>

      </div>

      {/* Optional: Footer with additional links or information */}
      <motion.footer
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative text-center py-6 text-forest-500 text-sm"
      >
        <p>
          By registering, you agree to our{" "}
          <Link
            href="/terms"
            className="text-forest-600 hover:text-forest-700 underline
                     decoration-forest-300 hover:decoration-forest-500
                     transition-colors duration-200"
          >
            Terms of Service
          </Link>
          {" "}and{" "}
          <Link
            href="/privacy"
            className="text-forest-600 hover:text-forest-700 underline
                     decoration-forest-300 hover:decoration-forest-500
                     transition-colors duration-200"
          >
            Privacy Policy
          </Link>
        </p>
      </motion.footer>
    </div>
  );
}
