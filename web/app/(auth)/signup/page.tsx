"use client";

import { useState } from "react";
import UserSignUpForm from "@/components/UserSignUpForm";
import MerchantSignUpForm from "@/components/MerchantSignUpForm";
import Link from "next/link";

export default function SignUpPage() {
  const [userType, setUserType] = useState<"user" | "merchant">("user");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              already have an account?
            </Link>
          </p>
        </div>

        {/* Toggle between User and Merchant */}
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              userType === "user"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setUserType("user")}
          >
            Sign up as User
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              userType === "merchant"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setUserType("merchant")}
          >
            Sign up as Merchant
          </button>
        </div>

        <div className="mt-8">
          {userType === "user" ? <UserSignUpForm /> : <MerchantSignUpForm />}
        </div>
      </div>
    </div>
  );
}
