package com.blizz.service.beer.recipe.impl;

import com.blizz.persistence.beer.model.*;
import com.blizz.persistence.beer.repository.*;
import com.blizz.service.beer.recipe.dto.PostBeerRecipeRequest;
import com.blizz.service.beer.recipe.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
public class BeerRecipeServiceImpl implements BeerRecipeService {

    @Autowired
    private BeerRecipeRepository beerRecipeRepository;

    @Autowired
    private BeerRecipeGrainRepository beerRecipeGrainRepository;

    @Autowired
    private BeerRecipeHopRepository beerRecipeHopRepository;

    @Autowired
    private BeerRecipeYeastRepository beerRecipeYeastRepository;

    @Autowired
    private BeerRecipeMashStepRepository beerRecipeMashStepRepository;

    @Autowired
    private BeerRecipeNoteRepository beerRecipeNoteRepository;

    @Override
    @Transactional
    public BeerRecipe save(PostBeerRecipeRequest postBeerRecipeRequest) {
        BeerRecipe beerRecipe = postBeerRecipeRequest.getBeerRecipe();
        beerRecipe = beerRecipeRepository.save(beerRecipe);
        Integer beerRecipeId = beerRecipe.getId();

        // TODO: should probably validate the recipe child objects / make sure the IDs passed in exist
        postBeerRecipeRequest.getBeerRecipeGrains().forEach(recipeGrain -> recipeGrain.setBeerRecipeId(beerRecipeId));
        postBeerRecipeRequest.getBeerRecipeHops().forEach(recipeHop -> recipeHop.setBeerRecipeId(beerRecipeId));
        postBeerRecipeRequest.getBeerRecipeYeasts().forEach(recipeYeast -> recipeYeast.setBeerRecipeId(beerRecipeId));
        postBeerRecipeRequest.getBeerRecipeMashSteps().forEach(recipeMashStep -> recipeMashStep.setBeerRecipeId(beerRecipeId));

        if (postBeerRecipeRequest.getBeerRecipeNotes() != null) {
            postBeerRecipeRequest.getBeerRecipeNotes().forEach(recipeNote -> recipeNote.setBeerRecipeId(beerRecipeId));
        }

        beerRecipeGrainRepository.saveAll(postBeerRecipeRequest.getBeerRecipeGrains());
        beerRecipeHopRepository.saveAll(postBeerRecipeRequest.getBeerRecipeHops());
        beerRecipeYeastRepository.saveAll(postBeerRecipeRequest.getBeerRecipeYeasts());
        beerRecipeMashStepRepository.saveAll(postBeerRecipeRequest.getBeerRecipeMashSteps());

        if (postBeerRecipeRequest.getBeerRecipeNotes() != null) {
            beerRecipeNoteRepository.saveAll(postBeerRecipeRequest.getBeerRecipeNotes());
        }

        return beerRecipe;
    }
}
