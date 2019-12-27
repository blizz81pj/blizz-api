package com.blizz.persistence.beer.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.math.BigDecimal;

@Entity
public class BeerHop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="beerHopId")
    @JsonProperty("beerHopId")
    private Integer id;

    @Column(nullable = false, length = 50)
    @NotBlank(message = "The field 'name' is required")
    @Size(max = 50, message = "The field 'name' cannot be longer than 50 characters")
    private String name;

    @Column(precision = 10, scale = 2)
    @Max(value = 100, message = "The field 'alphaAcid' cannot be larger than 100")
    private BigDecimal alphaAcid;

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

    public BigDecimal getAlphaAcid() {
        return alphaAcid;
    }

    public void setAlphaAcid(BigDecimal alphaAcid) {
        this.alphaAcid = alphaAcid;
    }
}
