package com.blizz.service.beer.recipe.dto;

import com.blizz.persistence.beer.model.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.List;

public class PostBeerRecipeRequest {
    @NotBlank(message = "The field 'beerRecipe' is required")
    private BeerRecipe beerRecipe;

    @NotEmpty(message = "The field 'beerRecipeGrains' must be provided and at least (1) beerRecipeGrain must be supplied")
    private List<BeerRecipeGrain> beerRecipeGrains;

    @NotEmpty(message = "The field 'beerRecipeHops' must be provided and at least (1) beerRecipeHop must be supplied")
    private List<BeerRecipeHop> beerRecipeHops;

    @NotEmpty(message = "The field 'beerRecipeYeasts' must be provided and at least (1) beerRecipeYeast must be supplied")
    private List<BeerRecipeYeast> beerRecipeYeasts;

    @NotEmpty(message = "The field 'beerRecipeMashSteps' must be provided and at least (1) beerRecipeMashStep must be supplied")
    private List<BeerRecipeMashStep> beerRecipeMashSteps;

    private List<BeerRecipeNote> beerRecipeNotes;

    public BeerRecipe getBeerRecipe() {
        return beerRecipe;
    }

    public void setBeerRecipe(BeerRecipe beerRecipe) {
        this.beerRecipe = beerRecipe;
    }

    public List<BeerRecipeGrain> getBeerRecipeGrains() {
        return beerRecipeGrains;
    }

    public void setBeerRecipeGrains(List<BeerRecipeGrain> beerRecipeGrains) {
        this.beerRecipeGrains = beerRecipeGrains;
    }

    public List<BeerRecipeHop> getBeerRecipeHops() {
        return beerRecipeHops;
    }

    public void setBeerRecipeHops(List<BeerRecipeHop> beerRecipeHops) {
        this.beerRecipeHops = beerRecipeHops;
    }

    public List<BeerRecipeYeast> getBeerRecipeYeasts() {
        return beerRecipeYeasts;
    }

    public void setBeerRecipeYeasts(List<BeerRecipeYeast> beerRecipeYeasts) {
        this.beerRecipeYeasts = beerRecipeYeasts;
    }

    public List<BeerRecipeMashStep> getBeerRecipeMashSteps() {
        return beerRecipeMashSteps;
    }

    public void setBeerRecipeMashSteps(List<BeerRecipeMashStep> beerRecipeMashSteps) {
        this.beerRecipeMashSteps = beerRecipeMashSteps;
    }

    public List<BeerRecipeNote> getBeerRecipeNotes() {
        return beerRecipeNotes;
    }

    public void setBeerRecipeNotes(List<BeerRecipeNote> beerRecipeNotes) {
        this.beerRecipeNotes = beerRecipeNotes;
    }
}
