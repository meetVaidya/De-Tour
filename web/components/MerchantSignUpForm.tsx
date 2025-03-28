"use client";

import { useState } from "react";
import { signUpMerchantWithEmail, signInWithGoogle } from "@/services/auth";

export default function MerchantSignUpForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phoneNumber: "",
    businessName: "",
    businessAddress: "",
    businessDescription: "",
    businessLogo: "",
    businessCategory: "",
    businessWebsite: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { email, password, ...merchantData } = formData;
      await signUpMerchantWithEmail(email, password, merchantData);
      // Handle successful sign-up
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>
        <input
          type="tel"
          name="phoneNumber"
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="businessName"
          className="block text-sm font-medium text-gray-700"
        >
          Business Name
        </label>
        <input
          type="text"
          name="businessName"
          id="businessName"
          value={formData.businessName}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="businessAddress"
          className="block text-sm font-medium text-gray-700"
        >
          Business Address
        </label>
        <input
          type="text"
          name="businessAddress"
          id="businessAddress"
          value={formData.businessAddress}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="businessDescription"
          className="block text-sm font-medium text-gray-700"
        >
          Business Description
        </label>
        <textarea
          name="businessDescription"
          id="businessDescription"
          value={formData.businessDescription}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="businessLogo"
          className="block text-sm font-medium text-gray-700"
        >
          Business Logo URL
        </label>
        <input
          type="url"
          name="businessLogo"
          id="businessLogo"
          value={formData.businessLogo}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="businessCategory"
          className="block text-sm font-medium text-gray-700"
        >
          Business Category
        </label>
        <input
          type="text"
          name="businessCategory"
          id="businessCategory"
          value={formData.businessCategory}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="businessWebsite"
          className="block text-sm font-medium text-gray-700"
        >
          Business Website
        </label>
        <input
          type="url"
          name="businessWebsite"
          id="businessWebsite"
          value={formData.businessWebsite}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Sign Up
        </button>
      </div>

      <div>
        <button
          type="button"
          onClick={() => signInWithGoogle("merchant")}
          className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Sign up with Google
        </button>
      </div>
    </form>
  );
}
