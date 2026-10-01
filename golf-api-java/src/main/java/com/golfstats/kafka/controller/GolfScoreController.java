package com.golfstats.kafka.controller;

import com.golfstats.kafka.dto.EagleHole;
import com.golfstats.kafka.dto.HoleScoringSummary;
import com.golfstats.kafka.dto.PagedResponse;
import com.golfstats.kafka.dto.RoundDetail;
import com.golfstats.kafka.dto.RoundSummary;
import com.golfstats.kafka.dto.RoundUpdateRequest;
import com.golfstats.kafka.dto.TopRound;
import com.golfstats.kafka.model.GolfScoreEvent;
import com.golfstats.kafka.service.CourseSummaryService;
import com.golfstats.kafka.service.CourseSummaryService.HoleSortField;
import com.golfstats.kafka.service.GolfScoreProducerService;
import com.golfstats.kafka.service.HallOfFameService;
import com.golfstats.kafka.service.RoundDetailService;
import com.golfstats.kafka.service.RoundSummaryService;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/golf-scores")
public class GolfScoreController {

    private static final int MAX_PAGE_SIZE = 100;
    
    private final GolfScoreProducerService producerService;
    private final RoundSummaryService roundSummaryService;
    private final CourseSummaryService courseSummaryService;
    private final RoundDetailService roundDetailService;
    private final HallOfFameService hallOfFameService;
    
    public GolfScoreController(GolfScoreProducerService producerService,
                               RoundSummaryService roundSummaryService,
                               CourseSummaryService courseSummaryService,
                               RoundDetailService roundDetailService,
                               HallOfFameService hallOfFameService) {
        this.producerService = producerService;
        this.roundSummaryService = roundSummaryService;
        this.courseSummaryService = courseSummaryService;
        this.roundDetailService = roundDetailService;
        this.hallOfFameService = hallOfFameService;
    }
    
