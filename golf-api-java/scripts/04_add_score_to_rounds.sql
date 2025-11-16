-- Add score column to rounds table and populate with sum of hole scores
-- This script:
-- 1. Adds the score column to the rounds table
-- 2. Populates it with the sum of score values from the holes table grouped by round_id

-- Step 1: Add the score column (as nullable first to allow population)
ALTER TABLE rounds ADD COLUMN score INT NULL;

-- Step 2: Update the score column with the sum of scores from holes table
UPDATE rounds r
INNER JOIN (
    SELECT round_id, SUM(score) as total_score
    FROM holes
    GROUP BY round_id
) h ON r.round_id = h.round_id
SET r.score = h.total_score;

-- Step 3: Make the column NOT NULL now that all values are populated
ALTER TABLE rounds MODIFY COLUMN score INT NOT NULL;

