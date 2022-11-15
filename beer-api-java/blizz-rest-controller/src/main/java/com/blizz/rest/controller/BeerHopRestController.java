package com.blizz.rest.controller;

import com.blizz.persistence.beer.model.BeerHop;
import com.blizz.rest.response.BaseResponse;
import com.blizz.rest.response.GetBeerHopsResponse;
import com.blizz.rest.response.PostBeerHopResponse;
import com.blizz.service.beer.hop.service.BeerHopService;
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
@RequestMapping(path="/beerHop")
public class BeerHopRestController {

    private final BeerHopService beerHopService;

    @Autowired
    public BeerHopRestController(BeerHopService beerHopService) {
        this.beerHopService = beerHopService;
    }

    @PostMapping()
    public @ResponseBody
    ResponseEntity<JsonNode> postBeerHop(
            @RequestBody @Valid BeerHop beerHop) {
        PostBeerHopResponse beerHopResponse = new PostBeerHopResponse();
        beerHopResponse.setBeerHopId(beerHopService.save(beerHop).getId());
        return BaseResponse.buildResponse(beerHopResponse, HttpStatus.OK);
    }

    @PutMapping(path = "{beerHopId}")
    public @ResponseBody
    ResponseEntity<JsonNode> putBeerHop(
            @PathVariable Integer beerHopId,
            @RequestBody @Valid BeerHop beerHop) {
        beerHop.setId(beerHopId);
        return BaseResponse.buildResponse(beerHopService.save(beerHop), HttpStatus.OK);
    }

    @GetMapping()
    public @ResponseBody
    ResponseEntity<JsonNode> getBeerHops(
            @RequestParam(required = false) String nameContains) {
        GetBeerHopsResponse beerHopsResponse = new GetBeerHopsResponse();
        List<BeerHop> beerHops = beerHopService.findByNameIgnoreCaseContains(nameContains);

        if (beerHops == null || beerHops.isEmpty()) {
            return BaseResponse.buildResponse(new GetBeerHopsResponse(), HttpStatus.NOT_FOUND);
        }

        beerHopsResponse.setBeerHops(beerHops);
        return BaseResponse.buildResponse(beerHopsResponse, HttpStatus.OK);
    }

    @GetMapping(path = "{beerHopId}")
    public @ResponseBody
    ResponseEntity<JsonNode> getBeerHop(
            @PathVariable String beerHopId) {
        GetBeerHopsResponse beerHopsResponse = new GetBeerHopsResponse();
        List<BeerHop> beerHops = beerHopService.findAllById(StringUtility.splitStringByCommaToIntegerList(beerHopId));

        if (beerHops == null || beerHops.isEmpty()) {
            return BaseResponse.buildResponse(new GetBeerHopsResponse(), HttpStatus.NOT_FOUND);
        }

        beerHopsResponse.setBeerHops(beerHops);
        return BaseResponse.buildResponse(beerHopsResponse, HttpStatus.OK);
    }
}
