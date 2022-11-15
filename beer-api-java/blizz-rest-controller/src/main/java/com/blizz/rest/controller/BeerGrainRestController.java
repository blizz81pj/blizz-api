package com.blizz.rest.controller;

import com.blizz.persistence.beer.model.BeerGrain;
import com.blizz.rest.response.BaseResponse;
import com.blizz.rest.response.GetBeerGrainsResponse;
import com.blizz.rest.response.PostBeerGrainResponse;
import com.blizz.service.beer.grain.service.BeerGrainService;
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
@RequestMapping(path="/beerGrain")
public class BeerGrainRestController {

    private final BeerGrainService beerGrainService;

    @Autowired
    public BeerGrainRestController(BeerGrainService beerGrainService) {
        this.beerGrainService = beerGrainService;
    }

    @PostMapping()
    public @ResponseBody
    ResponseEntity<JsonNode> postBeerGrain(
            @RequestBody @Valid BeerGrain beerGrain) {
        PostBeerGrainResponse beerGrainResponse = new PostBeerGrainResponse();
        beerGrainResponse.setBeerGrainId(beerGrainService.save(beerGrain).getId());
        return BaseResponse.buildResponse(beerGrainResponse, HttpStatus.OK);
    }

    @PutMapping(path = "{beerGrainId}")
    public @ResponseBody
    ResponseEntity<JsonNode> putBeerGrain(
            @PathVariable Integer beerGrainId,
            @RequestBody @Valid BeerGrain beerGrain) {
        beerGrain.setId(beerGrainId);
        return BaseResponse.buildResponse(beerGrainService.save(beerGrain), HttpStatus.OK);
    }

    @GetMapping()
    public @ResponseBody
    ResponseEntity<JsonNode> getBeerGrains(
            @RequestParam(required = false) String nameContains) {
        GetBeerGrainsResponse beerGrainsResponse = new GetBeerGrainsResponse();
        List<BeerGrain> beerGrains = beerGrainService.findByNameIgnoreCaseContains(nameContains);

        if (beerGrains == null || beerGrains.isEmpty()) {
            return BaseResponse.buildResponse(new GetBeerGrainsResponse(), HttpStatus.NOT_FOUND);
        }

        beerGrainsResponse.setBeerGrains(beerGrains);
        return BaseResponse.buildResponse(beerGrainsResponse, HttpStatus.OK);
    }

    @GetMapping(path = "{beerGrainId}")
    public @ResponseBody
    ResponseEntity<JsonNode> getBeerGrain(
            @PathVariable String beerGrainId) {
        GetBeerGrainsResponse beerGrainsResponse = new GetBeerGrainsResponse();
        List<BeerGrain> beerGrains = beerGrainService.findAllById(StringUtility.splitStringByCommaToIntegerList(beerGrainId));

        if (beerGrains == null || beerGrains.isEmpty()) {
            return BaseResponse.buildResponse(new GetBeerGrainsResponse(), HttpStatus.NOT_FOUND);
        }

        beerGrainsResponse.setBeerGrains(beerGrains);
        return BaseResponse.buildResponse(beerGrainsResponse, HttpStatus.OK);
    }
}
