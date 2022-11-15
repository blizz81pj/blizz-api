package com.blizz.persistence.beer.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
public class BeerRecipeYeast {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="beer_recipe_yeast_id")
    @JsonProperty("beerRecipeYeastId")
    private Integer id;

    @Column(nullable = false)
    @NotNull(message = "The field 'beerRecipeId' must be supplied")
    private Integer beerRecipeId;

    @Column(nullable = false)
    @NotNull(message = "The field 'beerYeastId' must be supplied")
    private Integer beerYeastId;

    @Column(precision = 10, scale = 2)
    @Max(value = 100, message = "The field 'starterGallons' cannot be larger than 100")
    private BigDecimal starterGallons;

    @Column(precision = 10, scale = 2)
    @Max(value = 100, message = "The field 'starterMaltExtractOunces' cannot be larger than 100")
    private BigDecimal starterMaltExtractOunces;

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

    public Integer getBeerYeastId() {
        return beerYeastId;
    }

    public void setBeerYeastId(Integer beerYeastId) {
        this.beerYeastId = beerYeastId;
    }

    public BigDecimal getStarterGallons() {
        return starterGallons;
    }

    public void setStarterGallons(BigDecimal starterGallons) {
        this.starterGallons = starterGallons;
    }

    public BigDecimal getStarterMaltExtractOunces() {
        return starterMaltExtractOunces;
    }

    public void setStarterMaltExtractOunces(BigDecimal starterMaltExtractOunces) {
        this.starterMaltExtractOunces = starterMaltExtractOunces;
    }
}
