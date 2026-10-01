package com.golfstats.kafka.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

/**
 * Per-round scoring summary aggregated from the holes table.
 */
public record RoundSummary(
    Long roundId,
    LocalDateTime dateInserted,
    String course,
    String teeType,
    Integer score,
    Long frontNine,
    Long backNine,
    Long putts,
    Long eagles,
    Long birdies,
    Long pars,
    Long bogeys,
    Long doubleBogeys,
    Long tripleOrMore
) {

    private static final DateTimeFormatter ROUND_DATE_FORMAT =
        DateTimeFormatter.ofPattern("MMMM dd, yyyy", Locale.US);

    @JsonProperty("roundDate")
    public String roundDate() {
        return dateInserted == null ? null : dateInserted.format(ROUND_DATE_FORMAT);
    }
}
