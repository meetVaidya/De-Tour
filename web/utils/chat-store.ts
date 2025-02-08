import { create } from 'zustand';

interface Message {
  content: string;
  isUser: boolean;
}

interface ChatStore {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (message: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  sendMessage: async (message: string) => {
    try {
      set({ isLoading: true });

      // Add user message immediately
      set(state => ({
        messages: [...state.messages, { content: message, isUser: true }]
      }));

      // Send message to backend
      const response = await fetch('http://localhost:5000/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_input: message })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Add bot response
      set(state => ({
        messages: [...state.messages, { content: data.bot_response, isUser: false }]
      }));

    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error (maybe show an error message to user)
    } finally {
      set({ isLoading: false });
    }
  }
}));
