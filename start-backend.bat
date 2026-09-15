@echo off
title CKD Predict - FastAPI Backend Server
echo Starting FastAPI Backend Server...
cd /d "%~dp0"
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
