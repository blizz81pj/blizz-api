package com.golfstats.kafka.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "holes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hole {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hole_id")
    private Long holeId;
    
    @Column(name = "round_id", nullable = false)
    private Long roundId;
    
    @Column(name = "hole_number", nullable = false)
    private Integer holeNumber;
    
    @Column(name = "par", nullable = false)
    private Integer par;
    
    @Column(name = "stroke_index", nullable = false)
    private Integer strokeIndex;
    
    @Column(name = "score", nullable = false)
    private Integer score;
    
    @Column(name = "putts", nullable = false)
    private Integer putts;
    
    @Column(name = "net_score", nullable = false)
    private Integer netScore;
    
    @Column(name = "strokes_taken", nullable = false)
    private Integer strokesTaken;
    
    @Column(name = "date_inserted", nullable = false)
    private LocalDateTime dateInserted;
}

