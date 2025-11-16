#!/usr/bin/env python3
"""
Script to generate SQL INSERT statements from the CSV file.
This script reads the CSV and generates:
1. INSERT statements for unique rounds
2. INSERT statements for all holes
"""

import csv
from datetime import datetime

def escape_sql_string(value):
    """Escape single quotes in SQL strings"""
    if value is None:
        return 'NULL'
    return "'" + str(value).replace("'", "''") + "'"

def parse_datetime(datetime_str):
    """Parse ISO datetime string to MySQL DATETIME format"""
    if not datetime_str:
        return None
    try:
        # Parse: 2025-10-18T15:24:02.000000Z
        dt = datetime.fromisoformat(datetime_str.replace('Z', '+00:00'))
        return dt.strftime('%Y-%m-%d %H:%M:%S')
    except:
        return datetime_str

def main():
    csv_file = 'ScoreDump.csv'
    
    rounds_inserts = []
    holes_inserts = []
    seen_rounds = set()
    
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            # Extract round data
            round_id = row['Round Id'].strip()
            course = row['Course'].strip()
            tee_type = row['Tee Type'].strip()
            handicap = row['Handicap'].strip()
            
            # Only add unique rounds
            if round_id and round_id not in seen_rounds:
                seen_rounds.add(round_id)
                rounds_inserts.append(
                    f"INSERT INTO rounds (round_id, course, tee_type, handicap) VALUES "
                    f"({round_id}, {escape_sql_string(course)}, {escape_sql_string(tee_type)}, {handicap});"
                )
            
            # Extract hole data
            hole_number = row['Hole Number'].strip()
            par = row['Par'].strip()
            stroke_index = row['Stroke Index'].strip()
            score = row['Score'].strip()
            putts = row['Putts'].strip()
            net_score = row['Net Score'].strip()
            strokes_taken = row['Strokes Taken'].strip()
            date_inserted = parse_datetime(row['Date Inserted'].strip())
            
            # Build INSERT statement for holes
            holes_inserts.append(
                f"INSERT INTO holes (round_id, hole_number, par, stroke_index, score, putts, net_score, strokes_taken, date_inserted) VALUES "
                f"({round_id}, {hole_number}, {par}, {stroke_index}, {score}, {putts}, {net_score}, {strokes_taken}, {escape_sql_string(date_inserted)});"
            )
    
    # Write rounds INSERT statements
    with open('02_insert_rounds.sql', 'w', encoding='utf-8') as f:
        f.write("-- INSERT statements for rounds table\n")
        f.write("-- Generated from ScoreDump.csv\n\n")
        for insert in rounds_inserts:
            f.write(insert + '\n')
    
    # Write holes INSERT statements
    with open('03_insert_holes.sql', 'w', encoding='utf-8') as f:
        f.write("-- INSERT statements for holes table\n")
        f.write("-- Generated from ScoreDump.csv\n\n")
        for insert in holes_inserts:
            f.write(insert + '\n')
    
    print(f"Generated SQL files:")
    print(f"  - 02_insert_rounds.sql ({len(rounds_inserts)} rounds)")
    print(f"  - 03_insert_holes.sql ({len(holes_inserts)} holes)")

if __name__ == '__main__':
    main()

