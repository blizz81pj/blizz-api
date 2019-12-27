package com.blizz.persistence.beer.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
public class BeerYeast {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="beer_yeast_id")
    @JsonProperty("beerYeastId")
    private Integer id;

    @Column(nullable = false, length = 50)
    @NotBlank(message = "The field 'name' is required")
    @Size(max = 50, message = "The field 'name' cannot be longer than 50 characters")
    private String name;

    @Column(name="is_kettle_sour")
    private Boolean kettleSourFlag;

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

    public Boolean getKettleSourFlag() {
        return kettleSourFlag;
    }

    public void setKettleSourFlag(Boolean kettleSourFlag) {
        this.kettleSourFlag = kettleSourFlag;
    }
}
