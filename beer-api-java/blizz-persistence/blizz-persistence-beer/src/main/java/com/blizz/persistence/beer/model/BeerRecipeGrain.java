package com.blizz.persistence.beer.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
public class BeerRecipeGrain {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="beer_recipe_grain_id")
    @JsonProperty("beerRecipeGrainId")
    private Integer id;

    @Column(nullable = false)
    @NotNull(message = "The field 'beerRecipeId' must be supplied")
    private Integer beerRecipeId;

    @Column(nullable = false)
    @NotNull(message = "The field 'beerGrainId' must be supplied")
    private Integer beerGrainId;

    @Column(nullable = false, precision = 10, scale = 2)
    @Max(value = 100, message = "The field 'amount' cannot be larger than 100")
    private BigDecimal amount;

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

    public Integer getBeerGrainId() {
        return beerGrainId;
    }

    public void setBeerGrainId(Integer beerGrainId) {
        this.beerGrainId = beerGrainId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
