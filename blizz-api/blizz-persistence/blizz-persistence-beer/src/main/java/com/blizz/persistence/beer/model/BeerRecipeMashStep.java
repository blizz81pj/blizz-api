package com.blizz.persistence.beer.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;

@Entity
public class BeerRecipeMashStep {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="beer_recipe_mash_step_id")
    @JsonProperty("beerRecipeMashStepId")
    private Integer id;

    @Column(nullable = false)
    @NotNull(message = "The field 'beerRecipeId' must be supplied")
    private Integer beerRecipeId;

    @Column(nullable = false)
    @Max(value = 1000, message = "The field 'temperature' cannot be larger than 1000")
    private Integer temperature;

    @Column(nullable = false)
    @Max(value = 100, message = "The field 'minutes' cannot be larger than 100")
    private Integer minutes;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getBeerRecipeId() {
        return beerRecipeId;
    }

    public void setBeerRecipeId(Integer beerRecipeId) {
        this.beerRecipeId = beerRecipeId;
    }

    public Integer getTemperature() {
        return temperature;
    }

    public void setTemperature(Integer temperature) {
        this.temperature = temperature;
    }

    public Integer getMinutes() {
        return minutes;
    }

    public void setMinutes(Integer minutes) {
        this.minutes = minutes;
    }
}
