"use client"

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/components/ChatMessage";
import { useChatStore } from "@/utils/chat-store";
import { Loader2, Send } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function App() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, isLoading } = useChatStore();

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;

      try {
        await sendMessage(input);
        setInput("");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive"
        });
      }
    };

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-50 to-sage-100">
      <div className="absolute inset-0 bg-[url('/leaf-pattern.png')] opacity-5" />

      <main className="relative container mx-auto px-4 pt-32 py-12 max-w-4xl min-h-screen">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl p-8 md:p-10 border border-forest-200 h-[80vh] flex flex-col"
        >
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin scrollbar-thumb-forest-200 scrollbar-track-transparent pr-4">
            {messages.length === 0 ? (
              <div className="text-center text-forest-500 pt-8 italic">
                Start a conversation with our AI assistant
              </div>
            ) : (
              messages.map((msg, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={index}
                >
                  <ChatMessage
                    message={msg.content}
                    isUser={msg.isUser}
                    className={`
                      ${msg.isUser ? 'bg-forest-100' : 'bg-sage-50'}
                      border border-forest-200/50
                      rounded-xl p-4 shadow-sm
                    `}
                  />
                </motion.div>
              ))
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-3 mt-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="focus:ring-forest-500 focus:border-forest-500 border-forest-200 rounded-xl"
            />
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                px-6 py-2 font-medium text-white
                bg-gradient-to-r from-forest-600 to-forest-500
                hover:from-forest-700 hover:to-forest-600
                rounded-xl shadow-md
                transform transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                flex items-center gap-2
              `}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>Send</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
