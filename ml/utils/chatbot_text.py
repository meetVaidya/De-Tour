import os
import json
import dotenv
import openai
from langchain_openai import ChatOpenAI

# Load environment variables
dotenv.load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI API
chatopenai = ChatOpenAI(model="gpt-3.5-turbo")

# Track conversation history
conversation_history = []

def get_chat_response(user_input):
    """Generates a response based on user input while tracking conversation history."""
    global conversation_history

    # Structure input in JSON
    user_query = {
        "user_input": user_input,
        "conversation_history": conversation_history
    }

    # Format prompt
    prompt = (
        "You are a chatbot specializing in Indian history. Provide detailed, engaging responses with historical examples.\n"
        f"Previous conversation: {json.dumps(conversation_history, indent=2)}\n"
        f"User query: {user_input}\n"
        "Response:"
    )

    try:
        # Get AI response
        response = chatopenai.invoke(prompt)
        generated_text = response.content.strip()

        # Structure output in JSON
        response_data = {
            "user_input": user_input,
            "bot_response": generated_text,
            "metadata": {
                "source": "AI-generated",
                "model": "gpt-3.5-turbo"
            }
        }

        # Update conversation history
        conversation_history.append({
            "user": user_input,
            "bot": generated_text
        })

        return json.dumps(response_data, indent=4)

    except Exception as e:
        return json.dumps({"error": str(e)})

# Interactive terminal chat
if __name__ == "__main__":
    print("\nHistoric India Chatbot - Type 'exit' to end the conversation.\n")
    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            print("Exiting chatbot. Goodbye!")
            break
        response = get_chat_response(user_input)
        print("Bot:", response)
