package com.blizz.service.beer.recipe.service;

import com.blizz.persistence.beer.model.*;
import com.blizz.service.beer.recipe.dto.PostBeerRecipeRequest;

import java.util.List;

public interface BeerRecipeService {
    BeerRecipe save(PostBeerRecipeRequest postBeerRecipeRequest);
}
