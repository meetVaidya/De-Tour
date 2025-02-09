"use client";

import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { useStore } from "@/utils/store";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { Navbar } from "@/components/Navbar";

const businessTypes = [
    { value: "retail", label: "Retail" },
    { value: "restaurant", label: "Restaurant" },
    { value: "service", label: "Service" },
    { value: "other", label: "Other" },
];

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function MerchantRegistration() {
    const { form, errors, setField, validateForm, resetForm } = useStore();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    // New state for image file
    const [imageFile, setImageFile] = React.useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted", form);

        const isValid = validateForm();
        console.log("Form validation:", isValid);

        if (isValid) {
            setIsSubmitting(true);
            let imageUrl = null;

            try {
                // If an image file is selected, upload it to Supabase Storage.
                if (imageFile) {
                    // Create a unique filename (for example, using Date.now())
                    const fileName = `${Date.now()}-${imageFile.name}`;
                    // Adjust the bucket name if needed (here we assume "merchant-images")
                    let { error: uploadError } = await supabase.storage
                        .from("merchant-images")
                        .upload(fileName, imageFile);

                    if (uploadError) {
                        console.error(
                            "Error uploading image:",
                            uploadError.message,
                        );
                        throw uploadError;
                    }
                    // Get the public URL of the uploaded image.
                    const {
                        data: { publicUrl },
                    } = supabase.storage
                        .from("merchant-images")
                        .getPublicUrl(fileName);
                    imageUrl = publicUrl;
                }

                const { data, error } = await supabase
                    .from("merchants")
                    .insert([
                        {
                            business_name: form.businessName?.trim(),
                            owner_name: form.ownerName?.trim(),
                            email: form.email?.trim(),
                            phone: form.phone?.trim(),
                            business_type: form.businessType?.trim(),
                            address: form.address?.trim(),
                            status: "pending",
                            image_url: imageUrl, // Store image URL in DB
                            likes: 0,
                            dislikes: 0,
                        },
                    ])
                    .select();

                if (error) {
                    console.error("Database error:", error);
                    throw error;
                }

                console.log("Inserted data:", data);
                toast.success("Registration successful!");
                resetForm();
                setImageFile(null);
            } catch (error: any) {
                console.error("Submission error:", error);
                toast.error(error.message || "Registration failed");
            } finally {
                setIsSubmitting(false);
            }
        } else {
            console.log("Form errors:", errors);
            toast.error("Please fix the errors in the form");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-forest-50 to-sage-100">
            <div className="absolute inset-0 bg-[url('/leaf-pattern.png')] opacity-5" />

            <Navbar />

            <main className="relative container mx-auto px-4 py-12 pt-32 pb-16 max-w-2xl">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    transition={{ duration: 0.5 }}
                    className="backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl p-8 md:p-10 border border-forest-200"
                >
                    <div className="space-y-4 mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-forest-800 group">
                            Join Our Merchant Community
                            <span className="block h-1 w-20 bg-forest-500 mt-2 group-hover:w-32 transition-all duration-300" />
                        </h1>
                        <p className="text-forest-600 text-lg">
                            Get started with your business registration
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Input
                                label="Business Name"
                                value={form.businessName || ""}
                                onChange={(e) =>
                                    setField("businessName", e.target.value)
                                }
                                error={errors.businessName}
                                placeholder="Enter your business name"
                                className="focus:ring-forest-500 focus:border-forest-500 border-forest-200"
                            />
                            <Input
                                label="Owner Name"
                                value={form.ownerName || ""}
                                onChange={(e) =>
                                    setField("ownerName", e.target.value)
                                }
                                error={errors.ownerName}
                                placeholder="Enter owner's full name"
                                className="focus:ring-forest-500 focus:border-forest-500 border-forest-200"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Input
                                label="Email"
                                type="email"
                                value={form.email || ""}
                                onChange={(e) =>
                                    setField("email", e.target.value)
                                }
                                error={errors.email}
                                placeholder="Enter your email address"
                                className="focus:ring-forest-500 focus:border-forest-500 border-forest-200"
                            />
                            <Input
                                label="Phone"
                                type="tel"
                                value={form.phone || ""}
                                onChange={(e) =>
                                    setField("phone", e.target.value)
                                }
                                error={errors.phone}
                                placeholder="Enter your phone number"
                                className="focus:ring-forest-500 focus:border-forest-500 border-forest-200"
                            />
                        </div>

                        <Select
                            label="Business Type"
                            value={form.businessType}
                            onChange={(e) =>
                                setField("businessType", e.target.value)
                            }
                            error={errors.businessType}
                            options={businessTypes}
                            className="focus:ring-forest-500 focus:border-forest-500 border-forest-200"
                        />

                        <Input
                            label="Address"
                            value={form.address || ""}
                            onChange={(e) =>
                                setField("address", e.target.value)
                            }
                            error={errors.address}
                            placeholder="Enter your business address"
                            className="focus:ring-forest-500 focus:border-forest-500 border-forest-200"
                        />

                        {/* New File Input for Merchant Image */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Business Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-forest-500 file:text-white
                  hover:file:bg-forest-700"
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
                rounded-xl shadow-md
                transform transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2
                ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                group
              `}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center space-x-2">
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        viewBox="0 0 24 24"
                                    >
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
                                    <span>Register Your Business</span>
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
                    </form>
                </motion.div>
            </main>
        </div>
    );
}
