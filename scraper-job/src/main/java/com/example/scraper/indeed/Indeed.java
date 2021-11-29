package com.example.scraper.indeed;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.example.shell.Company;
import com.example.shell.Job;
import com.example.shell.Scraper;
import com.example.shell.SiteType;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.openqa.selenium.chrome.ChromeDriver;

public class Indeed extends Company implements Scraper<Job> {

    public Indeed(Integer id, String url, String title, String logo, SiteType type) {
        super(id, url, title, logo, type);
    }

    public Collection<Job> getJobsData(int jobLimit, String search) throws IOException {
        System.setProperty("webdriver.chrome.driver",
                "/Users/williamssissoko/Desktop/MDX/ADVANCED-WEB-CLASS/coursework1/salary-comp/scraper-job/src/main/java/com/example/scraper/chromedriver");
        ChromeDriver driver = new ChromeDriver();
        Collection<Job> companies = new ArrayList<Job>();

        try {
            driver.get(this.getUrl());

            driver.get(this.getUrl() + "/q-" + search.replace(" ", "+") + "-" + "$100,000-jobs.html");

            String pageSource = driver.getPageSource();

            companies = mapJobsData(jobLimit, pageSource, search);
        } catch (Exception e) {
            System.out.println("Error while getting ChromeDriver = " + e);
        }

        return companies;
    }

    public Collection<Job> mapJobsData(int jobLimit, String input, String jobType) throws IOException {
        Collection<Job> indeedJobs = new ArrayList<Job>();

        Document doc = Jsoup.parse(input);
        // get all companies
        List<String> allCompanies = new ArrayList<String>();
        for (int i = 0; i < jobLimit; i++) {
            String companies = doc.select(".resultContent").get(i).text();
            allCompanies.add(companies);
        }

        List<Integer> salariesIdx = getCompaniesWithSalaries(allCompanies);
        for (int s = 0; s < salariesIdx.size(); s++) {
            Integer sIdx = salariesIdx.get(s);
            String companyName = doc.select("span.companyName").get(sIdx).text();
            String jobTitle = doc.select("h2.jobTitle").get(sIdx).text();
            String location = doc.select(".companyLocation").get(sIdx).text();
            String shortDescription = doc.select(".job-snippet").get(sIdx).text();
            String salary = doc.select(".metadata.salary-snippet-container").get(s).text();
            String logo = s + "-" + "none";
            // class="tapItem fs-unmask

            String url = "";
            url = "https://www.indeed.com" + doc.select("a[class*=tapItem]").get(s).attr("href");

            Job job = new Job(companyName, jobTitle, salary, logo, url, location, shortDescription, jobType);
            indeedJobs.add(job);
        }

        return indeedJobs;
    }

    private static List<Integer> getCompaniesWithSalaries(List<String> allCompanies) {
        List<Integer> salariesIdx = new ArrayList<Integer>();
        for (int i = 0; i < allCompanies.size(); i++) {
            String[] values = allCompanies.get(i).split(" ");
            for (int j = 0; j < values.length; j++) {
                if ((values[j].indexOf("year") != -1)) {
                    salariesIdx.add(i);
                }
            }
        }
        return salariesIdx;
    }

    public void init() {

    }
}
