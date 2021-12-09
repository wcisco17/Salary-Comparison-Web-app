package com.example;

import java.io.IOException;

public interface IScraper<W> {
    void setUp();

    void shouldCheckWesbiteNotNull() throws IOException;

    void shouldCreateJob() throws IOException;
}
