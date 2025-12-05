@echo off
echo ====================================
echo Diabetes System - Login Debug Test
echo ====================================
echo.

REM Test 1: Check if backend is running
echo [1/4] Checking if backend is running on port 8080...
powershell -Command "$test = Test-NetConnection -ComputerName localhost -Port 8080 -WarningAction SilentlyContinue; if ($test.TcpTestSucceeded) { Write-Host 'Backend is RUNNING' -ForegroundColor Green } else { Write-Host 'Backend is NOT RUNNING! Start it first.' -ForegroundColor Red; exit 1 }"
if errorlevel 1 goto :end
echo.

REM Test 2: Test Signup
echo [2/4] Testing SIGNUP endpoint...
curl -X POST http://localhost:8080/api/auth/signup ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Debug User\",\"email\":\"debug@test.com\",\"password\":\"test123\",\"age\":25,\"gender\":\"M\"}" ^
  -w "\nHTTP Status: %%{http_code}\n" ^
  -s -o signup_response.txt
echo Response saved to signup_response.txt
type signup_response.txt
echo.

REM Test 3: Test Login
echo [3/4] Testing LOGIN endpoint with same credentials...
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"debug@test.com\",\"password\":\"test123\"}" ^
  -w "\nHTTP Status: %%{http_code}\n" ^
  -s -o login_response.txt
echo Response saved to login_response.txt
type login_response.txt
echo.

REM Test 4: Summary
echo [4/4] Test Summary
echo ====================================
echo If signup worked but login failed:
echo   - Password encoding issue (BCrypt mismatch)
echo   - Database not saving properly
echo   - Email case sensitivity issue
echo.
echo If both failed:
echo   - Backend not running correctly
echo   - Database connection issue
echo   - CORS or security config issue
echo.
echo Check the response files for detailed errors.
echo ====================================

:end
pause
