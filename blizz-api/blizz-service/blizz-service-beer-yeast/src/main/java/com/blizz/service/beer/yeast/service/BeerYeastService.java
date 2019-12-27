package com.blizz.service.beer.yeast.service;

import com.blizz.persistence.beer.model.BeerYeast;
import com.blizz.persistence.beer.repository.BeerYeastRepository;
import com.blizz.service.core.impl.BaseCrudServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BeerYeastService extends BaseCrudServiceImpl<BeerYeast, Integer> {
    private BeerYeastRepository beerYeastRepository;

    @Autowired
    public BeerYeastService(BeerYeastRepository beerYeastRepository) {
        super(beerYeastRepository);
        this.beerYeastRepository = beerYeastRepository;
    }

    public List<BeerYeast> findByNameIgnoreCaseContains(String name) {
        if (name == null || name.isBlank()) {
            return beerYeastRepository.findAll();
        }

        return beerYeastRepository.findByNameIgnoreCaseContains(name);
    }
}
