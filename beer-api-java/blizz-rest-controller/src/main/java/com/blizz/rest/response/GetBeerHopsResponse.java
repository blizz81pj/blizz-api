package com.blizz.rest.response;

import com.blizz.persistence.beer.model.BeerHop;

import java.util.List;

public class GetBeerHopsResponse {
    private List<BeerHop> beerHops;

    public List<BeerHop> getBeerHops() {
        return beerHops;
    }

    public void setBeerHops(List<BeerHop> beerHops) {
        this.beerHops = beerHops;
    }
}
