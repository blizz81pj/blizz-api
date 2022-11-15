package com.blizz.rest.response;

import com.blizz.persistence.beer.model.BeerGrain;

import java.util.List;

public class GetBeerGrainsResponse {
    private List<BeerGrain> beerGrains;

    public List<BeerGrain> getBeerGrains() {
        return beerGrains;
    }

    public void setBeerGrains(List<BeerGrain> beerGrains) {
        this.beerGrains = beerGrains;
    }
}
