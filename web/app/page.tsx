"use client";
import Image from "next/image";

export default function Home() {
    return (
        <div className="relative min-h-screen">
            {/* Background Image Container */}
            <div className="absolute top-[0.5vw] left-[0.5vw] w-[99vw] h-[95vh] z-[-1] overflow-hidden rounded-3xl border border-white shadow-xl">
                <Image
                    src="/assets/Background.svg"
                    alt="Scenic background"
                    fill
                    style={{
                        objectFit: "cover",
                        filter: "brightness(0.6)",
                    }}
                />
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center h-screen text-center">
                {/* Main Heading */}
                <h1 className="text-white text-8xl font-black mb-6 leading-tight font-grotesk">
                    EXTRAORDINARY NATURAL AND
                    <br />
                    CULTURAL CHARM
                </h1>

                {/* CTA Button */}
                <button
                    className="bg-white text-black px-8 py-3 rounded-full font-semibold
                             hover:bg-opacity-90 transition-all duration-200 shadow-lg"
                >
                    One click for you
                </button>
            </div>
        </div>
    );
}
