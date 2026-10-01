package com.golfstats.kafka.service;

import com.golfstats.kafka.dto.HoleScoringSummary;
import com.golfstats.kafka.repository.HoleRepository;
import com.golfstats.kafka.repository.RoundRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class CourseSummaryService {

    public enum HoleSortField {
        HOLE_NUMBER("holeNumber"),
        AVERAGE_TO_PAR("averageToPar");

        private final String paramValue;

        HoleSortField(String paramValue) {
            this.paramValue = paramValue;
        }

        public static Optional<HoleSortField> fromParam(String value) {
            for (HoleSortField field : values()) {
                if (field.paramValue.equalsIgnoreCase(value)) {
                    return Optional.of(field);
                }
            }
            return Optional.empty();
        }
    }

    private static final Comparator<HoleScoringSummary> BY_HOLE_NUMBER =
        Comparator.comparing(HoleScoringSummary::holeNumber, Comparator.nullsLast(Comparator.naturalOrder()))
            .thenComparing(HoleScoringSummary::par, Comparator.nullsLast(Comparator.naturalOrder()));

    private final RoundRepository roundRepository;
    private final HoleRepository holeRepository;

    public CourseSummaryService(RoundRepository roundRepository, HoleRepository holeRepository) {
        this.roundRepository = roundRepository;
        this.holeRepository = holeRepository;
    }

    @Transactional(readOnly = true)
    public List<String> getCourses() {
        return roundRepository.findDistinctCourses();
    }

    @Transactional(readOnly = true)
    public List<HoleScoringSummary> getHoleScoringSummary(String course,
                                                          HoleSortField sortBy,
                                                          Sort.Direction direction) {
        Comparator<HoleScoringSummary> comparator = switch (sortBy) {
            case HOLE_NUMBER -> BY_HOLE_NUMBER;
            case AVERAGE_TO_PAR -> Comparator.comparing(
                HoleScoringSummary::averageToPar, Comparator.nullsLast(Comparator.naturalOrder()));
        };
        if (direction == Sort.Direction.DESC) {
            comparator = comparator.reversed();
        }

        return holeRepository.findHoleScoringSummaryByCourse(course).stream()
            .sorted(comparator.thenComparing(BY_HOLE_NUMBER))
            .toList();
    }
}
