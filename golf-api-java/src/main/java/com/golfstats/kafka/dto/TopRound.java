package com.golfstats.kafka.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

/**
 * A full 18-hole round with its course par, for the Hall of Fame leaderboard.
 */
public record TopRound(
    Long roundId,
    LocalDateTime dateInserted,
    String course,
    String teeType,
    Long par,
    Integer score
) {

    private static final DateTimeFormatter ROUND_DATE_FORMAT =
        DateTimeFormatter.ofPattern("MMMM dd, yyyy", Locale.US);

    @JsonProperty("roundDate")
    public String roundDate() {
        return dateInserted == null ? null : dateInserted.format(ROUND_DATE_FORMAT);
    }

    @JsonProperty("toPar")
    public Long toPar() {
        return score == null || par == null ? null : score - par;
    }
}
