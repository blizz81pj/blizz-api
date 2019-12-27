package com.blizz.persistence.beer.repository;

import com.blizz.persistence.beer.model.BeerRecipe;
import org.springframework.data.repository.Repository;

public interface BeerRecipeRepository extends Repository<BeerRecipe, Integer> {
    BeerRecipe save(BeerRecipe recipe);
}
