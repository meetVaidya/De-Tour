"use client";

import { useState } from "react";

interface AdditionalInfoModalProps {
  userType: "user" | "merchant";
  initialData: {
    name: string | null;
    email: string | null;
    uid: string;
  };
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
}

export default function AdditionalInfoModal({
  userType,
  initialData,
  onSubmit,
  onClose,
}: AdditionalInfoModalProps) {
  const [formData, setFormData] = useState(
    userType === "user"
      ? {
          name: initialData.name || "",
          email: initialData.email || "",
          phoneNumber: "",
          age: "",
          gender: "",
          disabled: false,
        }
      : {
          name: initialData.name || "",
          email: initialData.email || "",
          phoneNumber: "",
          businessName: "",
          businessAddress: "",
          businessDescription: "",
          businessLogo: "",
          businessCategory: "",
          businessWebsite: "",
        },
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Additional Information Required
          </h3>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {userType === "user" ? (
              // User Form Fields
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="disabled"
                    checked={formData.disabled}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Disabled
                  </label>
                </div>
              </>
            ) : (
              // Merchant Form Fields
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                {/* Add other merchant fields similarly */}
              </>
            )}

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  loading
                    ? "bg-indigo-400"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
