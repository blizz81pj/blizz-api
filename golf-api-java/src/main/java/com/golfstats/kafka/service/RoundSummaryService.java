package com.golfstats.kafka.service;

import com.golfstats.kafka.dto.PagedResponse;
import com.golfstats.kafka.dto.RoundSummary;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RoundSummaryService {

    private static final String FRONT_NINE = "SUM(CASE WHEN h.holeNumber BETWEEN 1 AND 9 THEN h.score END)";
    private static final String BACK_NINE = "SUM(CASE WHEN h.holeNumber BETWEEN 10 AND 18 THEN h.score END)";
    private static final String PUTTS = "SUM(h.putts)";

    /**
     * Optional filters: a null :course / :startAt / :endBefore means "no filter".
     * :endBefore is exclusive.
     */
    private static final String FILTERS =
        "WHERE (:course IS NULL OR r.course = :course) " +
        "AND (:startAt IS NULL OR r.dateInserted >= :startAt) " +
        "AND (:endBefore IS NULL OR r.dateInserted < :endBefore) ";

    private static final String SELECT =
        "SELECT new com.golfstats.kafka.dto.RoundSummary(" +
        "  r.roundId, r.dateInserted, r.course, r.teeType, r.score, " +
        "  " + FRONT_NINE + ", " + BACK_NINE + ", " + PUTTS + ", " +
        "  SUM(CASE WHEN h.score = h.par - 2 THEN 1 ELSE 0 END), " +
        "  SUM(CASE WHEN h.score = h.par - 1 THEN 1 ELSE 0 END), " +
        "  SUM(CASE WHEN h.score = h.par THEN 1 ELSE 0 END), " +
        "  SUM(CASE WHEN h.score = h.par + 1 THEN 1 ELSE 0 END), " +
        "  SUM(CASE WHEN h.score = h.par + 2 THEN 1 ELSE 0 END), " +
        "  SUM(CASE WHEN h.score > h.par + 2 THEN 1 ELSE 0 END)) " +
        "FROM Hole h JOIN Round r ON h.roundId = r.roundId " +
        FILTERS +
        "GROUP BY r.roundId, r.dateInserted, r.course, r.teeType, r.score ";

    private static final String COUNT =
        "SELECT COUNT(DISTINCT r.roundId) FROM Hole h JOIN Round r ON h.roundId = r.roundId " + FILTERS;

    /** Sortable columns; each maps a request value to a fixed JPQL expression. */
    public enum SortField {
        DATE("date", "r.dateInserted"),
        SCORE("score", "r.score"),
        FRONT_NINE("frontNine", RoundSummaryService.FRONT_NINE),
        BACK_NINE("backNine", RoundSummaryService.BACK_NINE),
        PUTTS("putts", RoundSummaryService.PUTTS);

        private final String paramValue;
        private final String expression;

        SortField(String paramValue, String expression) {
            this.paramValue = paramValue;
            this.expression = expression;
        }

        public static Optional<SortField> fromParam(String value) {
            for (SortField field : values()) {
                if (field.paramValue.equalsIgnoreCase(value)) {
                    return Optional.of(field);
                }
            }
            return Optional.empty();
        }
    }

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * @param course    exact course name, or null for all courses
     * @param startDate first day to include, or null for no lower bound
     * @param endDate   last day to include, or null for no upper bound
     */
    @Transactional(readOnly = true)
    public PagedResponse<RoundSummary> getRoundsSummary(SortField sortBy,
                                                        Sort.Direction direction,
                                                        int page,
                                                        int size,
                                                        String course,
                                                        LocalDate startDate,
                                                        LocalDate endDate) {
        LocalDateTime startAt = startDate == null ? null : startDate.atStartOfDay();
        LocalDateTime endBefore = endDate == null ? null : endDate.plusDays(1).atStartOfDay();

        // Rounds missing the sorted value (e.g. back nine on a 9-hole round) always sort last;
        // ties fall back to newest first.
        String orderBy = "ORDER BY " + sortBy.expression + " " + direction.name() + " NULLS LAST, " +
            "r.dateInserted DESC, r.roundId DESC";

        TypedQuery<RoundSummary> query = entityManager.createQuery(SELECT + orderBy, RoundSummary.class);
        setFilters(query, course, startAt, endBefore);
        query.setFirstResult(page * size);
        query.setMaxResults(size);
        List<RoundSummary> content = query.getResultList();

        Query countQuery = entityManager.createQuery(COUNT);
        setFilters(countQuery, course, startAt, endBefore);
        long total = ((Number) countQuery.getSingleResult()).longValue();

        return PagedResponse.from(new PageImpl<>(content, PageRequest.of(page, size), total));
    }

    private static void setFilters(Query query, String course, LocalDateTime startAt, LocalDateTime endBefore) {
        query.setParameter("course", course);
        query.setParameter("startAt", startAt);
        query.setParameter("endBefore", endBefore);
    }
}
