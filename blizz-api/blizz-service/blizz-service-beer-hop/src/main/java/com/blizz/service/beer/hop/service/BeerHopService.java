package com.blizz.service.beer.hop.service;

import com.blizz.persistence.beer.model.BeerGrain;
import com.blizz.persistence.beer.model.BeerHop;
import com.blizz.persistence.beer.repository.BeerHopRepository;
import com.blizz.service.core.impl.BaseCrudServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BeerHopService extends BaseCrudServiceImpl<BeerHop, Integer> {
    private BeerHopRepository beerHopRepository;

    @Autowired
    public BeerHopService(BeerHopRepository beerHopRepository) {
        super(beerHopRepository);
        this.beerHopRepository = beerHopRepository;
    }

    public List<BeerHop> findByNameIgnoreCaseContains(String name) {
        if (name == null || name.isBlank()) {
            return beerHopRepository.findAll();
        }

        return beerHopRepository.findByNameIgnoreCaseContains(name);
    }
}
