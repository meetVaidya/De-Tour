"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface ImageWithUser {
    id: string;
    file_path: string;
    created_at: string;
    users: {
        id: string;
        email: string;
        name: string;
    };
}

export default function GalleryPage() {
    const [images, setImages] = useState<ImageWithUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            // This query assumes your images table has a foreign key "owner_id"
            // that references the users table (or auth.users if you are using Supabase Auth)
            const { data, error } = await supabase
                .from("images")
                .select(`id, file_path, created_at, users ( id, email, name )`)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching images:", error.message);
            } else {
                setImages(data as unknown as ImageWithUser[]);
            }
            setLoading(false);
        };
        fetchImages();
    }, []);

    if (loading) {
        return <p>Loading images...</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Gallery</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {images.map((image) => {
                    // Use the same bucket name ("waste-images") you used to upload the images.
                    const publicUrl = supabase.storage
                        .from("waste-images")
                        .getPublicUrl(image.file_path).data.publicUrl;
                    console.log("Image URL:", publicUrl);
                    return (
                        <div key={image.id} className="border rounded p-4">
                            <img
                                src={publicUrl}
                                alt="Uploaded"
                                className="w-full h-64 object-cover mb-4 rounded"
                            />
                            <p className="text-sm text-gray-600">
                                Posted by:{" "}
                                {image.users?.name || image.users?.email}
                            </p>
                            <p className="text-xs text-gray-500">
                                {new Date(image.created_at).toLocaleString()}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
