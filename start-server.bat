@echo off
echo Starting React Development Server...
echo.
echo Setting environment variables...
set PORT=3000
set HOST=0.0.0.0
set BROWSER=none

echo.
echo Starting server on http://localhost:3000
echo.

npm start

pause
