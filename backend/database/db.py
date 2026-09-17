import os
import sqlite3
import json
from datetime import datetime

def get_db_path():
    if os.environ.get("VERCEL") or not os.access(os.path.dirname(os.path.abspath(__file__)), os.W_OK):
        d_dir = "/tmp"
    else:
        d_dir = os.path.dirname(os.path.abspath(__file__))
    os.makedirs(d_dir, exist_ok=True)
    return os.path.join(d_dir, "ckd_history.db")

def init_db():
    db_path = get_db_path()
    conn = sqlite3.connect(db_path)
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
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS blood_pressure (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            systolic INTEGER NOT NULL,
            diastolic INTEGER NOT NULL,
            pulse INTEGER,
            date TEXT NOT NULL,
            time TEXT NOT NULL
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS lab_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            test_date TEXT NOT NULL,
            sc REAL,
            bu REAL,
            egfr REAL,
            hemo REAL,
            sod REAL,
            pot REAL,
            bgr REAL,
            al INTEGER,
            protein TEXT,
            rbc TEXT,
            wbc REAL
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS wearable_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            log_date TEXT NOT NULL,
            steps INTEGER,
            active_minutes INTEGER,
            calories INTEGER,
            sedentary_alerts INTEGER,
            heart_rate INTEGER,
            min_hr INTEGER,
            max_hr INTEGER,
            hrv INTEGER,
            sleep_duration REAL,
            awake_duration REAL,
            sleep_score INTEGER,
            stress_level INTEGER
        )
    """)
    conn.commit()
    conn.close()

def save_prediction(age, bp, prediction, probability, risk_level, features):
    init_db()
    conn = sqlite3.connect(get_db_path())
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
    conn = sqlite3.connect(get_db_path())
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM predictions ORDER BY id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    results = [dict(row) for row in rows]
    conn.close()
    return results

def delete_prediction(prediction_id):
    init_db()
    conn = sqlite3.connect(get_db_path())
    cursor = conn.cursor()
    cursor.execute("DELETE FROM predictions WHERE id = ?", (prediction_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted

def clear_all_predictions():
    init_db()
    conn = sqlite3.connect(get_db_path())
    cursor = conn.cursor()
    cursor.execute("DELETE FROM predictions")
    deleted_count = cursor.rowcount
    conn.commit()
    conn.close()
    return deleted_count

# Blood Pressure CRUD
def save_bp_reading(systolic, diastolic, pulse=None, date=None, time=None):
    init_db()
    conn = sqlite3.connect(get_db_path())
    cursor = conn.cursor()
    now = datetime.now()
    date_str = date if date else now.strftime("%Y-%m-%d")
    time_str = time if time else now.strftime("%H:%M")
    timestamp_str = f"{date_str} {time_str}"
    cursor.execute("""
        INSERT INTO blood_pressure (timestamp, systolic, diastolic, pulse, date, time)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (timestamp_str, int(systolic), int(diastolic), int(pulse) if pulse is not None else None, date_str, time_str))
    conn.commit()
    last_id = cursor.lastrowid
    conn.close()
    return last_id

def get_bp_readings(limit=100):
    init_db()
    conn = sqlite3.connect(get_db_path())
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM blood_pressure ORDER BY date DESC, time DESC, id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    results = [dict(row) for row in rows]
    conn.close()
    return results

def delete_bp_reading(bp_id):
    init_db()
    conn = sqlite3.connect(get_db_path())
    cursor = conn.cursor()
    cursor.execute("DELETE FROM blood_pressure WHERE id = ?", (bp_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted

# Lab Results CRUD
def save_lab_result(test_date, sc=None, bu=None, egfr=None, hemo=None, sod=None, pot=None, bgr=None, al=None, protein=None, rbc=None, wbc=None):
    init_db()
    conn = sqlite3.connect(get_db_path())
    cursor = conn.cursor()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute("""
        INSERT INTO lab_results (timestamp, test_date, sc, bu, egfr, hemo, sod, pot, bgr, al, protein, rbc, wbc)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        now_str, test_date,
        float(sc) if sc is not None else None,
        float(bu) if bu is not None else None,
        float(egfr) if egfr is not None else None,
        float(hemo) if hemo is not None else None,
        float(sod) if sod is not None else None,
        float(pot) if pot is not None else None,
        float(bgr) if bgr is not None else None,
        int(al) if al is not None else None,
        str(protein) if protein else None,
        str(rbc) if rbc else None,
        float(wbc) if wbc is not None else None
    ))
    conn.commit()
    last_id = cursor.lastrowid
    conn.close()
    return last_id

def get_lab_results(limit=100):
    init_db()
    conn = sqlite3.connect(get_db_path())
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM lab_results ORDER BY test_date DESC, id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    results = [dict(row) for row in rows]
    conn.close()
    return results

def delete_lab_result(lab_id):
    init_db()
    conn = sqlite3.connect(get_db_path())
    cursor = conn.cursor()
    cursor.execute("DELETE FROM lab_results WHERE id = ?", (lab_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted

# Wearable Logs CRUD
def save_wearable_log(log_date, steps=None, active_minutes=None, calories=None, sedentary_alerts=None, heart_rate=None, min_hr=None, max_hr=None, hrv=None, sleep_duration=None, awake_duration=None, sleep_score=None, stress_level=None):
    init_db()
    conn = sqlite3.connect(get_db_path())
    cursor = conn.cursor()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute("""
        INSERT INTO wearable_logs (timestamp, log_date, steps, active_minutes, calories, sedentary_alerts, heart_rate, min_hr, max_hr, hrv, sleep_duration, awake_duration, sleep_score, stress_level)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        now_str, log_date,
        int(steps) if steps is not None else None,
        int(active_minutes) if active_minutes is not None else None,
        int(calories) if calories is not None else None,
        int(sedentary_alerts) if sedentary_alerts is not None else None,
        int(heart_rate) if heart_rate is not None else None,
        int(min_hr) if min_hr is not None else None,
        int(max_hr) if max_hr is not None else None,
        int(hrv) if hrv is not None else None,
        float(sleep_duration) if sleep_duration is not None else None,
        float(awake_duration) if awake_duration is not None else None,
        int(sleep_score) if sleep_score is not None else None,
        int(stress_level) if stress_level is not None else None
    ))
    conn.commit()
    last_id = cursor.lastrowid
    conn.close()
    return last_id

def get_wearable_logs(limit=100):
    init_db()
    conn = sqlite3.connect(get_db_path())
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM wearable_logs ORDER BY log_date DESC, id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    results = [dict(row) for row in rows]
    conn.close()
    return results

def delete_wearable_log(log_id):
    init_db()
    conn = sqlite3.connect(get_db_path())
    cursor = conn.cursor()
    cursor.execute("DELETE FROM wearable_logs WHERE id = ?", (log_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted

def get_health_summary():
    init_db()
    bp_list = get_bp_readings(limit=1)
    lab_list = get_lab_results(limit=1)
    wearable_list = get_wearable_logs(limit=1)
    pred_list = get_predictions(limit=1)
    
    return {
        "latest_bp": bp_list[0] if bp_list else None,
        "latest_lab": lab_list[0] if lab_list else None,
        "latest_wearable": wearable_list[0] if wearable_list else None,
        "latest_prediction": pred_list[0] if pred_list else None,
    }

def get_statistics():
    init_db()
    conn = sqlite3.connect(get_db_path())
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

