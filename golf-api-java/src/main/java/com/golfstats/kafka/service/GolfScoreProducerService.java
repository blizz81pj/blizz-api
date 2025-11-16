package com.golfstats.kafka.service;

import com.golfstats.kafka.model.GolfScoreEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class GolfScoreProducerService {
    
    private static final Logger logger = LoggerFactory.getLogger(GolfScoreProducerService.class);
    
    private final KafkaTemplate<String, GolfScoreEvent> kafkaTemplate;
    
    @Value("${golf.kafka.topic.insert-new}")
    private String topicName;
    
    public GolfScoreProducerService(KafkaTemplate<String, GolfScoreEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }
    
    /**
     * Sends a single golf score event to Kafka topic
     */
    public void sendGolfScoreEvent(GolfScoreEvent event) {
        try {
            CompletableFuture<SendResult<String, GolfScoreEvent>> future = 
                kafkaTemplate.send(topicName, event);
            
            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    logger.info("Successfully sent golf score event to topic {}: roundId={}, holeNumber={}", 
                        topicName, event.getRoundId(), event.getHoleNumber());
                } else {
                    logger.error("Failed to send golf score event to topic {}: roundId={}, holeNumber={}", 
                        topicName, event.getRoundId(), event.getHoleNumber(), ex);
                }
            });
        } catch (Exception e) {
            logger.error("Error sending golf score event to Kafka", e);
            throw new RuntimeException("Failed to send event to Kafka", e);
        }
    }
    
    /**
     * Sends multiple golf score events to Kafka topic
     */
    public void sendGolfScoreEvents(List<GolfScoreEvent> events) {
        logger.info("Sending {} golf score events to topic {}", events.size(), topicName);
        for (GolfScoreEvent event : events) {
            sendGolfScoreEvent(event);
        }
    }
}

