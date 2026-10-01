package com.golfstats.kafka.repository;

import com.golfstats.kafka.entity.Round;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoundRepository extends JpaRepository<Round, Long> {
    
    /**
     * Find a round by its unique identifying fields (excluding the auto-generated round_id)
     */
    @Query("SELECT r FROM Round r WHERE r.course = :course AND r.teeType = :teeType " +
           "AND r.handicap = :handicap AND r.dateInserted = :dateInserted")
    Optional<Round> findByUniqueFields(
        @Param("course") String course,
        @Param("teeType") String teeType,
        @Param("handicap") Integer handicap,
        @Param("dateInserted") LocalDateTime dateInserted
    );

    @Query("SELECT DISTINCT r.course FROM Round r ORDER BY r.course")
    List<String> findDistinctCourses();
}
