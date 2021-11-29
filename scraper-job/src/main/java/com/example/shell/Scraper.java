package com.example.shell;

import java.io.IOException;
import java.util.Collection;

public interface Scraper<J> {
    Collection<J> getJobsData(int j, String f) throws IOException;

    Collection<J> mapJobsData(int j, String i, String s) throws IOException;

    void init() throws IOException;
}
