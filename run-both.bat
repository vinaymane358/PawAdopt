@echo off
echo Starting Pet Adoption Application...
echo.

echo Starting Backend (Spring Boot) on port 9090...
start "Backend" cmd /k "cd springapp && mvn spring-boot:run"

echo Waiting 10 seconds for backend to start...
timeout /t 10 /nobreak > nul

echo Starting Frontend (Angular) on port 4200...
start "Frontend" cmd /k "cd app && npm start"

echo.
echo Both applications are starting...
echo Backend: http://localhost:9090
echo Frontend: http://localhost:4200
echo.
echo Press any key to exit...
pause > nul

