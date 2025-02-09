import pandas as pd
import torch
from transformers import BertTokenizer, BertForSequenceClassification
from torch.utils.data import DataLoader, Dataset
import torch.nn.functional as F

# Load the dataset
file_path = 'D:/djsanghvi/hacks/LOC-WhyTorch/ml/riya/utils/hotel_reviews_india.csv'
df = pd.read_csv(file_path)

# Check column names
print(df.head())  # Ensure the correct column name for reviews

# Assuming the reviews are in a column named 'review_text'
class ReviewDataset(Dataset):
    def _init_(self, texts, tokenizer, max_length=128):
        self.texts = texts
        self.tokenizer = tokenizer
        self.max_length = max_length
    
    def _len_(self):
        return len(self.texts)
    
    def _getitem_(self, idx):
        text = str(self.texts[idx])
        encoding = self.tokenizer(
            text,
            padding='max_length',
            truncation=True,
            max_length=self.max_length,
            return_tensors="pt"
        )
        return {key: val.squeeze(0) for key, val in encoding.items()}

# Load pre-trained BERT model and tokenizer
tokenizer = BertTokenizer.from_pretrained('nlptown/bert-base-multilingual-uncased-sentiment')
model = BertForSequenceClassification.from_pretrained('nlptown/bert-base-multilingual-uncased-sentiment')
model.eval()

def predict_sentiment(reviews):
    dataset = ReviewDataset(reviews, tokenizer)
    dataloader = DataLoader(dataset, batch_size=16, shuffle=False)
    
    sentiments = []
    with torch.no_grad():
        for batch in dataloader:
            input_ids = batch['input_ids']
            attention_mask = batch['attention_mask']
            outputs = model(input_ids, attention_mask=attention_mask)
            scores = F.softmax(outputs.logits, dim=1)
            sentiment_scores = torch.arange(-10, 11, step=20/5).float()
            sentiment_values = torch.matmul(scores, sentiment_scores)
            sentiments.extend(sentiment_values.numpy())
    
    return sentiments

# Perform sentiment analysis
df['sentiment_score'] = predict_sentiment(df['Review'])

# Save results
df.to_csv('D:/djsanghvi/hacks/LOC-WhyTorch/ml/riya/utils/hotel_reviews_with_sentiment.csv', index=False)

print("Sentiment analysis complete! Results saved as hotel_reviews_with_sentiment.csv")