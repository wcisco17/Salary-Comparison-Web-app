package com.example.sql;

import java.util.Collection;
import java.util.Optional;

public interface DAO<T, I> {
    Collection<T> getAll();

    Optional<T> get(Integer id);

    Optional<String> save(T t, Optional<Integer> s, Optional<Integer> id);

    void update(T t);
}
