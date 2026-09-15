@echo off
title CKD Predict - Fullstack Launch
echo Starting CKD Predict System (FastAPI Backend + React Frontend)...
cd /d "%~dp0"
start "CKD Backend" cmd /c start-backend.bat
timeout /t 3 /nobreak >nul
start "CKD Frontend" cmd /c start-frontend.bat
