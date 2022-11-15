package com.blizz.persistence.beer.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Entity
public class BeerRecipeNote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="beer_recipe_note_id")
    @JsonProperty("beerRecipeNoteId")
    private Integer id;

    @Column(nullable = false)
    @NotNull(message = "The field 'beerRecipeId' must be supplied")
    private Integer beerRecipeId;

    @Column(nullable = false)
    @NotBlank(message = "The field 'note' is required")
    private String note;

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

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
