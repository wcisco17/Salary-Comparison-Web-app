package com.example.scraper.simplyhired;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

import com.example.shell.Job;
import com.example.shell.Scraper;
import com.example.shell.SiteType;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.chrome.ChromeDriver;

public class SimplyHired implements Scraper<Job> {
    public SiteType title = SiteType.SIMPLYHIRED;
    private static String websiteUrl = "https://www.simplyhired.com";

    @Override
    public Collection<Job> getJobsData(int jobLimit, String search) throws IOException {
        System.setProperty("webdriver.chrome.driver",
                "/Users/williamssissoko/Desktop/MDX/ADVANCED-WEB-CLASS/coursework1/salary-comp/scraper-job/src/main/java/com/example/scraper/chromedriver");
        ChromeDriver driver = new ChromeDriver();
        Collection<Job> companies = new ArrayList<Job>();

        try {
            driver.get(websiteUrl);

            driver.findElement(By.cssSelector("#SearchForm-whatInput")).sendKeys(search + Keys.ENTER);

            String pageSource = driver.getPageSource();
            companies = mapJobsData(jobLimit, pageSource, search);
            for (Job comp : companies) {
                System.out.println(comp);
            }
        } catch (Exception e) {
            System.out.println("Error while getting ChromeDriver = " + e);
        }

        return companies;
    }

    @Override
    public Collection<Job> mapJobsData(int jobLimit, String input, String jobType) throws IOException {
        Collection<Job> simplyhiredJobs = new ArrayList<Job>();
        Document doc = Jsoup.parse(input);
        for (int i = 0; i < jobLimit; i++) {
            String companyName = doc.select("span.JobPosting-labelWithIcon.jobposting-company").get(i).text();
            String salary = doc.select("div.SerpJob-metaInfo > div.SerpJob-metaInfoLeft").get(i).text();
            salary = salary.replace("Estimated:", "").replace("a year Quick Apply", "").replace("a year", "");
            String logo = "no-log";
            String jobTitle = doc.select("a.SerpJob-link.card-link").get(i).text();
            String location = doc.select("span.jobposting-location").get(i).text();

            String url = websiteUrl + doc.select("a[href*=/job/]").get(i).attr("href");

            String shortDescription = doc.select("div.SerpJob-snippetContainer > p.jobposting-snippet").get(i).text();
            Job job = new Job(companyName, jobTitle, salary, logo, url, location, shortDescription, jobType);
            simplyhiredJobs.add(job);
        }
        return simplyhiredJobs;
    }

    @Override
    public void init() throws IOException {
    }
}
