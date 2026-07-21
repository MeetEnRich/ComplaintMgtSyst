# ComplaintIQ — Intelligent Complaint Management System

> A full-stack web application that uses Machine Learning to automatically classify, analyze sentiment, and prioritize customer complaints in real time.

---

## Project Overview

ComplaintIQ accepts textual complaints from users, passes them through a Python-based ML microservice, and returns:

- **Category** — the financial product the complaint relates to
- **Sentiment** — whether the complaint is Negative or Neutral
- **Priority** — whether the complaint is Urgent or Not Urgent
- **Status tracking** — admins can update complaint resolution status
- **Complaint tracking** — users can look up their complaint status at any time using their complaint ID

---

## System Architecture

```
React Frontend        (port 5173)
        ↓
Express/Node.js Backend   (port 5001)
        ↓
Flask ML Microservice     (port 5000)
        ↓
SVM Classifiers (category + sentiment)
        ↓
SQLite Database (Local)
```

---

## Tech Stack

| Layer          | Technology                                       |
| -------------- | ------------------------------------------------ |
| Frontend       | React.js, Vite, React Router, Axios, Recharts    |
| Backend        | Node.js, Express.js, Sequelize, SQLite, bcryptjs |
| ML API         | Python, Flask, Flask-CORS                        |
| ML Models      | Scikit-learn, LinearSVC, TF-IDF Vectorizer       |
| Database       | SQLite (local file)                              |
| Authentication | JSON Web Tokens (JWT)                            |

---

## ML Models

### Category Classifier

- **Dataset:** CFPB Consumer Complaints (162,400 records)
- **Algorithm:** LinearSVC with TF-IDF vectorization
- **Classes:** Credit Card, Credit Reporting, Debt Collection, Mortgages and Loans, Retail Banking
- **Accuracy:** 89.14%

### Sentiment Classifier

- **Dataset:** Customer Complaints Sentiment and Priority (1,750 records)
- **Algorithm:** LinearSVC with class balancing and TF-IDF vectorization
- **Classes:** Negative (0), Neutral (1)
- **Accuracy:** 66.86%
- **Note:** Performance constrained by small dataset size. Documented as a project limitation.

---

## Project Structure

```
complaint_mgt/
│
├── ml/
│   ├── data/                          # excluded from repo — source datasets
│   ├── notebooks/
│   │   ├── 01_category_classifier.ipynb
│   │   └── 02_sentiment_classifier.ipynb
│   ├── models/                        # contains trained .pkl files (tracked)
│   ├── app.py
│   └── requirements.txt
│
├── server/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── complaintController.js
│   ├── middleware/authMiddleware.js
│   ├── models/Complaint.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── complaintRoutes.js
│   ├── .env.example
│   ├── seed.js                        # database seeder script
│   └── server.js
│
├── client/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   └── ProtectedRoute.jsx
│       ├── pages/
│       │   ├── LandingPage.jsx
│       │   ├── SubmitPage.jsx
│       │   ├── ResultPage.jsx
│       │   ├── TrackPage.jsx
│       │   ├── LoginPage.jsx
│       │   └── DashboardPage.jsx
│       └── services/api.js
│
├── setup.bat                          # automated setup script
├── start.bat                          # automated start script
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+

### First Time Setup

**Option A: Automated Setup (Windows)**

Simply double-click the `setup.bat` script in the root directory. It will automatically check for prerequisites, install all Node and Python dependencies, and create the necessary `.env` files.

**Option B: Manual Setup**

**1. Set up Python virtual environment**

```bash
cd ml
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

**2. Add training datasets**

The datasets are not included in the repository. Place the following files in `ml/data/` before running the notebooks:

- `complaints_processed.csv` — CFPB Consumer Complaints dataset
- `customer_complaints_sentiment.csv` — Sentiment and Priority dataset

**3. Train the models**

Open VS Code, navigate to `ml/notebooks/` and run both notebooks in order using the **Complaint MGT (venv)** kernel:

- `01_category_classifier.ipynb`
- `02_sentiment_classifier.ipynb`

This will generate the four `.pkl` model files in `ml/models/`.

**4. Configure environment variables**

**Backend:** Copy `server/.env.example` to `server/.env` and fill in the values:

```bash
cp server/.env.example server/.env
```

To generate a bcrypt hash for your admin password:

```bash
node -e "const b = require('bcryptjs'); b.hash('your_password', 12).then(h => console.log(h))"
```

To generate a strong JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

**Frontend:** Create a `client/.env` file and set your API URL:

```bash
echo VITE_API_URL=http://localhost:5001/api > client/.env
```

**5. Install backend dependencies**

```bash
cd server
npm install
```

**6. Install frontend dependencies**

```bash
cd client
npm install
```

**7. Seed the Database (Optional)**

Populate the SQLite database with 50 mock complaints for demonstration purposes:

```bash
cd server
npm run seed
```

---

## Running the Project

Double-click `start.bat` from the project root. It starts all three servers and opens the browser automatically.

Or run each server manually:

**Terminal 1 — Flask ML API**

```bash
cd ml
.venv\Scripts\activate
python app.py
```

**Terminal 2 — Express Backend**

```bash
cd server
npm run dev
```

**Terminal 3 — React Frontend**

```bash
cd client
npm run dev
```

---

## Access the Application

| Service         | URL                         |
| --------------- | --------------------------- |
| Web Application | http://localhost:5173       |
| Admin Login     | http://localhost:5173/login |
| Express API     | http://localhost:5001       |
| Flask ML API    | http://localhost:5000       |

**Default Admin Credentials:**

```
Username : admin
Password : admin1234
```

---

## API Endpoints

### Authentication

| Method | Endpoint        | Description                     |
| ------ | --------------- | ------------------------------- |
| POST   | /api/auth/login | Admin login — returns JWT token |

### Complaints

| Method | Endpoint                   | Access | Description                     |
| ------ | -------------------------- | ------ | ------------------------------- |
| POST   | /api/complaints            | Public | Submit a new complaint          |
| GET    | /api/complaints/:id        | Public | Track a complaint by ID         |
| GET    | /api/complaints            | Admin  | Get all complaints with filters |
| GET    | /api/complaints/stats      | Admin  | Dashboard statistics            |
| PATCH  | /api/complaints/:id/status | Admin  | Update complaint status         |

### ML API (Flask)

| Method | Endpoint | Description                                                |
| ------ | -------- | ---------------------------------------------------------- |
| GET    | /health  | Health check                                               |
| POST   | /predict | Classify complaint — returns category, sentiment, priority |

---

## Known Limitations

1. The sentiment classifier achieves 66.86% accuracy due to the small training dataset of 1,750 records. A larger labeled dataset would significantly improve performance.
2. The system supports English language complaints only.
3. Authentication uses a single admin account. A production system would require full user management.
4. The system is a prototype and has not been optimized for high-concurrency production deployment.

---

## Future Work

- Integrate a larger sentiment dataset to improve model accuracy
- Add multilingual support using transformer-based models such as BERT
- Implement role-based access control for multiple admin users
- Deploy to cloud infrastructure such as AWS, Azure, or GCP
- Add real-time email notifications for urgent complaints
- Implement WebSocket-based live dashboard updates

---
