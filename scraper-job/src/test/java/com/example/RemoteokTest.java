package com.example;

import java.io.IOException;
import java.util.Collection;
import java.util.Optional;

import com.example.scraper.ExcecuteDB;
import com.example.scraper.remoteok.Remoteok;
import com.example.shell.Company;
import com.example.shell.Job;
import com.example.shell.SiteType;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class RemoteokTest implements IScraper<Remoteok> {
    Remoteok website;
    Collection<Company> companies;

    @BeforeEach
    @Override
    public void setUp() {
        companies = ExcecuteDB.getAllCompanies();
        website = new Remoteok();
    }


    /**
     * @throws IOException
     */
    @Test
    @DisplayName("Should have the right url, name from DB - (RemoteOk)")
    @Override
    public void shouldCheckWesbiteNotNull() throws IOException {
        // making sure websiteUrl is not empty
        Assertions.assertFalse(website.websiteUrl.isEmpty());
        // making sure title is not equal to SiteType
        Assertions.assertEquals(website.title, SiteType.REMOTEOK);

        // checking the class exist in the database.
        Assertions
                .assertTrue(companies.stream().filter(
                        comp -> comp.getUrl().equals(website.websiteUrl) && comp.getSiteType().equals(website.title))
                        .findAny()
                        .isPresent());
    }


    /**
     * @throws IOException
     */
    @Test
    @DisplayName("Should create job and check if it exist")
    @Override
    public void shouldCreateJob() throws IOException {
        Job job = new Job("RemoteOK Test company name", "test job title", "$100,000 - $300,000", "logo.png",
                website.websiteUrl, "London", "Short desrciption", "Other");

        Integer id = companies.stream().filter(company -> company.getSiteType() == website.title).findAny().get()
                .getId();

        // create a new job
        ExcecuteDB.addJob(job, Optional.of(id), null);

        Collection<Job> jobs = ExcecuteDB.getAllJobs();

        Assertions.assertTrue(jobs.stream().filter(
                j -> j.getCompanyName().equals(job.getCompanyName())
                        && j.getJobTitle().equals(job.getJobTitle())
                        && j.getLocation().equals(job.getLocation())
                        && j.getSalary().equals(job.getSalary()))
                .findAny().isPresent());
    }
}
