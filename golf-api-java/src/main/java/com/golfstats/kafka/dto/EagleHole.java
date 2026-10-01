package com.golfstats.kafka.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

/**
 * A single hole scored at eagle (two under par) or better.
 */
public record EagleHole(
    Long holeId,
    Long roundId,
    LocalDateTime dateInserted,
    String course,
    Integer holeNumber,
    Integer par,
    Integer score,
    Integer putts
) {

    private static final DateTimeFormatter ROUND_DATE_FORMAT =
        DateTimeFormatter.ofPattern("MMMM dd, yyyy", Locale.US);

    @JsonProperty("roundDate")
    public String roundDate() {
        return dateInserted == null ? null : dateInserted.format(ROUND_DATE_FORMAT);
    }
}
