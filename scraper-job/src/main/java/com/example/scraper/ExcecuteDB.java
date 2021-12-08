package com.example.scraper;

import java.io.IOException;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.InputMismatchException;
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
    private static boolean done = false;

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
        int chooseJobSites;

        String searchQuery;
        Talent talent = new Talent();
        Remoteok remoteok = new Remoteok();
        SimplyHired simplyhired = new SimplyHired();
        Indeed indeed = new Indeed();
        Glassdoor glassdoor = new Glassdoor();

        OUT.println("What type of jobs are you looking to pull from, Exp: Engineer, Product Manager,");
        searchQuery = in.nextLine();

        OUT.println(
                "Would you like to pull from multiple job sites or one? Enter (1) = one job site or (2) = multiple job sites");

        OUT.println("Please enter the number 1 (One job sites) - 2 (Multiple job sites)\n ");
        chooseJobSites = in.nextInt();
        do {

            try {
                Collection<Company> companies = getAllCompanies();

                if (chooseJobSites == 1) {
                    // classes to run

                    int companyId;
                    int searchQueryLimit;

                    OUT.printf(
                            "\n Perfect we'll look for: %s! \n - Please choose between the following companies to pull from \n",
                            searchQuery);

                    OUT.printf("Type the following keys: from (1 - %s) \n", companies.size());

                    // list out all the companies.
                    companies.forEach(i -> {
                        OUT.printf("(id %s), Company Name: %s \n", i.getId(), i.getTitle());
                    });

                    companyId = in.nextInt();
                    companies.forEach(comp -> {
                        if (companyId == comp.getId())
                            OUT.printf("You've chosen company: %s looking for job: %s \n", comp.getTitle(),
                                    searchQuery);
                    });

                    OUT.printf("How many jobs would you like to pull?\n");
                    searchQueryLimit = in.nextInt();

                    OUT.printf("Looking for %s jobs \n", searchQueryLimit);

                    companies.forEach(comp -> {
                        if (companyId == comp.getId() && comp.getSiteType() == talent.title) {
                            runGetJobsData(searchQuery, searchQueryLimit, talent, comp);
                            done = true;
                        }

                        else if (companyId == comp.getId() && comp.getSiteType() == remoteok.title) {
                            runGetJobsData(searchQuery, searchQueryLimit, remoteok, comp);
                            done = true;
                        }

                        else if (companyId == comp.getId() && comp.getSiteType() == simplyhired.title) {
                            runGetJobsData(searchQuery, searchQueryLimit, simplyhired, comp);
                            done = true;
                        }

                        else if (companyId == comp.getId() && comp.getSiteType() == indeed.title) {
                            runGetJobsData(searchQuery, searchQueryLimit, indeed, comp);
                            done = true;
                        }

                        else if (companyId == comp.getId() && comp.getSiteType() == glassdoor.title) {
                            runGetJobsData(searchQuery, searchQueryLimit, glassdoor, comp);
                            done = true;
                        }
                    });
                    in.close();
                } else if (chooseJobSites == 2) {
                    int searchLimit;
                    String choices;

                    OUT.printf(
                            "Great! we'll look for job %s -Please choose between the following companies to pull from \n",
                            searchQuery);
                    OUT.println(
                            "To choose multiple companies Add a comma to seperate them: Exp: 1,2 = Company 1 and 2 \n");

                    companies.forEach(jobs -> {
                        OUT.printf("(id %s), Company Name: %s \n", jobs.getId(), jobs.getTitle());
                    });

                    choices = in.nextLine();

                    if (!(choices.isEmpty())) {
                        OUT.println("How many jobs would you like to pull? ");
                        searchLimit = in.nextInt();

                        String[] c = choices.replace(",", "").split("");
                        for (int i = 0; i < c.length; i++) {
                            int jobIdx = Integer.parseInt(c[i]);

                            companies.forEach(comp -> {
                                if (comp.getId() == jobIdx) {
                                    OUT.printf("\n Running companies: id: %s company: %s \n", comp.getId(),
                                            comp.getTitle());

                                    if (comp.getSiteType() == talent.title) {
                                        ScraperThreads sc = new ScraperThreads(searchQuery, searchLimit, talent, comp);
                                        sc.run();
                                    }

                                    else if (comp.getSiteType() == remoteok.title) {
                                        ScraperThreads sc = new ScraperThreads(searchQuery, searchLimit, remoteok,
                                                comp);
                                        sc.run();
                                    }

                                    else if (comp.getSiteType() == glassdoor.title) {
                                        ScraperThreads sc = new ScraperThreads(searchQuery, searchLimit, glassdoor,
                                                comp);
                                        sc.run();
                                    }

                                    else if (comp.getSiteType() == simplyhired.title) {
                                        ScraperThreads sc = new ScraperThreads(searchQuery, searchLimit, simplyhired,
                                                comp);
                                        sc.run();
                                    }

                                    else if (comp.getSiteType() == indeed.title) {
                                        ScraperThreads sc = new ScraperThreads(searchQuery, searchLimit, indeed,
                                                comp);
                                        sc.run();
                                    }
                                }
                            });
                            done = true;
                        }

                    }
                }

            } catch (InputMismatchException e) {
                OUT.println("Hey you didn't enter a valid number or the value is not (1) or (2)");
            }

        } while ((chooseJobSites != 1 || chooseJobSites != 2) && !done);
    }
}
