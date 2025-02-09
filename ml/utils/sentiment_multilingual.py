import pandas as pd
from transformers import AutoModelForSequenceClassification, AutoTokenizer, pipeline

# Load the CSV file
df = pd.read_csv("D:/djsanghvi/hacks/LOC-WhyTorch/ml/riya/utils/synthetic_reviews_unique.csv")

# Load pre-trained multilingual BERT model for sentiment analysis
model_name = "nlptown/bert-base-multilingual-uncased-sentiment"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)
sentiment_analyzer = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)

# Function to classify sentiment
def classify_sentiment(review):
    result = sentiment_analyzer(review[:512])[0]  # Limit to 512 tokens
    return "GREEN" if result["label"] in ["4 stars", "5 stars"] else "RED"

# Apply classification to English and Hindi reviews
df["Sentiment"] = df["Review"].apply(classify_sentiment)

# Save results
df.to_csv("sentiment_analysis_results_multilingual.csv", index=False)

print("Sentiment analysis completed for English and Hindi. Results saved to sentiment_analysis_results_multilingual.csv.")