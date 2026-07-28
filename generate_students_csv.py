import csv
import random

# Sample data pools to generate realistic names and distributions
first_names = [
    "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
    "Diya", "Sanya", "Ananya", "Aadhya", "Pari", "Diya", "Riya", "Priya", "Neha", "Meera",
    "Rahul", "Amit", "Rohan", "Karan", "Vikas", "Pooja", "Sneha", "Anjali", "Kavita", "Pankaj"
]

last_names = [
    "Sharma", "Verma", "Gupta", "Patel", "Iyer", "Reddy", "Mehta", "Singh", "Kumar", "Choudhury",
    "Joshi", "Nair", "Deshmukh", "Pillai", "Bose", "Sen", "Das", "Rao", "Menon", "Malhotra"
]

grades = ["9th Grade", "10th Grade", "11th Grade", "12th Grade"]
sections = ["A", "B", "C", "D"]
statuses = ["COMPLETED", "PENDING_DUE", "DEFAULT_AGED"]

def generate_student_csv(filename="students_10000.csv", num_records=10000):
    print(f"Generating {num_records} student records...")
    
    with open(filename, mode="w", newline="", encoding="utf-8") as csv_file:
        writer = csv.writer(csv_file)
        
        # Write header matching your backend ingestion schema
        writer.writerow([
            "admission_number", 
            "student_name", 
            "grade", 
            "section", 
            "total_fee", 
            "paid_amount", 
            "due_amount", 
            "late_fee", 
            "status"
        ])
        
        for i in range(1, num_records + 1):
            adm_no = f"ADM-2026-{i:05d}"
            name = f"{random.choice(first_names)} {random.choice(last_names)}"
            grade = random.choice(grades)
            section = random.choice(sections)
            
            total_fee = random.choice([12000.0, 15000.0, 18000.0, 22000.0])
            status = random.choices(statuses, weights=[50, 35, 15], k=1)[0]
            
            if status == "COMPLETED":
                paid_amount = total_fee
                due_amount = 0.0
                late_fee = 0.0
            elif status == "PENDING_DUE":
                paid_amount = round(total_fee * random.uniform(0.2, 0.7), 2)
                due_amount = round(total_fee - paid_amount, 2)
                late_fee = 0.0
            else: # DEFAULT_AGED
                paid_amount = round(total_fee * random.uniform(0.0, 0.3), 2)
                due_amount = round(total_fee - paid_amount, 2)
                late_fee = round(random.choice([250.0, 500.0, 1000.0]), 2)

            writer.writerow([
                adm_no, 
                name, 
                grade, 
                section, 
                total_fee, 
                paid_amount, 
                due_amount, 
                late_fee, 
                status
            ])
            
    print(f"Successfully generated '{filename}' with {num_records} rows!")

if __name__ == "__main__":
    generate_student_csv()