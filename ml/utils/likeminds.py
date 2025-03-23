import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import dotenv

dotenv.load_dotenv()

def fetch_all_tourists():
    """Retrieve all tourists. (MongoDB logic removed)"""
    return []

def calculate_similarity(new_tourist, tourists):
    """Computes cosine similarity between tourists based on travel preferences."""
    tourists.append(new_tourist)  # Add the new tourist for comparison

    # Create feature text for TF-IDF vectorization using purposeofvisit
    feature_texts = [
        f"{t.get('placetovisit', '')} {t.get('currentstay', '')} {t.get('date', '')} {t.get('purposeofvisit', '')}"
        for t in tourists
    ]

    # Compute TF-IDF vectors & similarity matrix
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(feature_texts)
    similarity_matrix = cosine_similarity(tfidf_matrix)

    # Get similarity scores for the last added tourist
    last_index = len(tourists) - 1
    similarity_scores = similarity_matrix[last_index][:-1]  # Exclude self-comparison

    # Find best match
    if similarity_scores.size > 0:
        best_match_index = np.argmax(similarity_scores)
        best_match = tourists[best_match_index]
        best_match_score = similarity_scores[best_match_index]
    else:
        best_match = None
        best_match_score = 0

    return best_match, best_match_score

def save_tourist(data):
    """Saves new tourist data. (MongoDB logic removed)"""
    pass

def match_tourists(new_tourist):
    """Matches the new tourist with the best similar existing tourist based on travel preferences."""
    required_fields = ["name", "placetovisit", "currentstay", "date", "purposeofvisit"]
    if not all(field in new_tourist for field in required_fields):
        return {"error": "Missing required fields for matching"}, 400

    # Fetch existing tourists for matching (MongoDB logic removed)
    existing_tourists = fetch_all_tourists()

    best_match, score = calculate_similarity(new_tourist, existing_tourists)

    # Save the new tourist data (MongoDB logic removed)
    save_tourist(new_tourist)

    if best_match:
        return {"best_match": best_match, "similarity_score": score}, 200
    else:
        return {"message": "No matching tourist found. New tourist added."}, 200
