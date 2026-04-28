# 🎟️ EventX — Event Management Platform (MERN)

A full-stack Event Management application where users can explore events, book tickets, and make secure payments using Razorpay.

---

## 🚀 Live Demo

* 🔗 Frontend:https://creative-zuccutto-44127f.netlify.app/
* 🔗 Backend: https://online-6fl3.onrender.com

---

## 🔐 Demo Credentials

### 👤 User

* Email: [vijay@gmail.com]
* Password: 123456

### 🎤 Organizer

* Email: [baskar06@gmail.com]
* Password: 123456

### 👑 Admin

* Email: [vijay@gmail.com]
* Password: 123456

---

## 🧭 How to Use

### 👤 User Flow

1. Login as **User**
2. Browse events
3. Apply filters (category, date, price)
4. Select event → choose ticket
5. Click **Book & Pay**
6. Complete Razorpay test payment
7. View tickets in **My Tickets**

---

### 🎤 Organizer Flow

1. Login as **Organizer**
2. Create new event
3. Add ticket types & schedule
4. Edit / delete events
5. View attendees list

---

### 👑 Admin Flow

1. Login as **Admin**
2. View all users
3. Approve/reject events
4. View transactions dashboard

---

## ✨ Features

### 👤 User

* Register & Login (JWT Authentication)
* Search & filter events
* Book tickets with Razorpay
* View bookings

### 🎤 Organizer

* Create & manage events
* Manage schedules
* View attendees

### 👑 Admin

* Manage users
* Manage events
* View transactions

---

## 💳 Payment Integration

* Razorpay (Test Mode)
* Order creation & verification
* Booking confirmation after payment

---

## 🛠️ Tech Stack

**Frontend:**

* React (Vite)
* Tailwind CSS
* Axios

**Backend:**

* Node.js
* Express.js
* MongoDB (Mongoose)

**Other Tools:**

* Razorpay
* JWT Authentication

---

## ⚙️ Environment Variables

### Frontend (.env)

```id="j3l8yt"
VITE_API_URL=https://online-6fl3.onrender.com
VITE_RAZORPAY_KEY_ID=your_key
```

### Backend (.env)

```id="l98a2k"
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
EMAIL_USER= your_email
EMAIL-PASS= your_app_pass
```

---

## 📌 Important Notes

* Events are visible without login
* Booking requires login
* If not logged in → user gets alert
* All protected routes use JWT authentication

---

## 📦 Installation (Local Setup)

### Backend

cd backend
npm install
npm run dev
```

### Frontend


cd frontend
npm install
npm run dev
```

---

## 📈 Future Improvements

* Better UI/UX
* Notifications system
* Advanced filters
* Mobile optimization

---

## 👨‍💻 Author

Vijaya Baskar

---

⭐ If you like this project, give it a star!
