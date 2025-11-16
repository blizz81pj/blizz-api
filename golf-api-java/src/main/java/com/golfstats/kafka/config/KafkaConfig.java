package com.golfstats.kafka.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {
    
    @Value("${golf.kafka.topic.insert-new}")
    private String topicName;
    
    /**
     * Creates the Kafka topic if it doesn't exist
     */
    @Bean
    public NewTopic golfScoresInsertNewTopic() {
        return TopicBuilder.name(topicName)
            .partitions(3)
            .replicas(1)
            .build();
    }
}

