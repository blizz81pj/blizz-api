package com.golfstats.kafka.repository;

import com.golfstats.kafka.dto.HoleScoringSummary;
import com.golfstats.kafka.entity.Hole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoleRepository extends JpaRepository<Hole, Long> {
    
    List<Hole> findByRoundId(Long roundId);
    
    @Query("SELECT SUM(h.score) FROM Hole h WHERE h.roundId = :roundId")
    Integer sumScoreByRoundId(@Param("roundId") Long roundId);

    @Modifying
    @Query("DELETE FROM Hole h WHERE h.roundId = :roundId")
    int deleteByRoundId(@Param("roundId") Long roundId);

    @Query("SELECT new com.golfstats.kafka.dto.HoleScoringSummary(" +
           "  h.holeNumber, h.par, COUNT(h), " +
           "  AVG(h.score), AVG(h.putts), " +
           "  SUM(CASE WHEN h.score = h.par - 2 THEN 1 ELSE 0 END), " +
           "  SUM(CASE WHEN h.score = h.par - 1 THEN 1 ELSE 0 END), " +
           "  SUM(CASE WHEN h.score = h.par THEN 1 ELSE 0 END), " +
           "  SUM(CASE WHEN h.score = h.par + 1 THEN 1 ELSE 0 END), " +
           "  SUM(CASE WHEN h.score = h.par + 2 THEN 1 ELSE 0 END), " +
           "  SUM(CASE WHEN h.score > h.par + 2 THEN 1 ELSE 0 END)) " +
           "FROM Hole h JOIN Round r ON h.roundId = r.roundId " +
           "WHERE r.course = :course " +
           "GROUP BY h.holeNumber, h.par " +
           "ORDER BY h.holeNumber, h.par")
    List<HoleScoringSummary> findHoleScoringSummaryByCourse(@Param("course") String course);
}
