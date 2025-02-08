"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

interface RegistrationFormProps {
  onSuccess: (merchantId: string) => void;
}

type Gender = 'male' | 'female' | 'other' | 'prefer-not-to-say';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // We'll store errors in an object in case you want to show individual field errors.
  const [errors, setErrors] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(null);
    setIsSubmitting(true);

    // Use FormData to gather field values.
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password_hash = formData.get("password") as string;
    const age = parseInt(formData.get("age") as string);
    const gender = formData.get("gender") as Gender;
    const disabled = formData.get("disabled") === "true";

    try {
      // Insert a new merchant record into your "merchants" table.
      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert([
          {
            name: name.trim(),
            email: email.trim(),
            password_hash,
            age,
            gender,
            disabled,
          },
        ])
        .select();

      if (userError) {
        setErrors(userError);
        toast.error(userError.message || "Registration failed");
        return;
      }

      if (userData && userData[0] && userData[0].id) {
              const { error: pointsError } = await supabase
                .from("user_points")
                .insert([
                  {
                    user_id: userData[0].id,
                    points: 0,
                  },
                ]);

              if (pointsError) {
                console.error("Failed to initialize user points:", pointsError);
                // Optionally delete the user if points initialization fails
                await supabase
                  .from("users")
                  .delete()
                  .eq("id", userData[0].id);
                toast.error("Failed to complete registration");
                return;
              }

              toast.success("Registration successful!");
              onSuccess(userData[0].id);
            }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full bg-gradient-to-b from-forest-50 to-sage-100 relative py-6"> {/* Changed min-h-screen to h-full and added py-6 */}
          <div className="absolute inset-0 bg-[url('/leaf-pattern.png')] opacity-5" />
          <main className="relative container mx-auto px-4 max-w-md"> {/* Removed py-12 */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              className="backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl p-6 border border-forest-200" // Changed p-8 md:p-10 to p-6
            >
              <div className="space-y-2 mb-4"> {/* Changed space-y-4 mb-8 to space-y-2 mb-4 */}
                <h1 className="text-2xl font-bold text-forest-800 group"> {/* Reduced text size */}
                  Create Account
                  <span className="block h-1 w-20 bg-forest-500 mt-1 group-hover:w-32 transition-all duration-300" />
                </h1>
                <p className="text-forest-600 text-base"> {/* Reduced text size */}
                  Join our community and enjoy natural inspiration.
                </p>
              </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-forest-700"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-xl border border-forest-200 focus:ring-forest-500 focus:border-forest-500 placeholder-forest-400 text-forest-900"
              />
              {errors?.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-forest-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl border border-forest-200 focus:ring-forest-500 focus:border-forest-500 placeholder-forest-400 text-forest-900"
              />
              {errors?.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-forest-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border border-forest-200 focus:ring-forest-500 focus:border-forest-500 placeholder-forest-400 text-forest-900"
              />
              {errors?.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Age Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="age"
                      className="block text-sm font-medium text-forest-700"
                    >
                      Age
                    </label>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      min="18"
                      max="120"
                      placeholder="Enter your age"
                      className="w-full px-4 py-3 rounded-xl border border-forest-200 focus:ring-forest-500 focus:border-forest-500 placeholder-forest-400 text-forest-900"
                    />
                    {errors?.age && (
                      <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                    )}
                  </div>

                  {/* Gender Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-forest-700"
                    >
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      className="w-full px-4 py-3 rounded-xl border border-forest-200 focus:ring-forest-500 focus:border-forest-500 text-forest-900"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                    {errors?.gender && (
                      <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                    )}
                  </div>

                  {/* Disabled Field */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        name="disabled"
                        value="true"
                        className="h-5 w-5 rounded border-forest-300 text-forest-600 focus:ring-forest-500"
                      />
                      <span className="text-sm font-medium text-forest-700">
                        Do you have any disabilities?
                      </span>
                    </label>
                    {errors?.disabled && (
                      <p className="text-red-500 text-sm mt-1">{errors.disabled}</p>
                    )}
                  </div>

            <SubmitButton isSubmitting={isSubmitting} />
          </form>
        </motion.div>
      </main>
    </div>
  );
}

interface SubmitButtonProps {
  isSubmitting: boolean;
}

function SubmitButton({ isSubmitting }: SubmitButtonProps) {
  return (
    <motion.button
      disabled={isSubmitting}
      type="submit"
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
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span>Registering...</span>
        </span>
      ) : (
        <span className="flex items-center justify-center space-x-2">
          <span>Register</span>
          <svg
            className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </span>
      )}
    </motion.button>
  );
}

export default RegistrationForm;
