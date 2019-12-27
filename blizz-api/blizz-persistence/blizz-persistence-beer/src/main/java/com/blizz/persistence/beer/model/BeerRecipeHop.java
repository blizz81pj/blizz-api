package com.blizz.persistence.beer.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
public class BeerRecipeHop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="beer_recipe_hop_id")
    @JsonProperty("beerRecipeHopId")
    private Integer id;

    @Column(nullable = false)
    @NotNull(message = "The field 'beerRecipeId' must be supplied")
    private Integer beerRecipeId;

    @Column(nullable = false)
    @NotNull(message = "The field 'beerHopId' must be supplied")
    private Integer beerHopId;

    @Column(nullable = false, precision = 10, scale = 2)
    @Max(value = 100, message = "The field 'amount' cannot be larger than 100")
    private BigDecimal amount;

    @Max(value = 1000, message = "The field 'boilMinute' cannot be larger than 1000")
    private Integer boilMinute;

    @Column(name = "is_dry_hop")
    private Boolean dryHopFlag;

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

    public Integer getBeerHopId() {
        return beerHopId;
    }

    public void setBeerHopId(Integer beerHopId) {
        this.beerHopId = beerHopId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Integer getBoilMinute() {
        return boilMinute;
    }

    public void setBoilMinute(Integer boilMinute) {
        this.boilMinute = boilMinute;
    }

    public Boolean getDryHopFlag() {
        return dryHopFlag;
    }

    public void setDryHopFlag(Boolean dryHopFlag) {
        this.dryHopFlag = dryHopFlag;
    }
}
