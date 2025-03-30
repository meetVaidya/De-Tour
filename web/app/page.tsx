// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  LogIn,
  MessageSquare,
  PlayCircle,
  Plus,
  CheckCircle,
  ArrowRight,
  Globe,
  Languages,
  FileText,
  Users,
  Settings,
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Circle,
  Bot, // Using Bot icon for WhatsApp
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Placeholder for Google Icon if not using a library like react-icons
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    ></path>
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    ></path>
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    ></path>
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    ></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);

export default function LandingPage() {
  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Header */}
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </span>
          <span className="font-bold text-xl">WhatsForm</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <button className="flex items-center text-gray-600 hover:text-gray-900">
            English <ChevronDown size={16} className="ml-1" />
          </button>
          <Link href="#" className="text-gray-600 hover:text-gray-900">
            Try Demo
          </Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
          <button className="flex items-center text-gray-600 hover:text-gray-900">
            Tools <ChevronDown size={16} className="ml-1" />
          </button>
        </nav>
        <div className="flex gap-3">
          <div>
            <Link href="/login">
              <Button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-5 rounded-lg transition duration-200 cursor-pointer">
                Login
              </Button>
            </Link>
          </div>
          <div>
            <Link href="/signup">
              <Button className="bg-blue-500 hover:bg-green-600 text-white font-semibold py-2 px-5 rounded-lg transition duration-200 cursor-pointer">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Get Bookings on <br />
            <span className="inline-flex items-center">
              <Bot className="w-10 h-10 text-green-500 mr-2" /> WhatsApp
            </span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Build forms without code & get the data directly from the customer's
            WhatsApp number ✨
          </p>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
            <div className="flex items-center border border-gray-300 rounded-md p-2 mb-4">
              <span className="text-lg px-2">🇮🇳 +91</span>
              <input
                type="tel"
                placeholder="1234567890"
                className="flex-grow p-2 border-l border-gray-300 ml-2 focus:outline-none"
              />
            </div>
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center mb-3 transition duration-200">
              Login from WhatsApp <ArrowRight size={20} className="ml-2" />
            </button>
            <div className="text-center text-gray-500 my-3">or</div>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition duration-200">
              <GoogleIcon /> Login with Google
            </button>
          </div>
          <p className="text-sm text-gray-500 text-center">
            No credit card & No coding required
          </p>
        </div>
        <div className="relative flex justify-center items-center">
          {/* Placeholder for the complex phone illustration */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-lg w-full max-w-sm relative">
            <div className="aspect-w-9 aspect-h-16 bg-white rounded-lg border border-gray-300 p-3 relative overflow-hidden">
              {/* Mockup Content */}
              <div className="absolute top-2 left-2 text-xs text-gray-500">
                whatsform.com
              </div>
              <div className="absolute top-2 right-2 text-xs text-gray-500">
                📶
              </div>
              <div className="mt-8 flex justify-around mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center text-3xl">
                  🍰
                </div>
                <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center text-3xl">
                  🎂
                </div>
              </div>
              <button className="w-full bg-green-100 text-green-700 py-2 rounded-md text-sm font-medium mb-12">
                Submit on WhatsApp{" "}
                <ArrowRight size={16} className="inline ml-1" />
              </button>

              {/* Floating Chat Bubble - Simplified */}
              <div className="absolute bottom-4 right-[-60px] bg-green-100 p-3 rounded-lg shadow-md max-w-[200px]">
                <p className="font-semibold text-sm">Cake Shop</p>
                <p className="text-xs text-gray-700 mb-1">
                  Your name: Alice Fox
                </p>
                <p className="text-xs text-gray-700 mb-1">
                  Choose your pastry: Chocolate - $6.5 Vanilla - $6
                </p>
                <p className="text-xs text-gray-700 mb-2">
                  Your delivery address: #15, 5th Avenue, Crossby Street
                </p>
                <p className="text-xs text-green-700 font-medium">
                  Thanks! Your order is confirmed ✅
                </p>
                <p className="text-right text-xs text-gray-400 mt-1">07:18</p>
              </div>
              {/* Simple line connector */}
              <svg
                className="absolute left-1/2 top-[200px] w-20 h-20 text-gray-400 -ml-10"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M50 0 C 50 50, 100 50, 100 100"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
        {/* Floating elements - simplified positioning */}
        <div className="absolute top-10 left-10 opacity-50 hidden lg:block">
          <div className="flex items-center space-x-2 bg-white p-3 rounded-full shadow-md">
            <Image
              src="/placeholder-avatar-1.png"
              alt="Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
              New Order received!
            </span>
          </div>
        </div>
        <div className="absolute top-20 right-10 opacity-50 hidden lg:block">
          <Image
            src="/placeholder-avatar-2.png"
            alt="Avatar"
            width={60}
            height={60}
            className="rounded-full shadow-md"
          />
        </div>
        <div className="absolute bottom-10 left-1/4 opacity-50 hidden lg:block">
          <Image
            src="/placeholder-avatar-3.png"
            alt="Avatar"
            width={50}
            height={50}
            className="rounded-full shadow-md"
          />
        </div>
        <div className="absolute bottom-10 right-1/4 opacity-50 hidden lg:block">
          <div className="flex items-center space-x-2 bg-white p-3 rounded-full shadow-md">
            <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
              I want a black T-s...
            </span>
            <Image
              src="/placeholder-avatar-4.png"
              alt="Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 max-w-3xl mx-auto">
            Increase orders, secure more bookings, and streamline customer
            interactions <span className="text-green-500">effortlessly</span>
          </h2>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <button className="inline-flex items-center text-green-600 font-medium mb-2">
            <PlayCircle size={20} className="mr-2" /> Watch Video
          </button>
          <h2 className="text-3xl md:text-4xl font-bold">
            How WhatsForm Works
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <div className="bg-green-100 p-6 rounded-lg mb-4 inline-block">
              {/* Placeholder for Step 1 graphic */}
              <Users size={40} className="text-green-600" />
            </div>
            <p className="font-semibold mb-2">1. Create & Share</p>
            <p className="text-gray-600 text-sm">
              You create the form & share it with customers
            </p>
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 p-6 rounded-lg mb-4 inline-block">
              {/* Placeholder for Step 2 graphic */}
              <FileText size={40} className="text-blue-600" />
            </div>
            <p className="font-semibold mb-2">2. Customer Fills</p>
            <p className="text-gray-600 text-sm">
              Customer fills in the data and clicks on Submit
            </p>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center">
            <div className="bg-purple-100 p-6 rounded-lg mb-4 inline-block">
              {/* Placeholder for Step 3 graphic */}
              <MessageSquare size={40} className="text-purple-600" />
            </div>
            <p className="font-semibold mb-2">3. Get Data in WhatsApp</p>
            <p className="text-gray-600 text-sm">
              You get the data in WhatsApp from customer's number
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Form Builder Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Meet the WhatsApp Form Builder
              </h2>
              <p className="text-gray-600 mb-6">
                The drag & drop form builder is dead simple so your job to
                create and manage form is as easy as possible
              </p>
              <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center transition duration-200">
                Get Started <ArrowRight size={20} className="ml-2" />
              </button>
            </div>
            <div className="bg-green-500 text-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">
                Translate to all major languages
              </h3>
              <p className="text-green-100 mb-6 text-sm">
                WhatsForm lets you create forms in multiple languages, making it
                easy to connect with users worldwide.
              </p>
              <div className="space-y-3">
                <div className="bg-white bg-opacity-20 p-3 rounded-md flex items-center text-sm">
                  🇺🇸 English
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-md flex items-center text-sm">
                  🇪🇸 Spanish
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-md flex items-center text-sm">
                  🇫🇷 French
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-md flex items-center text-sm">
                  🇯🇵 Japanese
                </div>
                {/* Add more languages */}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Feature: Ready-to-Use Templates */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-lg mb-2">
                Start from Ready-to-Use templates
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                Use pre-designed templates, customize them in seconds, and start
                collecting responses instantly.
              </p>
              {/* Placeholder for template image */}
              <div className="bg-gray-200 h-32 rounded-md flex items-center justify-center text-gray-400">
                Template Preview
              </div>
            </div>
            {/* Feature: Convert Google Forms */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-lg mb-2">
                Convert Google forms in one click
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                Easily convert your Google Forms into WhatsApp-friendly forms
                with just one click - quick, easy, and hassle-free!
              </p>
              {/* Placeholder for conversion image */}
              <div className="bg-gray-200 h-32 rounded-md flex items-center justify-center text-gray-400">
                Conversion Preview
              </div>
            </div>
          </div>

          {/* Testimonial Section (Integrated) */}
          <div className="text-center mb-12">
            <span className="text-sm text-green-600 font-medium">
              1000s Trusts WhatsForm
            </span>
            <h3 className="text-3xl font-bold mt-2 mb-6">
              Our users love us, give it a try!
            </h3>
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex items-start space-x-4">
              <Image
                src="/placeholder-avatar-5.png"
                alt="Sreerag"
                width={50}
                height={50}
                className="rounded-full flex-shrink-0"
              />
              <div>
                <p className="text-gray-700 italic text-left mb-2">
                  "A must-have tool for those who use WhatsApp Business
                  extensively. It saves us time as we have to ask too many
                  questions to our customers. It's convenient for our customers
                  too. It helps us to understand our customers better!"
                </p>
                <p className="font-semibold text-left">Sreerag</p>
                <p className="text-sm text-gray-500 text-left">FABIUS FRAMES</p>
              </div>
            </div>
            <button className="mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center transition duration-200 mx-auto">
              Get Started <ArrowRight size={20} className="ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <span className="text-sm text-green-600 font-medium">
            Easy To Use Templates
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            Choose from our ready to use templates
          </h2>
          <p className="text-gray-600 mt-2">
            Create your form in a single-click from our curated templates
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Template Card Example (Repeat for others) */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
            {/* Placeholder Image */}
            <div className="bg-gray-300 h-48 w-full">
              <Image
                src="/template-travel.jpg"
                alt="Travel Booking"
                width={400}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h4 className="font-semibold text-lg mb-2">Travel Booking</h4>
              <p className="text-gray-600 text-sm mb-4">
                Use this simple form to get travel requirements from your
                customer.
              </p>
              <div className="flex space-x-2">
                <button className="text-sm bg-green-100 text-green-700 py-1 px-3 rounded hover:bg-green-200">
                  Create Travel Form{" "}
                  <ArrowRight size={14} className="inline ml-1" />
                </button>
                <button className="text-sm bg-gray-100 text-gray-700 py-1 px-3 rounded hover:bg-gray-200">
                  Demo <ArrowRight size={14} className="inline ml-1" />
                </button>
              </div>
            </div>
          </div>
          {/* Add more template cards here (Contact Form, Customer Feedback, Restaurant Order, Store Order, Event Registration) */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="bg-gray-300 h-48 w-full">
              <Image
                src="/template-contact.jpg"
                alt="Contact Form"
                width={400}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h4 className="font-semibold text-lg mb-2">Contact Form</h4>
              <p className="text-gray-600 text-sm mb-4">
                Get general inquiries from anyone using this classic contact
                form.
              </p>
              <div className="flex space-x-2">
                <button className="text-sm bg-green-100 text-green-700 py-1 px-3 rounded hover:bg-green-200">
                  Create Contact Form{" "}
                  <ArrowRight size={14} className="inline ml-1" />
                </button>
                <button className="text-sm bg-gray-100 text-gray-700 py-1 px-3 rounded hover:bg-gray-200">
                  Demo <ArrowRight size={14} className="inline ml-1" />
                </button>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="bg-gray-300 h-48 w-full">
              <Image
                src="/template-feedback.jpg"
                alt="Customer Feedback"
                width={400}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h4 className="font-semibold text-lg mb-2">Customer Feedback</h4>
              <p className="text-gray-600 text-sm mb-4">
                Collect feedbacks from your customers about their experience.
              </p>
              <div className="flex space-x-2">
                <button className="text-sm bg-green-100 text-green-700 py-1 px-3 rounded hover:bg-green-200">
                  Create Feedback Form{" "}
                  <ArrowRight size={14} className="inline ml-1" />
                </button>
                <button className="text-sm bg-gray-100 text-gray-700 py-1 px-3 rounded hover:bg-gray-200">
                  Demo <ArrowRight size={14} className="inline ml-1" />
                </button>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="bg-gray-300 h-48 w-full">
              <Image
                src="/template-restaurant.jpg"
                alt="Restaurant Order"
                width={400}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h4 className="font-semibold text-lg mb-2">Restaurant Order</h4>
              <p className="text-gray-600 text-sm mb-4">
                Connect with customers who wants to order their favourite meals.
              </p>
              <div className="flex space-x-2">
                <button className="text-sm bg-green-100 text-green-700 py-1 px-3 rounded hover:bg-green-200">
                  Create Restaurant Form{" "}
                  <ArrowRight size={14} className="inline ml-1" />
                </button>
                <button className="text-sm bg-gray-100 text-gray-700 py-1 px-3 rounded hover:bg-gray-200">
                  Demo <ArrowRight size={14} className="inline ml-1" />
                </button>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="bg-gray-300 h-48 w-full">
              <Image
                src="/template-store.jpg"
                alt="Store Order"
                width={400}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h4 className="font-semibold text-lg mb-2">Store Order</h4>
              <p className="text-gray-600 text-sm mb-4">
                Use this form to help customers buy clothes and accessories
                online.
              </p>
              <div className="flex space-x-2">
                <button className="text-sm bg-green-100 text-green-700 py-1 px-3 rounded hover:bg-green-200">
                  Create Store Form{" "}
                  <ArrowRight size={14} className="inline ml-1" />
                </button>
                <button className="text-sm bg-gray-100 text-gray-700 py-1 px-3 rounded hover:bg-gray-200">
                  Demo <ArrowRight size={14} className="inline ml-1" />
                </button>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="bg-gray-300 h-48 w-full">
              <Image
                src="/template-event.jpg"
                alt="Event Registration"
                width={400}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h4 className="font-semibold text-lg mb-2">Event Registration</h4>
              <p className="text-gray-600 text-sm mb-4">
                Make registrations for events easier to manage and track using
                this form.
              </p>
              <div className="flex space-x-2">
                <button className="text-sm bg-green-100 text-green-700 py-1 px-3 rounded hover:bg-green-200">
                  Create Registration Form{" "}
                  <ArrowRight size={14} className="inline ml-1" />
                </button>
                <button className="text-sm bg-gray-100 text-gray-700 py-1 px-3 rounded hover:bg-gray-200">
                  Demo <ArrowRight size={14} className="inline ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h2 className="text-3xl font-bold mb-4">
                Got Questions? <br /> We've Got Answers!
              </h2>
              <p className="text-gray-600 mb-4">
                If you have more questions feel free to contact us.
              </p>
              <button className="text-green-600 font-medium flex items-center">
                Contact Us <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
            <div className="md:col-span-2 space-y-4">
              {/* FAQ Item (Using <details> for basic toggle) */}
              <details className="bg-white p-4 rounded-lg border border-gray-200 group">
                <summary className="font-semibold flex justify-between items-center cursor-pointer list-none">
                  Is WhatsForm Free?
                  <Plus size={18} className="group-open:hidden text-gray-500" />
                  {/* You might need JS to swap icons properly or use CSS */}
                  {/* <Minus size={18} className="hidden group-open:block text-gray-500" /> */}
                </summary>
                <p className="text-gray-600 mt-2 text-sm">
                  We have a free forever plan. You can choose a paid plan if you
                  need powerful features.
                </p>
              </details>
              <details className="bg-white p-4 rounded-lg border border-gray-200 group">
                <summary className="font-semibold flex justify-between items-center cursor-pointer list-none">
                  Is my data secured?
                  <Plus size={18} className="group-open:hidden text-gray-500" />
                </summary>
                <p className="text-gray-600 mt-2 text-sm">
                  Yes, your data security is our top priority. We employ
                  industry-standard security measures.
                </p>
              </details>
              <details className="bg-white p-4 rounded-lg border border-gray-200 group">
                <summary className="font-semibold flex justify-between items-center cursor-pointer list-none">
                  How to get started?
                  <Plus size={18} className="group-open:hidden text-gray-500" />
                </summary>
                <p className="text-gray-600 mt-2 text-sm">
                  Simply sign up using your WhatsApp number or Google account,
                  choose a template or start from scratch, and share your form
                  link!
                </p>
              </details>
              <details className="bg-white p-4 rounded-lg border border-gray-200 group">
                <summary className="font-semibold flex justify-between items-center cursor-pointer list-none">
                  Is WhatsForm run by Whatsapp or Facebook team?
                  <Plus size={18} className="group-open:hidden text-gray-500" />
                </summary>
                <p className="text-gray-600 mt-2 text-sm">
                  No, WhatsForm is an independent service built on top of the
                  WhatsApp Business API, but it is not directly affiliated with
                  or operated by WhatsApp or Meta (Facebook).
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 p-10 md:p-16 rounded-lg text-center relative overflow-hidden">
          {/* Optional decorative elements */}
          <div className="absolute -top-5 -left-5 w-20 h-20 bg-green-200 rounded-full opacity-30"></div>
          <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-blue-200 rounded-full opacity-30"></div>
          {/* Add floating avatar placeholders if desired */}

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform <br /> Your Customer Interaction?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Sign-up today and see the difference Active can make for your
            business
          </p>
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-200">
            Get Started <ArrowRight size={20} className="inline ml-2" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Column 1: Logo & Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </span>
                <span className="font-bold text-xl text-white">WhatsForm</span>
              </div>
              <p className="text-sm mb-4">
                Build Forms, No Code Needed. Collect Data Seamlessly via
                WhatsApp!
              </p>
              <div className="flex items-center border border-gray-600 rounded-md p-2 mb-4 bg-gray-700">
                <span className="text-sm px-2">🇮🇳 +91</span>
                <input
                  type="tel"
                  placeholder="1234567890"
                  className="flex-grow p-1 bg-transparent border-l border-gray-600 ml-2 focus:outline-none text-sm text-gray-300 placeholder-gray-500"
                />
              </div>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition duration-200">
                Login from WhatsApp <ArrowRight size={16} className="ml-1" />
              </button>
              <div className="flex space-x-4 mt-6">
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Facebook size={20} />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Twitter size={20} />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Linkedin size={20} />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Instagram size={20} />
                </Link>
              </div>
            </div>

            {/* Column 2: Products */}
            <div>
              <h5 className="font-semibold text-white mb-4">Products</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-white">
                    WhatsApp Widget
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Google form to WhatsApp
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    WhatsApp for Teams
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    WhatsApp API
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Join Affiliate Program
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Support */}
            <div>
              <h5 className="font-semibold text-white mb-4">Support</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    System Status
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Placeholder/Empty or Contact */}
            <div>
              {/* You can add contact info or leave it empty based on the design */}
              <h5 className="font-semibold text-white mb-4">Contact</h5>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Mail size={16} className="mr-2" /> support@whatsform.com
                </li>
                <li className="flex items-center">
                  <Phone size={16} className="mr-2" /> +1 234 567 890
                </li>
                <li className="flex items-start">
                  <MapPin size={16} className="mr-2 mt-1" /> 123 Innovation
                  Drive,
                  <br /> Tech City, USA
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            © 2024 WhatsForm Company - Copyright All rights reserved
          </div>
        </div>
      </footer>
    </div>
  );
}
