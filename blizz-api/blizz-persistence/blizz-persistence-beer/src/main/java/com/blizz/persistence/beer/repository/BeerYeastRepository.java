package com.blizz.persistence.beer.repository;

import com.blizz.persistence.beer.model.BeerYeast;
import com.blizz.persistence.core.repository.BaseRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BeerYeastRepository extends BaseRepository<BeerYeast, Integer> {
    List<BeerYeast> findByNameIgnoreCaseContains(@Param("name") String name);
}
