@echo off
echo ========================================
echo    MEDIHUB Setup Script
echo ========================================
echo.

echo [1/3] Installing dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/3] Checking configuration...
if not exist .env (
    echo WARNING: .env file not found!
    echo Please configure backend\.env with your Firebase credentials
    echo See backend\.env.example for reference
)

echo.
echo [3/3] Setup complete!
echo.
echo ========================================
echo    Next Steps:
echo ========================================
echo 1. Configure backend\.env with Firebase credentials
echo 2. Run: npm run dev
echo 3. Visit: http://localhost:3000
echo.
echo See QUICKSTART.md for detailed instructions
echo ========================================
echo.
pause
