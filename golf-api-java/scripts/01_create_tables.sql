-- Golf Stats Database Schema
-- This script creates the rounds and holes tables

DROP TABLE IF EXISTS holes;
DROP TABLE IF EXISTS rounds;

-- Rounds table: stores per-round data
CREATE TABLE rounds (
    round_id BIGINT PRIMARY KEY,
    course VARCHAR(255) NOT NULL,
    tee_type VARCHAR(50) NOT NULL,
    handicap INT NOT NULL,
    date_inserted DATETIME NOT NULL,
    INDEX idx_date_inserted (date_inserted)
);

-- Holes table: stores per-hole data
CREATE TABLE holes (
    hole_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    round_id BIGINT NOT NULL,
    hole_number INT NOT NULL,
    par INT NOT NULL,
    stroke_index INT NOT NULL,
    score INT NOT NULL,
    putts INT NOT NULL,
    net_score INT NOT NULL,
    strokes_taken INT NOT NULL,
    date_inserted DATETIME NOT NULL,
    FOREIGN KEY (round_id) REFERENCES rounds(round_id),
    INDEX idx_round_id (round_id),
    INDEX idx_hole_number (hole_number),
    INDEX idx_date_inserted (date_inserted)
);

