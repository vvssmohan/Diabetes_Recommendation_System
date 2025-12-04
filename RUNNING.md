# 🩺 DiabetesCare - System Running!

## ✅ Application Status

The full-stack Personalised Prescription Recommendation System is now **running and ready to use**!

### Running Services:
- ✅ **Backend**: Spring Boot (Java) running on `http://localhost:8080`
- ✅ **Frontend**: React + Vite running on `http://localhost:5173`
- ✅ **Database**: MySQL connected and initialized with all tables
- ✅ **API**: All endpoints configured and responding

---

## 🚀 Quick Start

### 1. Access the Application
Open your browser and go to: **http://localhost:5173**

You should see the **Login page** with a beautiful blue gradient background!

### 2. Create a New Account
- Click **"Sign up"** link at the bottom of the login card
- Fill in your details:
  - **Full Name**: Any name (e.g., "John Doe")
  - **Age**: Any number between 1-120
  - **Gender**: Select from dropdown
  - **Email**: Any email address (e.g., "test@example.com")
  - **Password**: Any password (min 6 characters)
- Click **"Sign Up"** button
- You'll be redirected to the **Dashboard**

### 3. Enter Health Data
On the Dashboard, fill in your health parameters:
- Height (cm)
- Weight (kg)
- Fasting Blood Sugar
- Post-meal Blood Sugar
- Blood Pressure
- Activity Level
- Family History of Diabetes

Click **"Analyze"** to submit.

### 4. View Results
You'll see:
- BMI calculation and gauge chart
- Diabetes risk level (Low/Pre-Diabetic/Diabetic)
- Obesity stage
- Risk score
- Personalized recommendations for:
  - Diet plan
  - Exercise routine
  - Lifestyle tips

---

## 🔧 Tech Stack

### Backend
- **Framework**: Spring Boot 2.7.5
- **Language**: Java 11+
- **Database**: MySQL 8.0
- **Security**: JWT (jjwt) + BCrypt
- **Port**: 8080

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 7
- **Styling**: Inline CSS (no Tailwind compilation issues)
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Port**: 5173

### Database
- **Host**: localhost
- **Port**: 3306
- **Database**: diabetes_db
- **User**: root
- **Password**: Mohan846688@

---

## 📁 Project Structure

```
d:\Javaproject/
├── backend/
│   ├── src/main/java/com/prescription/
│   │   ├── auth/                    # Authentication (JWT, BCrypt)
│   │   ├── health/                  # Health analysis APIs
│   │   ├── recommendations/         # Recommendations engine
│   │   └── config/                  # Security & CORS config
│   ├── target/
│   │   └── diabetes-prescription-backend-1.0.0.jar  # Built JAR
│   └── pom.xml                      # Maven dependencies
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx             # Login page (inline styles)
    │   │   ├── Signup.jsx            # Signup page (inline styles)
    │   │   ├── Dashboard.jsx         # Health input form
    │   │   └── Results.jsx           # Analysis results
    │   ├── App.jsx                   # Main app with routing
    │   ├── main.jsx                  # Entry point
    │   └── index.css                 # Global styles
    ├── package.json                  # npm dependencies
    ├── vite.config.js                # Vite configuration
    └── tailwind.config.js            # Tailwind config (not needed with inline styles)
```

---

## 🔐 Security Features

✅ **JWT Authentication**: Secure token-based login/signup  
✅ **BCrypt Hashing**: Passwords encrypted with BCrypt  
✅ **CORS Enabled**: Frontend can communicate with backend  
✅ **Session Management**: Stateless HTTP sessions  
✅ **Protected Routes**: Dashboard and Results pages require valid JWT token  

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
  ```json
  { "name": "John", "age": 30, "gender": "Male", "email": "john@example.com", "password": "pass123" }
  ```
- `POST /api/auth/login` - Login with email/password
  ```json
  { "email": "john@example.com", "password": "pass123" }
  ```

### Health Analysis
- `POST /api/health/analyze` - Analyze health data
  ```json
  { "height": 175, "weight": 85, "sugarFasting": 120, "sugarPost": 160, "bloodPressure": "130/90", "activityLevel": "Moderate", "familyHistory": "Yes" }
  ```

### Recommendations
- `POST /api/recommendations/generate` - Generate personalized recommendations
- `GET /api/recommendations/{userId}` - Get user's recommendations

---

## 🎨 UI Features

### Login Page
- Blue gradient background (Blue → Purple)
- Centered white card design
- Email & password fields with focus effects
- "Sign up" link for new users
- Error message display
- Loading state on button

### Signup Page
- Green gradient background (Green → Purple)
- Multi-field form (Name, Age, Gender, Email, Password)
- Grid layout for Age/Gender fields
- Input validation
- Same professional card design as login

### Dashboard Page
- Health parameter input form
- Real-time warning generation
- Color-coded alerts (Blue/Yellow/Red)
- Form submission with loading state

### Results Page
- BMI gauge chart (Recharts)
- Diabetes risk bar chart
- Risk level display (with icons)
- Personalized recommendations sections
- Medical disclaimer footer

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 8080 is in use
netstat -ano | findstr :8080

# Kill process using port 8080
taskkill /PID <PID> /F

# Rebuild and restart
cd d:\Javaproject\backend
mvn clean package -DskipTests
java -jar target/diabetes-prescription-backend-1.0.0.jar
```

### Frontend won't start
```bash
# Clear node_modules and reinstall
cd d:\Javaproject\frontend
Remove-Item -Recurse node_modules
npm install

# Start dev server
npm run dev
```

### MySQL connection fails
- Verify MySQL is running
- Check credentials in `application.properties`
- Ensure database `diabetes_db` exists
- Verify user `root` has proper permissions

---

## 📝 Test Credentials

You can create your own account through the signup page, or test with any email/password combination. The system will create a new user account when you sign up.

**Example Test Account:**
- Email: `demo@example.com`
- Password: `demo123`
- Name: Demo User
- Age: 35
- Gender: Male

---

## ✨ Key Features Implemented

✅ User authentication with JWT  
✅ Secure password hashing with BCrypt  
✅ Health data analysis (BMI, diabetes risk, obesity stage)  
✅ Real-time warning system  
✅ Personalized diet recommendations  
✅ Exercise plans based on risk level  
✅ Interactive charts and visualizations  
✅ Responsive design  
✅ Professional UI with gradients and cards  
✅ Protected routes (JWT-based access control)  

---

## 📞 Support

If you encounter any issues:

1. **Check the browser console** (F12) for error messages
2. **Check the backend logs** for server-side errors
3. **Verify both services are running**:
   - Backend: `java -jar target/diabetes-prescription-backend-1.0.0.jar`
   - Frontend: `npm run dev` (from frontend directory)

---

**Your Diabetes Care System is ready to help patients manage their health! 🎉**
