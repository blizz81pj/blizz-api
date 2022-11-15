package com.blizz.rest.response;

import com.blizz.persistence.beer.model.BeerYeast;

import java.util.List;

public class GetBeerYeastsResponse {
    private List<BeerYeast> beerYeasts;

    public List<BeerYeast> getBeerYeasts() {
        return beerYeasts;
    }

    public void setBeerYeasts(List<BeerYeast> beerYeasts) {
        this.beerYeasts = beerYeasts;
    }
}
