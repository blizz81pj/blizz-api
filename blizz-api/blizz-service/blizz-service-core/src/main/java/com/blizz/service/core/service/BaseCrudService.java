package com.blizz.service.core.service;

import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BaseCrudService<T, ID> {
    void delete(T entity);

    List<T> findAll();

    List<T> findAllById(Iterable<ID> ids);

    T save(T entity);

    void saveAll(Iterable<T> entities);
}
