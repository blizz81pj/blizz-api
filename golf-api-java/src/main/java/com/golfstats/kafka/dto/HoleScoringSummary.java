package com.golfstats.kafka.dto;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Scoring summary for a single hole on a course, aggregated across all rounds played there.
 */
public record HoleScoringSummary(
    Integer holeNumber,
    Integer par,
    Long timesPlayed,
    Double averageScore,
    Double averageToPar,
    Double averagePutts,
    Long eagles,
    Long birdies,
    Long pars,
    Long bogeys,
    Long doubleBogeys,
    Long tripleOrMore
) {

    /**
     * Constructor used by the JPQL projection; derives averageToPar and rounds averages to 2 places.
     */
    public HoleScoringSummary(
            Integer holeNumber,
            Integer par,
            Long timesPlayed,
            Double averageScore,
            Double averagePutts,
            Long eagles,
            Long birdies,
            Long pars,
            Long bogeys,
            Long doubleBogeys,
            Long tripleOrMore) {
        this(
            holeNumber,
            par,
            timesPlayed,
            round(averageScore),
            averageScore == null || par == null ? null : round(averageScore - par),
            round(averagePutts),
            eagles,
            birdies,
            pars,
            bogeys,
            doubleBogeys,
            tripleOrMore
        );
    }

    private static Double round(Double value) {
        return value == null ? null : BigDecimal.valueOf(value).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}
