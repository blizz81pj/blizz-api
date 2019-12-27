package com.blizz.rest.controller;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.blizz")
@EnableJpaRepositories("com.blizz.persistence")
@EntityScan("com.blizz.persistence")
public class BlizzApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(BlizzApiApplication.class, args);
    }

}