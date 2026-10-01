package com.golfstats.kafka.dto;

import com.golfstats.kafka.entity.Hole;
import com.golfstats.kafka.entity.Round;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

/**
 * A round with all of its holes, ordered by hole number.
 */
public record RoundDetail(
    Long roundId,
    String course,
    String teeType,
    Integer handicap,
    LocalDateTime dateInserted,
    Integer score,
    List<HoleDetail> holes
) {

    public record HoleDetail(
        Long holeId,
        Integer holeNumber,
        Integer par,
        Integer strokeIndex,
        Integer score,
        Integer putts,
        Integer netScore,
        Integer strokesTaken
    ) {
        static HoleDetail from(Hole hole) {
            return new HoleDetail(
                hole.getHoleId(),
                hole.getHoleNumber(),
                hole.getPar(),
                hole.getStrokeIndex(),
                hole.getScore(),
                hole.getPutts(),
                hole.getNetScore(),
                hole.getStrokesTaken()
            );
        }
    }

    public static RoundDetail from(Round round, List<Hole> holes) {
        return new RoundDetail(
            round.getRoundId(),
            round.getCourse(),
            round.getTeeType(),
            round.getHandicap(),
            round.getDateInserted(),
            round.getScore(),
            holes.stream()
                .sorted(Comparator.comparing(Hole::getHoleNumber, Comparator.nullsLast(Comparator.naturalOrder())))
                .map(HoleDetail::from)
                .toList()
        );
    }
}
