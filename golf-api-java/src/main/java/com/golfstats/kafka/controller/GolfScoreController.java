package com.golfstats.kafka.controller;

import com.golfstats.kafka.model.GolfScoreEvent;
import com.golfstats.kafka.service.GolfScoreProducerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/golf-scores")
public class GolfScoreController {
    
    private final GolfScoreProducerService producerService;
    
    public GolfScoreController(GolfScoreProducerService producerService) {
        this.producerService = producerService;
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
}

