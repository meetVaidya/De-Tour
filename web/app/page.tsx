"use client";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { Camera, Users, Star, Award } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const stats = [
    { value: "100M+", label: "Subscribers", icon: Users },
    { value: "09+", label: "Years of Experience", icon: Star },
    { value: "12K", label: "Local Destinations", icon: Camera },
    { value: "5.0", label: "Average Rating", icon: Award }
  ];

  const destinations = [
    {
      title: "Mount Toba Trip",
      location: "Northern Sumatra",
      image: "/assets/toba.jpg"
    },
    {
      title: "Highland Trip",
      location: "West Sumatra",
      image: "/assets/highland.jpg"
    },
    {
      title: "Beach Coastal Trip",
      location: "South Sumatra",
      image: "/assets/beach.jpg"
    },
    {
      title: "Temple Cultural Trip",
      location: "Central Java",
      image: "/assets/temple.jpg"
    }
  ];

  const tourPackages = [
    {
      title: "Bali Tour Package",
      price: "$355",
      image: "/assets/bali.jpg"
    },
    {
      title: "Java Tour Package",
      price: "$428",
      image: "/assets/java.jpg"
    },
    {
      title: "Solo Tour Package",
      price: "$363",
      image: "/assets/solo.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <Image
            src="/assets/Background.svg"
            alt="Scenic background"
            fill
            className="object-cover brightness-75"
          />
        </div>

        <div className="relative z-10 h-full">
          {/* Navigation */}
          <nav className="flex items-center justify-between px-8 py-6">
            <div className="text-white text-2xl font-bold">FOOTTRIP</div>
            <div className="flex items-center gap-8 text-white">
              <button className="px-6 py-2 rounded-full border border-white hover:bg-white hover:text-emerald-800 transition-all">
                Sign In
              </button>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] text-center px-4">
            <h1 className="text-white text-6xl md:text-7xl font-black mb-6 leading-tight">
              Extraordinary natural and
              <br />
              cultural charm
            </h1>
            <p className="text-gray-200 mb-8 max-w-2xl">
              Exploring Indonesia to find your dream destination under the sun
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 text-white text-center min-w-[120px]">
                  <stat.icon className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Indonesian Tourism Section */}
      <section className="py-16 px-8">
        <h2 className="text-4xl font-bold mb-8">Indonesian tourism</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {destinations.map((dest, index) => (
            <div key={index} className="relative h-64 rounded-2xl overflow-hidden group">
              <Image
                src={dest.image}
                alt={dest.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-semibold">{dest.title}</h3>
                  <p className="text-sm opacity-80">{dest.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Process */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">One click for you</h2>
          <div className="space-y-6">
            {[
              "Find your destination",
              "Book a ticket",
              "Make a payment",
              "Explore dream location"
            ].map((step, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold">{step}</h3>
                  <p className="text-sm text-gray-600">Quick and easy process</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tour Packages */}
      <section className="py-16 px-8">
        <h2 className="text-4xl font-bold mb-8">Our tourist destination</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tourPackages.map((pack, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative h-80 rounded-2xl overflow-hidden mb-4">
                <Image
                  src={pack.image}
                  alt={pack.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-semibold">{pack.title}</h3>
              <p className="text-emerald-600 font-semibold">{pack.price}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="px-8 py-3 bg-emerald-800 text-white rounded-full hover:bg-emerald-700 transition-colors">
            View more
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div>
            <h3 className="text-xl font-bold mb-4">About</h3>
            <ul className="space-y-2 text-gray-400">
              <li>About Us</li>
              <li>Features</li>
              <li>News</li>
              <li>Menu</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Account</li>
              <li>Support Center</li>
              <li>Feedback</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">FAQ</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Account</li>
              <li>Manage Deliveries</li>
              <li>Orders</li>
              <li>Payments</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 rounded-lg px-4 py-2 flex-grow"
              />
              <button className="px-4 py-2 bg-emerald-600 rounded-lg">
                Send
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
