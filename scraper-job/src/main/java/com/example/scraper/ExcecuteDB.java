package com.example.scraper;

import java.io.IOException;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;
import java.util.Scanner;

import com.example.scraper.glassdoor.Glassdoor;
import com.example.scraper.indeed.Indeed;
import com.example.scraper.remoteok.Remoteok;
import com.example.scraper.simplyhired.SimplyHired;
import com.example.scraper.talent.Talent;
import com.example.shell.Company;
import com.example.shell.Job;
import com.example.shell.Scraper;
import com.example.sql.DAO;
import com.example.sql.PsqlJobs;
import com.example.sql.PsqlWebsite;

public class ExcecuteDB {
    private static final PrintStream OUT = System.out;
    private static Collection<Job> jobs = new ArrayList<Job>();
    private static final DAO<Company, String> COMPANY_DAO = new PsqlWebsite();
    private static final DAO<Job, String> JOB_DAO = new PsqlJobs();

    public static Optional<String> addCompany(Company company, Optional<Integer> c, Optional<Integer> i) {
        return COMPANY_DAO.save(company, c, i);
    }

    public static void updateCompany(Company company) {
        COMPANY_DAO.update(company);
    }

    public static Collection<Company> getAllCompanies() {
        return COMPANY_DAO.getAll();
    }

    public static Optional<Company> getCompany(Integer id) {
        return COMPANY_DAO.get(id);
    }

    public static Optional<String> addJob(Job job, Optional<Integer> websiteId, Optional<Integer> id) {
        return JOB_DAO.save(job, websiteId, id);
    }

    public static Optional<String> getJobs(Job job) {
        return null;
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

    public static void main() throws IOException {
        // prompts variables
        Scanner in = new Scanner(System.in);
        int companyId;
        String searchQuery;
        int searchQueryLimit;

        Collection<Company> companies = getAllCompanies();

        // classes to run
        Talent talent = new Talent();
        Remoteok remoteok = new Remoteok();
        SimplyHired simplyhired = new SimplyHired();
        Indeed indeed = new Indeed();
        Glassdoor glassdoor = new Glassdoor();

        OUT.println("What type of jobs are you looking to pull from, Exp: Engineer, Product Manager,");
        searchQuery = in.nextLine();

        OUT.printf("\n Perfect we'll look for: %s! \n - Please choose between the following companies to pull from \n",
                searchQuery);
        OUT.printf("Type the following keys: from (1 - %s) \n", companies.size());

        // list out all the companies.
        companies.forEach(i -> {
            OUT.printf("(id %s), Company Name: %s \n", i.getId(), i.getTitle());
        });

        companyId = in.nextInt();
        companies.forEach(comp -> {
            if (companyId == comp.getId())
                OUT.printf("You've chosen company: %s looking for job: %s \n", comp.getTitle(), searchQuery);
        });

        OUT.printf("How many jobs would you like to pull?\n");
        searchQueryLimit = in.nextInt();

        OUT.printf("Looking for %s jobs \n", searchQueryLimit);

        companies.forEach(comp -> {
            if (companyId == comp.getId() && comp.getSiteType() == talent.title) {
                runGetJobsData(searchQuery, searchQueryLimit, talent, comp);
            }

            else if (companyId == comp.getId() && comp.getSiteType() == remoteok.title) {
                runGetJobsData(searchQuery, searchQueryLimit, remoteok, comp);
            }

            else if (companyId == comp.getId() && comp.getSiteType() == simplyhired.title) {
                runGetJobsData(searchQuery, searchQueryLimit, simplyhired, comp);
            }

            else if (companyId == comp.getId() && comp.getSiteType() == indeed.title) {
                runGetJobsData(searchQuery, searchQueryLimit, indeed, comp);
            }

            else if (companyId == comp.getId() && comp.getSiteType() == glassdoor.title) {
                runGetJobsData(searchQuery, searchQueryLimit, glassdoor, comp);
            }
        });

        in.close();
    }
}
