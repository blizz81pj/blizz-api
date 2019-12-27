package com.blizz.persistence.beer.repository;

import com.blizz.persistence.beer.model.BeerGrain;
import com.blizz.persistence.core.repository.BaseRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BeerGrainRepository extends BaseRepository<BeerGrain, Integer> {
    List<BeerGrain> findByNameIgnoreCaseContains(@Param("name") String name);
}
