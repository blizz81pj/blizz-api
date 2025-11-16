package com.golfstats.kafka.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * POJO model class for golf score events.
 * JSON property names use camelCase format.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GolfScoreEvent {
    
    private Long roundId;
    
    private String course;
    
    private Long scorecardId;
    
    private String teeType;
    
    private String scorecardType;
    
    private String handicapType;
    
    private Integer handicap;
    
    private Long holeId;
    
    private Integer holeNumber;
    
    private Integer par;
    
    private Integer strokeIndex;
    
    private Integer score;
    
    private Integer putts;
    
    private String driveResult;
    
    private Integer penaltyStrokes;
    
    private String bunkerHit;
    
    private Integer netScore;
    
    private Integer strokesTaken;
    
    private LocalDateTime dateInserted;
}

