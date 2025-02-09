from dotenv import load_dotenv
from langchain.document_loaders import Docx2txtLoader, PyPDFLoader
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.summarize import load_summarize_chain
from langchain.prompts import PromptTemplate
from langchain.text_splitter import CharacterTextSplitter
import os
import json

load_dotenv()

def process_docx(docx_file_path):
    loader = Docx2txtLoader(docx_file_path)
    text = loader.load_and_split()
    return text

def process_pdf(pdf_file_path):
    text = ""
    loader = PyPDFLoader(pdf_file_path)
    pages = loader.load()

    for page in pages:
        text += page.page_content
    text = text.replace('\t', ' ')

    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=50
    )
    texts = text_splitter.create_documents([text])

    return texts

def process_cv(file_path):
    file_extension = file_path.split('.')[-1].lower()
    
    print("File Details:")
    print(f"File Path: {file_path}")
    print(f"File Type: {file_extension}")

    if file_extension == "docx":
        text = process_docx(file_path)
    elif file_extension == "pdf":
        text = process_pdf(file_path)
    else:
        raise ValueError("Unsupported file format. Please provide a .docx or .pdf file.")

    # Initialize Gemini LLM
    llm = ChatGoogleGenerativeAI(
        temperature=0,
        model="gemini-pro",
        google_api_key=os.getenv('GOOGLE_GEMINI_API_KEY')
    )

    prompt_template = """You have been given a Itinerary to analyse. 
    Extract the following information in a structured format: 
    {text}
    Details:"""
    prompt = PromptTemplate.from_template(prompt_template)

    refine_template = (
        "Your job is to produce a final outcome in JSON format.\n"
        "We have provided an existing detail: {existing_answer}\n"
        "We want a refined version of the existing detail based on initial details below\n"
        "------------\n"
        "{text}\n"
        "------------\n"
        "Given the new context, provide the information in this exact JSON format:\n"
        "{{\n"
        '    "name": "",\n'
        '    "numberOfPeople": <extract number of tourists>,\n'
        '    "daysOfVisit": <Number of Days that the tour is of. This can be calculated by counting the number of days between the start date and the end date: >,\n'
        '    "placesToVisit": [<list of The Places the tour will go to duing its entirety. All the tourists spots mentioned: >],\n'
        '    "dateOfVisit": "<start date of the tour in DD-MM-YYYY format>",\n'
        '    "currentStay": "<name of the first/arrival hotel>"\n'
        "}}\n"
        "Ensure the output is valid JSON. Remove any explanatory text."
    )
    refine_prompt = PromptTemplate.from_template(refine_template)

    chain = load_summarize_chain(
        llm=llm,
        chain_type="refine",
        question_prompt=prompt,
        refine_prompt=refine_prompt,
        return_intermediate_steps=True,
        input_key="input_documents",
        output_key="output_text",
    )

    result = chain({"input_documents": text}, return_only_outputs=True)
    
    # Parse the output text as JSON
    try:
        json_output = json.loads(result['output_text'])
        print("\nItinerary Details (JSON):")
        print(json.dumps(json_output, indent=4))
        return json_output
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        print("Raw output:", result['output_text'])
        return None

if __name__ == "_main_":
    # Example usage
    file_path = "C:/Users/rahan/Downloads/south-africa-itinerary-2024.pdf"  # Replace with your file path
    itinerary_data = process_cv(file_path)
    
    if itinerary_data:
        # Access the data using your schema
        user_name = itinerary_data["name"]
        tourists = itinerary_data["numberOfPeople"]
        days = itinerary_data["daysOfVisit"]
        places = itinerary_data["placesToVisit"]
        date = itinerary_data["dateOfVisit"]
        hotel = itinerary_data["currentStay"]