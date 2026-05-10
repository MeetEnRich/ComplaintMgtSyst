from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# ── App setup ──────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)

# ── Load models ────────────────────────────────────────────────────────────
category_model      = joblib.load('models/category_model.pkl')
category_vectorizer = joblib.load('models/category_vectorizer.pkl')
sentiment_model      = joblib.load('models/sentiment_model.pkl')
sentiment_vectorizer = joblib.load('models/sentiment_vectorizer.pkl')

# ── NLP setup ──────────────────────────────────────────────────────────────
stop_words  = set(stopwords.words('english'))
lemmatizer  = WordNetLemmatizer()

# ── Preprocessing ──────────────────────────────────────────────────────────
def preprocess(text):
    text   = str(text).lower()
    text   = re.sub(r'[^a-z\s]', '', text)
    tokens = text.split()
    tokens = [lemmatizer.lemmatize(t) for t in tokens if t not in stop_words]
    return ' '.join(tokens)

# ── Label maps ─────────────────────────────────────────────────────────────
SENTIMENT_MAP = {
    0: 'Negative',
    1: 'Neutral'
}

PRIORITY_MAP = {
    0: 'Urgent',
    1: 'Not Urgent'
}

CATEGORY_MAP = {
    'credit_card':        'Credit Card',
    'credit_reporting':   'Credit Reporting',
    'debt_collection':    'Debt Collection',
    'mortgages_and_loans':'Mortgages and Loans',
    'retail_banking':     'Retail Banking'
}

# ── Health check ───────────────────────────────────────────────────────────
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'Flask ML API is running'}), 200

# ── Main prediction endpoint ───────────────────────────────────────────────
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    # Validate input
    if not data or 'complaint_text' not in data:
        return jsonify({'error': 'complaint_text field is required'}), 400

    raw_text = data['complaint_text']

    if not raw_text or len(raw_text.strip()) < 10:
        return jsonify({'error': 'Complaint text is too short'}), 400

    # Preprocess
    clean = preprocess(raw_text)

    # Category prediction
    cat_vec       = category_vectorizer.transform([clean])
    category_raw  = category_model.predict(cat_vec)[0]
    category      = CATEGORY_MAP.get(category_raw, category_raw)

    # Sentiment prediction
    sent_vec      = sentiment_vectorizer.transform([clean])
    sentiment_raw = int(sentiment_model.predict(sent_vec)[0])
    sentiment     = SENTIMENT_MAP.get(sentiment_raw, 'Neutral')

    # Priority derived from sentiment
    priority_raw  = 0 if sentiment_raw == 0 else 1
    priority      = PRIORITY_MAP.get(priority_raw)

    # Build response
    response = {
        'complaint_text': raw_text,
        'category':       category,
        'sentiment':      sentiment,
        'sentiment_code': sentiment_raw,
        'priority':       priority,
        'priority_code':  priority_raw
    }

    return jsonify(response), 200


# ── Run ────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    app.run(debug=True, port=5000)