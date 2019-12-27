package com.blizz.rest.controller;

import com.blizz.rest.response.BaseResponse;
import com.blizz.rest.response.PostBeerRecipeResponse;
import com.blizz.service.beer.recipe.dto.PostBeerRecipeRequest;
import com.blizz.service.beer.recipe.service.BeerRecipeService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.validation.Valid;

@Controller
@RequestMapping(path="/beerRecipe")
public class BeerRecipeRestController {

    private final BeerRecipeService beerRecipeService;

    @Autowired
    public BeerRecipeRestController(BeerRecipeService beerRecipeService) {
        this.beerRecipeService = beerRecipeService;
    }

    @PostMapping()
    public @ResponseBody
    ResponseEntity<JsonNode> postBeerRecipe(
            @RequestBody @Valid PostBeerRecipeRequest postBeerRecipeRequest) {
        PostBeerRecipeResponse beerRecipeResponse = new PostBeerRecipeResponse();
        beerRecipeResponse.setBeerRecipeId(beerRecipeService.save(postBeerRecipeRequest).getId());
        return BaseResponse.buildResponse(beerRecipeResponse, HttpStatus.OK);
    }
}
