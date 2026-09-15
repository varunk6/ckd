import os
import sqlite3
import json
from datetime import datetime

DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(DB_DIR, "ckd_history.db")

def init_db():
    os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            age INTEGER,
            bp INTEGER,
            prediction TEXT NOT NULL,
            probability REAL NOT NULL,
            risk_level TEXT NOT NULL,
            features_json TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

def save_prediction(age, bp, prediction, probability, risk_level, features):
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute("""
        INSERT INTO predictions (timestamp, age, bp, prediction, probability, risk_level, features_json)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (now, int(age) if age is not None else 0, int(bp) if bp is not None else 0, prediction, float(probability), risk_level, json.dumps(features)))
    conn.commit()
    last_id = cursor.lastrowid
    conn.close()
    return last_id

def get_predictions(limit=100):
    init_db()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM predictions ORDER BY id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    results = [dict(row) for row in rows]
    conn.close()
    return results

def delete_prediction(prediction_id):
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM predictions WHERE id = ?", (prediction_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted

def clear_all_predictions():
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM predictions")
    deleted_count = cursor.rowcount
    conn.commit()
    conn.close()
    return deleted_count

def get_statistics():
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM predictions")
    total = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM predictions WHERE prediction = 'ckd'")
    ckd_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM predictions WHERE prediction = 'notckd'")
    notckd_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT AVG(age) FROM predictions WHERE age > 0")
    avg_age = cursor.fetchone()[0] or 0
    
    conn.close()
    return {
        "total_predictions": total,
        "ckd_predictions": ckd_count,
        "notckd_predictions": notckd_count,
        "average_patient_age": round(float(avg_age), 1)
    }
