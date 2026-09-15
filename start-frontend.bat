@echo off
title CKD Predict - Vite React Frontend
echo Starting Vite React Frontend Server...
cd /d "%~dp0"
start http://localhost:5173
npm run dev
