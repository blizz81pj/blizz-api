package com.blizz.persistence.beer.repository;

import com.blizz.persistence.beer.model.BeerHop;
import com.blizz.persistence.core.repository.BaseRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BeerHopRepository extends BaseRepository<BeerHop, Integer> {
    List<BeerHop> findByNameIgnoreCaseContains(@Param("name") String name);
}
