package com.example.scraper;

import java.io.IOException;
import java.util.Collection;
import java.util.Optional;

import com.example.shell.Company;
import com.example.shell.Job;
import com.example.sql.DAO;
import com.example.sql.PsqlJobs;
import com.example.sql.PsqlWebsite;

public class ExcecuteDB {
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

    public static void main() throws IOException {
        // Remoteok remoteOk = new Remoteok(1, "https://remoteok.io/", "RemoteOk",
        // "https://remoteok.com/cdn-cgi/image/format=auto,fit=contain,width=100,height=100,quality=85/https://remoteok.com/assets/logo-square.png?1633381266",
        // SiteType.REMOTEOK);

        // Talent talent = new Talent(2, "https://www.talent.com", "Talent",
        // "https://www.talent.com/public/assets/img/icon-talent-t-logo.png",
        // SiteType.TALENT);

        // Indeed indeed = new Indeed(3, "https://www.indeed.com", "Indeed",
        // "https://media-exp1.licdn.com/dms/image/C4E0BAQEYTvj7n4hMFw/company-logo_200_200/0/1625170511386?e=1646265600&v=beta&t=qDJZxmQx-Kgg9gVOeZxaPtPQcyCSR30LNlUh6kwVJqA",
        // SiteType.INDEED);

        // Glassdoor glassdoor = new Glassdoor(4, "https://www.glassdoor.com",
        // "Glassdoor", "", SiteType.GLASSDOOR);
        // glassdoor.getJobsData(12, "React");

        // SimplyHired simplyhired = new SimplyHired(5, "https://www.simplyhired.com",
        // "SimplyHired",
        // "https://d3iouj7udfksni.cloudfront.net/static/base/img/sh-logo-wordmark.png",
        // SiteType.SIMPLYHIRED);

        // addCompany(simplyhired, null, null);
        // angelco.getJobsData(12, "React");

        // Collection<Job> glassdoorJob = indeed.getJobsData(13, "Software Engineer");

        // for (Job job : glassdoorJob) {
        // addJob(job, Optional.of(indeed.getId()), null);
        // }
    }
}
