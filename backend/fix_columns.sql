-- Fix gender column size issue
ALTER TABLE users MODIFY COLUMN gender VARCHAR(10);
ALTER TABLE users MODIFY COLUMN email VARCHAR(255);
ALTER TABLE users MODIFY COLUMN password VARCHAR(255);

-- Verify the changes
SHOW COLUMNS FROM users;
