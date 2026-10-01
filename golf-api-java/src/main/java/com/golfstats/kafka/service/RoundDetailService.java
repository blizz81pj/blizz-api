package com.golfstats.kafka.service;

import com.golfstats.kafka.dto.RoundDetail;
import com.golfstats.kafka.dto.RoundUpdateRequest;
import com.golfstats.kafka.dto.RoundUpdateRequest.HoleUpdate;
import com.golfstats.kafka.entity.Hole;
import com.golfstats.kafka.entity.Round;
import com.golfstats.kafka.repository.HoleRepository;
import com.golfstats.kafka.repository.RoundRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class RoundDetailService {

    private final RoundRepository roundRepository;
    private final HoleRepository holeRepository;

    public RoundDetailService(RoundRepository roundRepository, HoleRepository holeRepository) {
        this.roundRepository = roundRepository;
        this.holeRepository = holeRepository;
    }

    @Transactional(readOnly = true)
    public Optional<RoundDetail> getRoundDetail(Long roundId) {
        return roundRepository.findById(roundId)
            .map(round -> RoundDetail.from(round, holeRepository.findByRoundId(roundId)));
    }

    /**
     * Applies edits to a round and its existing holes, then recalculates the round score.
     *
     * @return the updated round, or empty if the round does not exist
     * @throws IllegalArgumentException if the request is missing required values
     *                                  or references holes that are not part of the round
     */
    @Transactional
    public Optional<RoundDetail> updateRound(Long roundId, RoundUpdateRequest request) {
        Optional<Round> existing = roundRepository.findById(roundId);
        if (existing.isEmpty()) {
            return Optional.empty();
        }
        validate(request);

        Round round = existing.get();
        round.setCourse(request.course().trim());
        round.setTeeType(request.teeType().trim());
        round.setHandicap(request.handicap());
        round.setDateInserted(request.dateInserted());

        List<Hole> holes = holeRepository.findByRoundId(roundId);
        Map<Long, Hole> holesById = holes.stream()
            .collect(Collectors.toMap(Hole::getHoleId, Function.identity()));

        List<HoleUpdate> updates = request.holes() == null ? List.of() : request.holes();
        for (HoleUpdate update : updates) {
            Hole hole = holesById.get(update.holeId());
            if (hole == null) {
                throw new IllegalArgumentException(
                    "Hole " + update.holeId() + " does not belong to round " + roundId);
            }
            hole.setHoleNumber(update.holeNumber());
            hole.setPar(update.par());
            hole.setStrokeIndex(update.strokeIndex());
            hole.setScore(update.score());
            hole.setPutts(update.putts());
            hole.setNetScore(update.netScore());
            hole.setStrokesTaken(update.strokesTaken());
        }

        for (Hole hole : holes) {
            hole.setDateInserted(round.getDateInserted());
        }
        round.setScore(holes.stream().map(Hole::getScore).filter(Objects::nonNull).mapToInt(Integer::intValue).sum());

        holeRepository.saveAll(holes);
        roundRepository.save(round);
        return Optional.of(RoundDetail.from(round, holes));
    }

    /**
     * Permanently deletes a round and all of its holes.
     *
     * @return false if the round does not exist
     */
    @Transactional
    public boolean deleteRound(Long roundId) {
        if (!roundRepository.existsById(roundId)) {
            return false;
        }
        holeRepository.deleteByRoundId(roundId);
        roundRepository.deleteById(roundId);
        return true;
    }

    private static void validate(RoundUpdateRequest request) {
        List<String> missing = new ArrayList<>();
        if (isBlank(request.course())) missing.add("course");
        if (isBlank(request.teeType())) missing.add("teeType");
        if (request.handicap() == null) missing.add("handicap");
        if (request.dateInserted() == null) missing.add("dateInserted");

        if (request.holes() != null) {
            for (HoleUpdate hole : request.holes()) {
                String label = "hole " + (hole.holeNumber() != null ? hole.holeNumber() : hole.holeId());
                if (hole.holeId() == null) missing.add(label + " holeId");
                if (hole.holeNumber() == null) missing.add(label + " holeNumber");
                if (hole.par() == null) missing.add(label + " par");
                if (hole.strokeIndex() == null) missing.add(label + " strokeIndex");
                if (hole.score() == null) missing.add(label + " score");
                if (hole.putts() == null) missing.add(label + " putts");
                if (hole.netScore() == null) missing.add(label + " netScore");
                if (hole.strokesTaken() == null) missing.add(label + " strokesTaken");
            }
        }

        if (!missing.isEmpty()) {
            throw new IllegalArgumentException("Missing required values: " + String.join(", ", missing));
        }
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
