package com.golfstats.kafka.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Edits to an existing round and its holes. The round score is recalculated from the hole scores.
 */
public record RoundUpdateRequest(
    String course,
    String teeType,
    Integer handicap,
    LocalDateTime dateInserted,
    List<HoleUpdate> holes
) {

    public record HoleUpdate(
        Long holeId,
        Integer holeNumber,
        Integer par,
        Integer strokeIndex,
        Integer score,
        Integer putts,
        Integer netScore,
        Integer strokesTaken
    ) {
    }
}
