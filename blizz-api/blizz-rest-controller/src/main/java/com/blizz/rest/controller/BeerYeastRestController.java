package com.blizz.rest.controller;

import com.blizz.persistence.beer.model.BeerYeast;
import com.blizz.rest.response.*;
import com.blizz.service.beer.yeast.service.BeerYeastService;
import com.blizz.utility.core.string.StringUtility;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Controller
@RequestMapping(path="/beerYeast")
public class BeerYeastRestController {

    private final BeerYeastService beerYeastService;

    @Autowired
    public BeerYeastRestController(BeerYeastService beerYeastService) {
        this.beerYeastService = beerYeastService;
    }

    @PostMapping()
    public @ResponseBody
    ResponseEntity<JsonNode> postBeerYeast(
            @RequestBody @Valid BeerYeast beerYeast) {
        PostBeerYeastResponse beerYeastResponse = new PostBeerYeastResponse();
        beerYeastResponse.setBeerYeastId(beerYeastService.save(beerYeast).getId());
        return BaseResponse.buildResponse(beerYeastResponse, HttpStatus.OK);
    }

    @PutMapping(path = "{beerYeastId}")
    public @ResponseBody
    ResponseEntity<JsonNode> putBeerYeast(
            @PathVariable Integer beerYeastId,
            @RequestBody @Valid BeerYeast beerYeast) {
        beerYeast.setId(beerYeastId);
        return BaseResponse.buildResponse(beerYeastService.save(beerYeast), HttpStatus.OK);
    }

    @GetMapping()
    public @ResponseBody
    ResponseEntity<JsonNode> getBeerYeasts(
            @RequestParam(required = false) String nameContains) {
        GetBeerYeastsResponse beerYeastsResponse = new GetBeerYeastsResponse();
        List<BeerYeast> beerYeasts = beerYeastService.findByNameIgnoreCaseContains(nameContains);

        if (beerYeasts == null || beerYeasts.isEmpty()) {
            return BaseResponse.buildResponse(new GetBeerYeastsResponse(), HttpStatus.NOT_FOUND);
        }

        beerYeastsResponse.setBeerYeasts(beerYeasts);
        return BaseResponse.buildResponse(beerYeastsResponse, HttpStatus.OK);
    }

    @GetMapping(path = "{beerYeastId}")
    public @ResponseBody
    ResponseEntity<JsonNode> getBeerYeast(
            @PathVariable String beerYeastId) {
        GetBeerYeastsResponse beerYeastsResponse = new GetBeerYeastsResponse();
        List<BeerYeast> beerYeasts = beerYeastService.findAllById(StringUtility.splitStringByCommaToIntegerList(beerYeastId));

        if (beerYeasts == null || beerYeasts.isEmpty()) {
            return BaseResponse.buildResponse(new GetBeerYeastsResponse(), HttpStatus.NOT_FOUND);
        }

        beerYeastsResponse.setBeerYeasts(beerYeasts);
        return BaseResponse.buildResponse(beerYeastsResponse, HttpStatus.OK);
    }
}
