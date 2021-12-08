package com.example.scraper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;

import com.example.shell.Company;
import com.example.shell.Job;
import com.example.shell.Scraper;
import com.example.sql.DAO;
import com.example.sql.PsqlJobs;

public class ScraperThreads implements Runnable {
    private static Collection<Job> jobs = new ArrayList<Job>();
    private static final DAO<Job, String> JOB_DAO = new PsqlJobs();

    private String searchQuery;
    private int searchQueryLimit;
    private Scraper<Job> talent;
    private Company comp;

    public ScraperThreads(String searchQuery, int searchQueryLimit, Scraper<Job> talent, Company comp) {
        this.searchQuery = searchQuery;
        this.searchQueryLimit = searchQueryLimit;
        this.talent = talent;
        this.comp = comp;
    }

    @Override
    public void run() {
        runGetJobsData(searchQuery, searchQueryLimit, talent, comp);
    }

    public static Optional<String> addJob(Job job, Optional<Integer> websiteId, Optional<Integer> id) {
        return JOB_DAO.save(job, websiteId, id);
    }

    private static void runGetJobsData(String searchQuery, int searchQueryLimit, Scraper<Job> talent, Company comp) {
        try {
            jobs = talent.getJobsData((searchQueryLimit), searchQuery);
            for (Job job : jobs) {
                addJob(job, Optional.of(comp.getId()), null);
            }

        } catch (IOException e) {
            System.err.println("Error " + e);
            e.printStackTrace();
        }
    }

}
