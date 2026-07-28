import csv
import os
import random
from sqlalchemy.orm import Session
import models

def auto_seed_students(db: Session, csv_filename: str = "students_10000.csv"):
    """
    Checks if the students table is empty. If so, it auto-generates or 
    reads the CSV file and seeds 10,000 students internally on startup.
    """
    existing_count = db.query(models.Student).count()
    if existing_count > 0:
        print(f"Database already contains {existing_count} students. Skipping auto-seed.")
        return

    print("Database is empty. Initializing internal student seeding...")

    # If the CSV doesn't exist locally, generate it programmatically on the fly
    if not os.path.exists(csv_filename):
        print(f"'{csv_filename}' not found. Generating file internally...")
        first_names = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Diya", "Sanya", "Ananya", "Riya", "Rahul"]
        last_names = ["Sharma", "Verma", "Gupta", "Patel", "Iyer", "Reddy", "Mehta", "Singh", "Kumar", "Joshi"]
        grades = ["9th Grade", "10th Grade", "11th Grade", "12th Grade"]
        sections = ["A", "B", "C", "D"]
        statuses = ["COMPLETED", "PENDING_DUE", "DEFAULT_AGED"]

        with open(csv_filename, mode="w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["admission_number", "student_name", "grade", "section", "total_fee", "paid_amount", "due_amount", "late_fee", "status"])
            for i in range(1, 10001):
                total_fee = random.choice([12000.0, 15000.0, 18000.0])
                status = random.choices(statuses, weights=[50, 35, 15], k=1)[0]
                if status == "COMPLETED":
                    paid, due, late = total_fee, 0.0, 0.0
                elif status == "PENDING_DUE":
                    paid = round(total_fee * 0.5, 2)
                    due = round(total_fee - paid, 2)
                    late = 0.0
                else:
                    paid = round(total_fee * 0.2, 2)
                    due = round(total_fee - paid, 2)
                    late = 500.0

                writer.writerow([
                    f"ADM-2026-{i:05d}",
                    f"{random.choice(first_names)} {random.choice(last_names)}",
                    random.choice(grades),
                    random.choice(sections),
                    total_fee, paid, due, late, status
                ])

    # Bulk read and insert into database safely in chunks
    batch = []
    with open(csv_filename, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            batch.append({
                "admission_number": row["admission_number"],
                "name": row["student_name"],
                "grade": row["grade"],
                "section": row["section"],
                "total_fee": float(row["total_fee"]),
                "paid_amount": float(row["paid_amount"]),
                "due_amount": float(row["due_amount"]),
                "late_fee": float(row["late_fee"]),
                "status": row["status"]
            })
            if len(batch) >= 1000:
                db.bulk_insert_mappings(models.Student, batch)
                db.commit()
                batch = []

        if batch:
            db.bulk_insert_mappings(models.Student, batch)
            db.commit()

    print("Successfully auto-seeded 10,000 student records into PostgreSQL database on startup!")