package com.blizz.persistence.beer.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.math.BigDecimal;

@Entity
public class BeerRecipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="beer_recipe_id")
    @JsonProperty("beerRecipeId")
    private Integer id;

    @Column(nullable = false, length = 50)
    @NotBlank(message = "The field 'name' is required")
    @Size(max = 50, message = "The field 'name' cannot be longer than 50 characters")
    private String name;

    @Column(precision = 10, scale = 2)
    @Max(value = 100, message = "The field 'targetGravity' cannot be larger than 100")
    private BigDecimal targetGravity;

    @Column(precision = 10, scale = 2)
    @Max(value = 100, message = "The field 'originalGravity' cannot be larger than 100")
    private BigDecimal originalGravity;

    @Column(precision = 10, scale = 2)
    @Max(value = 100, message = "The field 'finalGravity' cannot be larger than 100")
    private BigDecimal finalGravity;

    @Column(precision = 10, scale = 2)
    @Max(value = 100, message = "The field 'alcoholByVolume' cannot be larger than 100")
    private BigDecimal alcoholByVolume;

    @Column(precision = 10, scale = 2)
    @Max(value = 100, message = "The field 'batchSize' cannot be larger than 100")
    private BigDecimal batchSize;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getTargetGravity() {
        return targetGravity;
    }

    public void setTargetGravity(BigDecimal targetGravity) {
        this.targetGravity = targetGravity;
    }

    public BigDecimal getOriginalGravity() {
        return originalGravity;
    }

    public void setOriginalGravity(BigDecimal originalGravity) {
        this.originalGravity = originalGravity;
    }

    public BigDecimal getFinalGravity() {
        return finalGravity;
    }

    public void setFinalGravity(BigDecimal finalGravity) {
        this.finalGravity = finalGravity;
    }

    public BigDecimal getAlcoholByVolume() {
        return alcoholByVolume;
    }

    public void setAlcoholByVolume(BigDecimal alcoholByVolume) {
        this.alcoholByVolume = alcoholByVolume;
    }

    public BigDecimal getBatchSize() {
        return batchSize;
    }

    public void setBatchSize(BigDecimal batchSize) {
        this.batchSize = batchSize;
    }
}
