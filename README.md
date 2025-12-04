# Diabetes Prescription Recommendation System

A full-stack web application for patients to enter diabetes-related health parameters, view risk levels, see charts, get warnings, and receive personalized food and lifestyle recommendations.

## Project Structure

```
Javaproject/
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/prescription/
│   │   ├── auth/                    # Authentication (Login/Signup)
│   │   ├── health/                  # Health Analysis
│   │   ├── recommendations/         # Recommendations
│   │   ├── config/                  # Security & CORS config
│   │   └── DiabetesPrescriptionBackendApplication.java
│   ├── src/main/resources/
│   │   ├── db/schema.sql           # Database schema
│   │   └── application.properties   # DB config
│   └── pom.xml                      # Maven dependencies
│
└── frontend/                         # React + Vite Frontend
    ├── src/pages/
    │   ├── Login.jsx                # Login page
    │   ├── Signup.jsx               # Signup page
    │   ├── Dashboard.jsx            # Health input form
    │   └── Results.jsx              # Analysis results & recommendations
    ├── src/components/              # Reusable components
    ├── src/App.jsx                  # Main app with routing
    ├── tailwind.config.js           # Tailwind CSS config
    ├── postcss.config.js            # PostCSS config
    └── package.json
```

## Features

### 🔐 Authentication
- User signup and login with JWT authentication
- Password hashing using BCrypt
- Secure token storage in localStorage
- Role-based access control

### 📊 Health Dashboard
- Enter diabetes-related health parameters:
  - Fasting and post-meal blood sugar
  - Height and weight (auto-calculate BMI)
  - Blood pressure
  - Activity level
  - Family history
- **Real-time warnings** for abnormal values
- Color-coded risk indicators (🟢 Low, 🟡 Medium, 🔴 High)

### 📈 Analysis Results Page
- **Diabetes Risk Assessment**
  - Low Risk (Fasting < 100, Post-Meal < 140)
  - Medium Risk / Pre-Diabetic (Fasting 100–125, Post-Meal 140–199)
  - High Risk / Diabetic (Fasting ≥ 126, Post-Meal ≥ 200)

- **Interactive Charts**
  - BMI Gauge Chart
  - Diabetes Risk Bar Chart
  - Blood Sugar Comparison

- **Personalized Recommendations**
  - 🍎 Diet Plan
  - 🏃 Exercise Recommendations
  - 💡 Lifestyle Tips

- **Health Warnings** - Displayed prominently
- **Medical Disclaimer** - Displayed at bottom

## Backend API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Health Analysis
- `POST /api/health/analyze` - Analyze health parameters and return risk assessment

### Recommendations
- `POST /api/recommendations/generate` - Generate personalized recommendations
- `GET /api/recommendations/{userId}` - Retrieve user recommendations

## Database Schema

### users
```sql
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  age INT,
  gender ENUM('Male','Female','Other'),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);
```

### health_data
```sql
CREATE TABLE health_data (
  record_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  bmi DOUBLE,
  sugar_fasting DOUBLE,
  sugar_post DOUBLE,
  blood_pressure VARCHAR(50),
  activity_level ENUM('Low','Moderate','High'),
  family_history ENUM('Yes','No'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### recommendations
```sql
CREATE TABLE recommendations (
  rec_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  diet_plan TEXT,
  exercise_plan TEXT,
  lifestyle_tips TEXT,
  risk_score VARCHAR(20),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

## Setup Instructions

### Prerequisites
- **Java 11+** and **Maven 3.6+**
- **Node.js 16+** and **npm 8+**
- **MySQL 8.0+** (or H2 for testing)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create MySQL database:
   ```sql
   CREATE DATABASE diabetes_db;
   ```

3. Update `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/diabetes_db?useSSL=false&serverTimezone=UTC
   spring.datasource.username=your_mysql_user
   spring.datasource.password=your_mysql_password
   ```

4. Run database schema:
   ```sql
   source src/main/resources/db/schema.sql
   ```

5. Build and run:
   ```bash
   mvn clean compile
   mvn spring-boot:run
   ```

   Backend will be available at `http://localhost:8080`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:5173`

## Testing the Application

### Example API Calls

#### Signup
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "age": 35,
    "gender": "Male",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Health Analysis
```bash
curl -X POST http://localhost:8080/api/health/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "user_id": 1,
    "height": 1.75,
    "weight": 85,
    "sugar_fasting": 130,
    "sugar_post": 210,
    "blood_pressure": "140/90",
    "activity_level": "Moderate",
    "family_history": "Yes"
  }'
```

#### Get Recommendations
```bash
curl -X GET http://localhost:8080/api/recommendations/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security Features

- ✅ JWT-based authentication
- ✅ BCrypt password hashing
- ✅ CORS configured for frontend access
- ✅ Row-level security (user-specific data only)
- ✅ Input validation and sanitization

## Tech Stack

### Backend
- **Spring Boot 2.7.5**
- **Spring Data JPA**
- **Spring Security**
- **JWT (jjwt)**
- **MySQL 8.0**
- **Maven**

### Frontend
- **React 18**
- **Vite 7**
- **Tailwind CSS**
- **Recharts** (Charts)
- **Material UI** (Components)
- **Axios** (HTTP Client)
- **React Router** (Navigation)

## Color Coding Risk Levels

- 🟢 **Green (Low Risk)**: Fasting < 100, Post-Meal < 140, BMI < 25, BP < 120/80
- 🟡 **Yellow (Medium Risk)**: Fasting 100–125, Post-Meal 140–199, BMI 25–29.9, BP 120–139 / 80–89
- 🔴 **Red (High Risk)**: Fasting ≥ 126, Post-Meal ≥ 200, BMI ≥ 30, BP ≥ 140/90

## Environment Variables (Backend)

Create a `.env` file or set in `application.properties`:

```properties
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/diabetes_db
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=password
JWT_SECRET=your_jwt_secret_key
```

## Deployment Notes

### Production Checklist

1. **HTTPS**: Deploy with SSL/TLS certificates
2. **Environment Variables**: Store sensitive data (JWT secret, DB credentials) in environment variables
3. **Database**: Use managed MySQL service (AWS RDS, Azure Database, etc.)
4. **CORS**: Update allowed origins in `SecurityConfig.java`
5. **JWT Secret**: Generate strong random secret key (do NOT use default)
6. **Monitoring**: Add logging and monitoring for production

### Docker Deployment (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: diabetes_db
      MYSQL_ROOT_PASSWORD: root
    ports:
      - "3306:3306"

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/diabetes_db
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: root

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
```

## Medical Disclaimer

⚠️ **Important**: This system provides general health guidance based on your inputs. It is **NOT a substitute for professional medical advice**. Always consult a doctor for accurate diagnosis and treatment.

## Support & Troubleshooting

- Backend not connecting to database? Check `application.properties` and MySQL service
- CORS errors? Verify `SecurityConfig.java` allows your frontend URL
- Charts not displaying? Ensure Recharts is installed: `npm install recharts`
- JWT errors? Regenerate token and ensure it's stored in localStorage

## License

This project is provided as-is for educational and health management purposes.

## Contributors

Built with ❤️ for diabetes awareness and management.
