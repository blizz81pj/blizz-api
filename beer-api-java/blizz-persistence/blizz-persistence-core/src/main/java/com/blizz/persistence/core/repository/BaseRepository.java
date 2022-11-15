package com.blizz.persistence.core.repository;

import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.io.Serializable;
import java.util.List;

@NoRepositoryBean
public interface BaseRepository<T, ID extends Serializable> extends Repository<T, ID> {
    void delete(T entity);

    List<T> findAll();

    List<T> findAllById(Iterable<ID> ids);

    T save(T entity);

    void saveAll(Iterable<T> entities);

    //List<T> findByNameIgnoreCaseContains(@Param("name") String name);
}
