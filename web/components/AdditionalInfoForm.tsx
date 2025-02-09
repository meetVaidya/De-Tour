"use client";

import React from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

interface AdditionalInfoFormProps {
  // Optionally pass the merchantId if you need to relate this info to a particular merchant.
  merchantId: string | null;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AdditionalInfoForm({ merchantId }: AdditionalInfoFormProps) {
  const [form, setForm] = React.useState({
    age: "",
    gender: "",
    disabled: false,
    allergies: "",
    dietaryPreferences: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const newValue =
      target.type === "checkbox"
        ? (target as HTMLInputElement).checked
        : target.value;
    setForm((prev) => ({
      ...prev,
      [target.name]: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Post the additional data to a dedicated table (or update an existing record).
      const { error } = await supabase.from("user_details").insert([
        {
          // Optional: include the merchantId if needed.
          merchant_id: merchantId,
          age: parseInt(form.age),
          gender: form.gender,
          disabled: form.disabled,
          allergies: form.allergies,
          dietary_preferences: form.dietaryPreferences,
        },
      ]);

      if (error) {
        throw error;
      }

      toast.success("Additional information saved successfully!");
      setForm({
        age: "",
        gender: "",
        disabled: false,
        allergies: "",
        dietaryPreferences: "",
      });
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to save information");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-50 to-sage-100 relative">
      <div className="absolute inset-0 bg-[url('/leaf-pattern.png')] opacity-5" />
      <main className="relative container mx-auto px-4 py-12 max-w-md">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl p-8 md:p-10 border border-forest-200"
        >
          <div className="space-y-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-forest-800 group">
              Additional Information
              <span className="block h-1 w-20 bg-forest-500 mt-2 group-hover:w-32 transition-all duration-300" />
            </h1>
            <p className="text-forest-600 text-lg">
              Please provide additional details to complete your profile.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="age" className="block text-sm font-medium text-forest-700">
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                placeholder="Enter your age"
                value={form.age}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-forest-200 focus:ring-forest-500 focus:border-forest-500 text-forest-900"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="gender" className="block text-sm font-medium text-forest-700">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-forest-200 focus:ring-forest-500 focus:border-forest-500 text-forest-900"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="nonbinary">Non-binary</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex items-center space-x-3">
              <input
                id="disabled"
                name="disabled"
                type="checkbox"
                checked={form.disabled}
                onChange={handleChange}
                className="h-4 w-4 text-forest-600 focus:ring-forest-500 border-forest-300 rounded"
              />
              <label htmlFor="disabled" className="text-sm font-medium text-forest-700">
                I have a disability
              </label>
            </div>
            <div className="space-y-2">
              <label htmlFor="allergies" className="block text-sm font-medium text-forest-700">
                Allergies
              </label>
              <input
                id="allergies"
                name="allergies"
                type="text"
                placeholder="List any allergies"
                value={form.allergies}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-forest-200 focus:ring-forest-500 focus:border-forest-500 text-forest-900"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="dietaryPreferences" className="block text-sm font-medium text-forest-700">
                Dietary Preferences
              </label>
              <input
                id="dietaryPreferences"
                name="dietaryPreferences"
                type="text"
                placeholder="E.g. Vegetarian, Vegan"
                value={form.dietaryPreferences}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-forest-200 focus:ring-forest-500 focus:border-forest-500 text-forest-900"
              />
            </div>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full py-3 px-6 text-lg font-medium text-white
                bg-gradient-to-r from-forest-600 to-forest-500
                hover:from-forest-700 hover:to-forest-600
                rounded-xl shadow-md transform transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2
                ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                group
              `}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Saving...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>Submit Info</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              )}
            </motion.button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
