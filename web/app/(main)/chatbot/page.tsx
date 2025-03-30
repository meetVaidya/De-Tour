"use client";

import { useState, FormEvent, useRef, useEffect } from "react";

// Define a type for the chat message structure
interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
}

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

  // Function to scroll to the bottom of the chat messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // useEffect to scroll down when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
    };

    // Add user message to the chat immediately
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const currentInput = input.trim(); // Capture input before clearing
    setInput(""); // Clear the input field
    setIsLoading(true);
    setError(null);

    try {
      if (!apiBaseUrl) {
        throw new Error("API URL is not configured.");
      }

      const response = await fetch(`${apiBaseUrl}/chat/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_input: currentInput }),
      });

      if (!response.ok) {
        // Try to get error message from backend response body
        let errorMsg = `Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg; // Use backend error if available
        } catch (parseError) {
          // Ignore if response body isn't valid JSON
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();

      // --- Adjust this line based on your actual API response structure ---
      const botText = data.response; // Assuming the response is { "response": "..." }
      // --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

      if (!botText) {
        throw new Error("Received an empty response from the bot.");
      }

      const botMessage: Message = {
        id: Date.now() + 1, // Ensure unique ID
        sender: "bot",
        text: botText,
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (err: any) {
      console.error("Chat API error:", err);
      setError(err.message || "Failed to get response from the bot.");
      // Optionally, remove the user's message if the API call failed entirely
      // setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      {" "}
      {/* Changed h-screen to h-full here */}
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {" "}
        {/* Increased padding */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-6 py-4 rounded-[12px] shadow-md transition-all duration-200 ${
                message.sender === "user"
                  ? "bg-[#00C853] text-white"
                  : "bg-white text-[#000000]"
              }`}
            >
              {message.text.split("\n").map((line, index) => (
                <p key={index} className="text-[16px] leading-[1.5]">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Loading Indicator */}
      {isLoading && (
        <div className="p-4 text-center text-[#5F6368] font-normal">
          Bot is thinking...
        </div>
      )}
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-center rounded-[12px] mx-6 mb-4">
          Error: {error}
        </div>
      )}
      {/* Input Area */}
      <div className="p-6 bg-white border-t border-gray-100 shadow-lg">
        {" "}
        {/* Updated input area */}
        <form
          onSubmit={handleSubmit}
          className="flex space-x-4 max-w-[1200px] mx-auto"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-6 py-4 border border-gray-200 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#00C853] transition-all duration-200 text-[16px]"
            disabled={isLoading}
            aria-label="Chat input"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-8 py-4 bg-[#00C853] text-white rounded-[12px] hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#00C853] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
