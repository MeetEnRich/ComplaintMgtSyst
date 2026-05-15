require('dotenv').config();
const mongoose = require('mongoose');
const Complaint = require('./models/Complaint');

const mockComplaints = [
  // Urgent / Negative (Credit Card)
  {
    complaint_text: "My credit card was charged $500 for a transaction I never made. I have called customer service three times and they hang up on me. This is fraud and I need it reversed immediately before my rent is due!",
    category: "Credit Card",
    sentiment: "Negative",
    sentiment_code: 0,
    priority: "Urgent",
    priority_code: 1,
    status: "Pending",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  },
  // Urgent / Negative (Mortgages)
  {
    complaint_text: "You are threatening to foreclose on my home even though I sent the payment last week. Your system is broken and now my family is terrified of losing our house. Fix this now!",
    category: "Mortgages and Loans",
    sentiment: "Negative",
    sentiment_code: 0,
    priority: "Urgent",
    priority_code: 1,
    status: "In Progress",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  },
  // Not Urgent / Neutral (Retail Banking)
  {
    complaint_text: "I am trying to find out what the routing number is for the branch located in downtown Seattle. The website is not very clear about which routing number to use for wire transfers.",
    category: "Retail Banking",
    sentiment: "Neutral",
    sentiment_code: 1,
    priority: "Not Urgent",
    priority_code: 0,
    status: "Pending",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
  },
  // Not Urgent / Negative (Debt Collection)
  {
    complaint_text: "A debt collector keeps calling my phone asking for someone named John. I have told them multiple times that they have the wrong number but they keep calling every single day.",
    category: "Debt Collection",
    sentiment: "Negative",
    sentiment_code: 0,
    priority: "Not Urgent",
    priority_code: 0,
    status: "Resolved",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 12)
  },
  // Urgent / Negative (Credit Reporting)
  {
    complaint_text: "My identity was stolen and there are 5 new accounts on my credit report. My score tanked by 150 points overnight. I need someone to help me dispute these fraudulent accounts immediately.",
    category: "Credit Reporting",
    sentiment: "Negative",
    sentiment_code: 0,
    priority: "Urgent",
    priority_code: 1,
    status: "Pending",
    submittedAt: new Date()
  },
  // Not Urgent / Neutral (Credit Card)
  {
    complaint_text: "I would like to request a credit limit increase on my rewards card. I have been a customer for 5 years and have never missed a payment.",
    category: "Credit Card",
    sentiment: "Neutral",
    sentiment_code: 1,
    priority: "Not Urgent",
    priority_code: 0,
    status: "Resolved",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
  },
  // Urgent / Negative (Retail Banking)
  {
    complaint_text: "My checking account is completely locked and I cannot access my funds to pay for my groceries. I am stranded at the store and phone support says the wait time is 2 hours!",
    category: "Retail Banking",
    sentiment: "Negative",
    sentiment_code: 0,
    priority: "Urgent",
    priority_code: 1,
    status: "In Progress",
    submittedAt: new Date(Date.now() - 1000 * 60 * 30) // 30 mins ago
  }
];

// Generate more random data to flesh out the dashboard
const categories = ['Credit Card', 'Credit Reporting', 'Debt Collection', 'Mortgages and Loans', 'Retail Banking'];
const sentiments = ['Negative', 'Neutral'];
const statuses = ['Pending', 'In Progress', 'Resolved'];

for (let i = 0; i < 43; i++) {
  const isUrgent = Math.random() > 0.75;
  const isResolved = Math.random() > 0.6;
  const cat = categories[Math.floor(Math.random() * categories.length)];
  const sent = isUrgent ? 'Negative' : sentiments[Math.floor(Math.random() * sentiments.length)];
  const stat = isResolved ? 'Resolved' : statuses[Math.floor(Math.random() * 2)];
  
  const subDate = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)); // random within last 30 days
  
  mockComplaints.push({
    complaint_text: `This is a generated mock complaint regarding ${cat}. The user is expressing ${sent} sentiment. ` + 
                    `They have provided additional details about their experience with the financial institution and are hoping for a resolution.`,
    category: cat,
    sentiment: sent,
    sentiment_code: sent === 'Negative' ? 0 : 1,
    priority: isUrgent ? "Urgent" : "Not Urgent",
    priority_code: isUrgent ? 1 : 0,
    status: stat,
    submittedAt: subDate,
    resolvedAt: stat === 'Resolved' ? new Date(subDate.getTime() + 1000 * 60 * 60 * 48) : null
  });
}

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/complaint_mgt';
    console.log(`Connecting to ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected.');

    console.log('Clearing old complaints...');
    await Complaint.deleteMany({});
    
    console.log(`Inserting ${mockComplaints.length} mock complaints...`);
    await Complaint.insertMany(mockComplaints);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