    @PostMapping("/insert")
    public ResponseEntity<String> insertGolfScores(@RequestBody List<GolfScoreEvent> events) {
        try {
            if (events == null || events.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body("Request body must contain at least one golf score event");
            }
            
            producerService.sendGolfScoreEvents(events);
            
            return ResponseEntity.ok(
                String.format("Successfully sent %d golf score event(s) to Kafka topic", events.size())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error processing request: " + e.getMessage());
        }
    }

    /**
     * Paginated per-round summary (nines, putts and score-to-par counts).
     *
     * @param sortBy    "date", "score", "frontNine", "backNine" or "putts" (default "date")
     * @param sortOrder "asc" or "desc" (default "desc")
     * @param page      zero-based page index (default 0)
     * @param size      rounds per page, 1-100 (default 20)
     * @param course    optional exact course name, as returned by /courses
     * @param startDate optional first day to include (yyyy-MM-dd)
     * @param endDate   optional last day to include (yyyy-MM-dd)
     */
    @GetMapping("/rounds-summary")
    public ResponseEntity<?> getRoundsSummary(
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String course,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        RoundSummaryService.SortField sortField =
            RoundSummaryService.SortField.fromParam(sortBy).orElse(null);
        if (sortField == null) {
            return ResponseEntity.badRequest()
                .body("sortBy must be 'date', 'score', 'frontNine', 'backNine' or 'putts'");
        }
        Sort.Direction direction = Sort.Direction.fromOptionalString(sortOrder).orElse(null);
        if (direction == null) {
            return ResponseEntity.badRequest().body("sortOrder must be 'asc' or 'desc'");
        }
        if (page < 0) {
            return ResponseEntity.badRequest().body("page must be 0 or greater");
        }
        if (size < 1 || size > MAX_PAGE_SIZE) {
            return ResponseEntity.badRequest()
                .body("size must be between 1 and " + MAX_PAGE_SIZE);
        }
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            return ResponseEntity.badRequest().body("startDate must be on or before endDate");
        }

        String courseFilter = course == null || course.isBlank() ? null : course;
        PagedResponse<RoundSummary> summary = roundSummaryService.getRoundsSummary(
            sortField, direction, page, size, courseFilter, startDate, endDate);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/courses")
    public List<String> getCourses() {
        return courseSummaryService.getCourses();
    }

    /**
     * Per-hole scoring summary (average vs par, putts, score-to-par counts) for one course.
     *
     * @param course    exact course name, as returned by /courses
     * @param sortBy    "holeNumber" or "averageToPar" (default "holeNumber")
     * @param sortOrder "asc" or "desc" (default "asc")
     */
    @GetMapping("/course-hole-summary")
    public ResponseEntity<?> getCourseHoleSummary(
            @RequestParam String course,
            @RequestParam(defaultValue = "holeNumber") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder) {
        HoleSortField sortField = HoleSortField.fromParam(sortBy).orElse(null);
        if (sortField == null) {
            return ResponseEntity.badRequest().body("sortBy must be 'holeNumber' or 'averageToPar'");
        }
        Sort.Direction direction = Sort.Direction.fromOptionalString(sortOrder).orElse(null);
        if (direction == null) {
            return ResponseEntity.badRequest().body("sortOrder must be 'asc' or 'desc'");
        }

        List<HoleScoringSummary> holes =
            courseSummaryService.getHoleScoringSummary(course, sortField, direction);
        return ResponseEntity.ok(holes);
    }

    @GetMapping("/rounds/{roundId}")
    public ResponseEntity<RoundDetail> getRound(@PathVariable Long roundId) {
        return ResponseEntity.of(roundDetailService.getRoundDetail(roundId));
    }

    /**
     * Updates a round and its existing holes directly (not via Kafka); the round score is
     * recalculated from the hole scores.
     */
    @PutMapping("/rounds/{roundId}")
    public ResponseEntity<?> updateRound(@PathVariable Long roundId,
                                         @RequestBody RoundUpdateRequest request) {
        try {
            return roundDetailService.updateRound(roundId, request)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Round " + roundId + " not found"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /** Permanently deletes a round and its holes. */
    @DeleteMapping("/rounds/{roundId}")
    public ResponseEntity<?> deleteRound(@PathVariable Long roundId) {
        if (!roundDetailService.deleteRound(roundId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Round " + roundId + " not found");
        }
        return ResponseEntity.noContent().build();
    }

    /**
     * All-time best full 18-hole rounds by score relative to course par.
     *
     * @param limit number of rounds, 1-100 (default 10)
     */
    @GetMapping("/hall-of-fame/top-rounds")
    public ResponseEntity<?> getTopRounds(@RequestParam(defaultValue = "10") int limit) {
        if (limit < 1 || limit > MAX_PAGE_SIZE) {
            return ResponseEntity.badRequest()
                .body("limit must be between 1 and " + MAX_PAGE_SIZE);
        }
        List<TopRound> rounds = hallOfFameService.getTopRounds(limit);
        return ResponseEntity.ok(rounds);
    }

    /**
     * Paginated list of holes scored at eagle or better.
     *
     * @param sortOrder round date "asc" or "desc" (default "desc")
     * @param page      zero-based page index (default 0)
     * @param size      holes per page, 1-100 (default 20)
     */
    @GetMapping("/hall-of-fame/eagles")
    public ResponseEntity<?> getEagles(
            @RequestParam(defaultValue = "desc") String sortOrder,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Sort.Direction direction = Sort.Direction.fromOptionalString(sortOrder).orElse(null);
        if (direction == null) {
            return ResponseEntity.badRequest().body("sortOrder must be 'asc' or 'desc'");
        }
        if (page < 0) {
            return ResponseEntity.badRequest().body("page must be 0 or greater");
        }
        if (size < 1 || size > MAX_PAGE_SIZE) {
            return ResponseEntity.badRequest()
                .body("size must be between 1 and " + MAX_PAGE_SIZE);
        }
        PagedResponse<EagleHole> eagles = hallOfFameService.getEagles(direction, page, size);
        return ResponseEntity.ok(eagles);
    }
}
