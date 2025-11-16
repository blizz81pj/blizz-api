package com.golfstats.kafka.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "rounds")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Round {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "round_id")
    private Long roundId;
    
    @Column(name = "course", nullable = false)
    private String course;
    
    @Column(name = "tee_type", nullable = false)
    private String teeType;
    
    @Column(name = "handicap", nullable = false)
    private Integer handicap;
    
    @Column(name = "date_inserted", nullable = false)
    private LocalDateTime dateInserted;
    
    @Column(name = "score", nullable = false)
    private Integer score;
}

