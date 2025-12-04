-- users table
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  age INT,
  gender ENUM('Male','Female','Other'),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);

-- health_data table
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

-- recommendations table
CREATE TABLE recommendations (
  rec_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  diet_plan TEXT,
  exercise_plan TEXT,
  lifestyle_tips TEXT,
  risk_score VARCHAR(20),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- alerts table (optional)
CREATE TABLE alerts (
  alert_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  alert_message TEXT,
  alert_level ENUM('Low','Medium','High'),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);