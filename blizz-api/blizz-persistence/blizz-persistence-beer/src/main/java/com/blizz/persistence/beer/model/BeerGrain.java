package com.blizz.persistence.beer.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.math.BigDecimal;

@Entity
public class BeerGrain {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="beer_grain_id")
    @JsonProperty("beerGrainId")
    private Integer id;

    @Column(nullable = false, length = 50)
    @NotBlank(message = "The field 'name' is required")
    @Size(max = 50, message = "The field 'name' cannot be longer than 50 characters")
    private String name;

    private Integer lovibond;

    @Column(precision = 10, scale = 3)
    @Max(value = 100, message = "The field 'potentialGravity' cannot be larger than 100")
    private BigDecimal potentialGravity;

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

    public Integer getLovibond() {
        return lovibond;
    }

    public void setLovibond(Integer lovibond) {
        this.lovibond = lovibond;
    }

    public BigDecimal getPotentialGravity() {
        return potentialGravity;
    }

    public void setPotentialGravity(BigDecimal potentialGravity) {
        this.potentialGravity = potentialGravity;
    }
}
