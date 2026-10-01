package com.golfstats.kafka.service;

import com.golfstats.kafka.dto.EagleHole;
import com.golfstats.kafka.dto.PagedResponse;
import com.golfstats.kafka.dto.TopRound;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class HallOfFameService {

    /** Only rounds with all 18 holes recorded qualify; ties go to the earlier round. */
    private static final String TOP_ROUNDS =
        "SELECT new com.golfstats.kafka.dto.TopRound(" +
        "  r.roundId, r.dateInserted, r.course, r.teeType, SUM(h.par), r.score) " +
        "FROM Hole h JOIN Round r ON h.roundId = r.roundId " +
        "GROUP BY r.roundId, r.dateInserted, r.course, r.teeType, r.score " +
        "HAVING COUNT(DISTINCT h.holeNumber) = 18 " +
        "ORDER BY r.score - SUM(h.par) ASC, r.score ASC, r.dateInserted ASC, r.roundId ASC";

    /** A score of 0 means the hole wasn't played, so it isn't an eagle. */
    private static final String EAGLE_FILTER =
        "FROM Hole h JOIN Round r ON h.roundId = r.roundId " +
        "WHERE h.score > 0 AND h.score <= h.par - 2 ";

    private static final String EAGLES =
        "SELECT new com.golfstats.kafka.dto.EagleHole(" +
        "  h.holeId, r.roundId, r.dateInserted, r.course, h.holeNumber, h.par, h.score, h.putts) " +
        EAGLE_FILTER;

    private static final String EAGLE_COUNT = "SELECT COUNT(h) " + EAGLE_FILTER;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional(readOnly = true)
    public List<TopRound> getTopRounds(int limit) {
        return entityManager.createQuery(TOP_ROUNDS, TopRound.class)
            .setMaxResults(limit)
            .getResultList();
    }

    @Transactional(readOnly = true)
    public PagedResponse<EagleHole> getEagles(Sort.Direction direction, int page, int size) {
        String orderBy = "ORDER BY r.dateInserted " + direction.name() + ", h.holeNumber ASC, h.holeId ASC";
        List<EagleHole> content = entityManager.createQuery(EAGLES + orderBy, EagleHole.class)
            .setFirstResult(page * size)
            .setMaxResults(size)
            .getResultList();
        long total = entityManager.createQuery(EAGLE_COUNT, Long.class).getSingleResult();

        return PagedResponse.from(new PageImpl<>(content, PageRequest.of(page, size), total));
    }
}
