-- Script to modify rounds.round_id to AUTO_INCREMENT
-- This script safely handles the foreign key constraint from holes table
-- 
-- Usage: Run this script against your golf_stats database
-- Note: This script will temporarily drop and recreate the foreign key constraint

-- Step 1: Find and drop the foreign key constraint
-- MySQL auto-generates constraint names, so we need to find it first
SET @constraint_name = (
    SELECT CONSTRAINT_NAME
    FROM information_schema.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'holes'
      AND REFERENCED_TABLE_NAME = 'rounds'
      AND REFERENCED_COLUMN_NAME = 'round_id'
    LIMIT 1
);

-- Drop the foreign key constraint
-- Build the DROP statement dynamically
SET @drop_sql = CONCAT('ALTER TABLE holes DROP FOREIGN KEY ', @constraint_name);

PREPARE stmt FROM @drop_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 2: Modify the round_id column to AUTO_INCREMENT
ALTER TABLE rounds MODIFY round_id BIGINT AUTO_INCREMENT;

-- Step 3: Re-add the foreign key constraint with a named constraint
ALTER TABLE holes 
ADD CONSTRAINT fk_holes_round_id 
FOREIGN KEY (round_id) REFERENCES rounds(round_id);
