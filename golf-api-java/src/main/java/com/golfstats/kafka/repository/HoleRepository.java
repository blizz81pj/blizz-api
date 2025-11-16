package com.golfstats.kafka.repository;

import com.golfstats.kafka.entity.Hole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoleRepository extends JpaRepository<Hole, Long> {
    
    List<Hole> findByRoundId(Long roundId);
    
    @Query("SELECT SUM(h.score) FROM Hole h WHERE h.roundId = :roundId")
    Integer sumScoreByRoundId(@Param("roundId") Long roundId);
}

