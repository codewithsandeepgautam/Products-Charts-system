📊 Product Analytics Dashboard

A Full Stack Interactive Product Analytics Dashboard built using the MERN Stack.
This dashboard helps product managers understand how users interact with product features using visual analytics.

One unique aspect of this project is that the dashboard tracks its own usage.
Whenever a user interacts with charts or filters, that interaction is recorded and later displayed in analytics charts.

🚀 Features
🔐 Authentication

User Registration

User Login

Password Hashing (Secure storage)

JWT Based Authentication

Protected APIs

📊 Dashboard Features
Charts
1️⃣ Total Clicks (Bar Chart)

Displays how many times each feature was used.

Examples of features:

date_picker

filter_age

filter_gender

chart_bar

2️⃣ Clicks Daily (Line Chart)

Shows feature usage trends over time so product managers can analyze engagement patterns.

🎯 Filters

Users can filter analytics data based on:

📅 Date Range

👤 Age Group

🚻 Gender

These filters help in analyzing specific user segments.

🔍 Self Tracking System

Every dashboard interaction is automatically recorded.

Examples of tracked events:

Feature	Description
date_picker	User changes date filter
filter_age	User selects age group
filter_gender	User filters by gender
chart_bar	User interacts with bar chart

These interactions are stored in the database and used to generate analytics.

🛠 Tech Stack
Frontend

React

Chart.js / Recharts

Axios

CSS / Tailwind

Backend

Node.js

Express.js

JWT Authentication

Database

MongoDB

🗄 Database Models
User Model
Field	Type
id	ObjectId
username	String
password	String (hashed)
age	Number
gender	String
Feature Click Model
Field	Type
id	ObjectId
user_id	ObjectId
feature_name	String
timestamp	Date
🔗 API Endpoints
Authentication APIs
Register

POST /register

Creates a new user account.

Request Body

{
  "username": "john",
  "password": "123456",
  "age": 25,
  "gender": "Male"
}
Login

POST /login

Returns JWT Token.

{
 "username":"john",
 "password":"123456"
}
📡 Tracking API
Track User Interaction

POST /track

Records a feature click.

{
 "feature_name":"date_picker"
}
📈 Analytics API
Get Analytics Data

GET /analytics

Supported Filters:

startDate

endDate

ageGroup

gender

feature

Example:

/analytics?gender=Male&ageGroup=18-40

Response:

{
  "barData":[
    { "featureName":"date_picker","count":210 },
    { "featureName":"filter_age","count":180 }
  ],
  "lineData":[
    { "date":"2024-01-09","count":15 },
    { "date":"2024-01-10","count":18 }
  ]
}
📂 Project Structure
project
│
├── backend
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── controllers
│   └── server.js
│
├── frontend
│   ├── components
│   ├── pages
│   └── services
│
└── README.md
⚙️ Installation
1️⃣ Clone Repository
git clone <repo-url>
cd analytics-dashboard
2️⃣ Install Backend Dependencies
cd backend
npm install
3️⃣ Install Frontend Dependencies
cd frontend
npm install
🔑 Environment Variables

Create a .env file inside the backend folder.

PORT=5000
MONGO_URI=mongodb://103.81.159.114:30061/analytics_dashboard
JWT_SECRET=my_super_secret_key_change_in_production
▶️ Run the Project
Start Backend
npm run dev
Start Frontend
npm start
🌱 Seed Data

To populate initial analytics data:

node seed.js

This ensures charts are not empty when the dashboard loads.

🌍 Deployment
Frontend

Deploy on:

Netlify

Backend

Deploy on:

Render

Database

MongoDB Atlas

If this dashboard needed to handle 1 million write-events per minute, I would redesign the backend to use a scalable event-driven architecture. Instead of writing events directly to the database, the backend would send events to a message queue system like Kafka or RabbitMQ. This would allow multiple worker services to process events asynchronously and store them in the database without overloading the server. I would also use database sharding, caching (Redis), and load balancing to distribute traffic across multiple servers. This architecture would improve performance, reliability, and scalability when handling very high traffic.

👨‍💻 Author
Sandeep Gautam
Full Stack Developer
