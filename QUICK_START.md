# Quick Start Guide - Diabetes Prescription System

## 🚀 Getting Started in 5 Minutes

### Prerequisites Check
- ✅ Java 11+ installed: `java -version`
- ✅ Maven installed: `mvn -version`
- ✅ Node.js 16+: `node --version`
- ✅ MySQL 8.0+ running: `mysql --version`

### Step 1: Setup MySQL Database

```bash
# Connect to MySQL
mysql -u root -p

# Run in MySQL shell
CREATE DATABASE diabetes_db;
USE diabetes_db;
SOURCE backend/src/main/resources/db/schema.sql;
EXIT;
```

### Step 2: Start Backend

```bash
cd backend
mvn spring-boot:run
```

✅ Backend will start at `http://localhost:8080`

### Step 3: Start Frontend (New Terminal)

```bash
cd frontend
npm install  # Only first time
npm run dev
```

✅ Frontend will start at `http://localhost:5173`

### Step 4: Test the Application

1. Open `http://localhost:5173` in your browser
2. Click "Sign up"
3. Fill in details and create account
4. Enter health parameters in dashboard
5. View analysis results with charts and recommendations

## 📋 Test Credentials (After First Signup)

```
Email: test@example.com
Password: test123
```

## 🔧 Configuration

### Database Connection (backend)
File: `backend/src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/diabetes_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
```

### Frontend API URL
File: `frontend/src/pages/*.jsx`

Default: `http://localhost:8080`

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| MySQL connection error | Ensure MySQL is running: `mysql -u root -p` |
| Port 8080 in use | Change in `application.properties`: `server.port=8081` |
| Port 5173 in use | Vite will auto-increment to 5174, 5175... |
| CORS errors | Check `SecurityConfig.java` allows `localhost:5173` |
| Charts not showing | Install Recharts: `npm install recharts` |

## 📚 API Examples

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Analyze Health
```bash
curl -X POST http://localhost:8080/api/health/analyze \
  -H "Content-Type: application/json" \
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

## 📱 Features to Try

✅ **Real-time Warnings** - Enter high blood sugar and see instant warning  
✅ **BMI Calculation** - Height + Weight auto-calculate BMI  
✅ **Color-coded Risk** - Green/Yellow/Red risk indicators  
✅ **Interactive Charts** - Hover over charts for details  
✅ **Personalized Recommendations** - Get diet & exercise plans  
✅ **Medical Disclaimer** - Important safety information  

## 🔐 Security Notes

- Never commit `.env` file with real credentials
- Change JWT secret in production
- Use HTTPS in production
- Keep MySQL password secure

## 📞 Support

For issues, check:
1. Backend logs: Terminal running `mvn spring-boot:run`
2. Frontend console: Browser DevTools (F12)
3. MySQL connection: `mysql -u root -p -e "USE diabetes_db; SHOW TABLES;"`

## 🎯 Next Steps

1. Deploy to cloud (AWS, Azure, Heroku)
2. Add doctor dashboard for patient review
3. Add notifications for critical values
4. Integrate with wearable devices
5. Add PDF report generation

---

**Happy coding! 🚀**
