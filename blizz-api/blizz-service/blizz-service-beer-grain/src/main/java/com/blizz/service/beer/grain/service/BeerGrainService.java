package com.blizz.service.beer.grain.service;

import com.blizz.persistence.beer.model.BeerGrain;
import com.blizz.persistence.beer.repository.BeerGrainRepository;
import com.blizz.service.core.impl.BaseCrudServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BeerGrainService extends BaseCrudServiceImpl<BeerGrain, Integer> {
    private BeerGrainRepository beerGrainRepository;

    @Autowired
    public BeerGrainService(BeerGrainRepository beerGrainRepository) {
        super(beerGrainRepository);
        this.beerGrainRepository = beerGrainRepository;
    }

    public List<BeerGrain> findByNameIgnoreCaseContains(String name) {
        if (name == null || name.isBlank()) {
            return beerGrainRepository.findAll();
        }

        return beerGrainRepository.findByNameIgnoreCaseContains(name);
    }
}
