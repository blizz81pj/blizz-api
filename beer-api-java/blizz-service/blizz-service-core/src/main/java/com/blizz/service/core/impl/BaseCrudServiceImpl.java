package com.blizz.service.core.impl;

import com.blizz.persistence.core.repository.BaseRepository;
import com.blizz.service.core.service.BaseCrudService;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.Serializable;
import java.util.List;

public class BaseCrudServiceImpl<T, ID extends Serializable> implements BaseCrudService<T, ID> {

    private BaseRepository<T, ID> baseRepository;

    public BaseCrudServiceImpl() {
    }

    public BaseCrudServiceImpl(BaseRepository<T, ID> baseRepository) {
        this.baseRepository = baseRepository;
    }

    @Override
    public void delete(T entity) {
        baseRepository.delete(entity);
    }

    @Override
    public List<T> findAll() {
        return baseRepository.findAll();
    }

    @Override
    public List<T> findAllById(Iterable<ID> ids) {
        return baseRepository.findAllById(ids);
    }

    @Override
    public T save(T entity) {
        return baseRepository.save(entity);
    }

    @Override
    public void saveAll(Iterable<T> entites) {
        baseRepository.saveAll(entites);
    }
}
