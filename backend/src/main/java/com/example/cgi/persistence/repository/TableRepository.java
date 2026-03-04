package com.example.cgi.persistence.repository;

import com.example.cgi.core.domain.Table;

import java.util.List;
import java.util.Optional;

public interface TableRepository {
    List<Table> findAll();

    Optional<Table> findById(Long id);
}
