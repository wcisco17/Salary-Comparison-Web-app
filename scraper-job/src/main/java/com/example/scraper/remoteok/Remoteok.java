/**
 * @class Remoteok - Getting all the jobs from Remoteok
 * @author  Williams Sissoko
 */

package com.example.scraper.remoteok;

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

public class Remoteok implements Scraper<Job> {
    public SiteType title = SiteType.REMOTEOK;
    public String websiteUrl = "https://remoteok.io";


    /**
     * @see com.example.shell.Scraper for interface
     * @param jobLimit
     * @param search
     * @return Collection<Job>
     * @throws IOException
     */
    @Override
    public Collection<Job> getJobsData(int jobLimit, String search) throws IOException {
        System.setProperty("webdriver.chrome.driver",
                "/Users/williamssissoko/Desktop/MDX/ADVANCED-WEB-CLASS/coursework1/salary-comp/scraper-job/src/main/java/com/example/scraper/chromedriver");
        ChromeDriver driver = new ChromeDriver();
        Collection<Job> companies = new ArrayList<Job>();

        try {
            driver.get(websiteUrl);
            driver.findElement(By.cssSelector(".search")).sendKeys(search + Keys.ENTER);
            String pageSource = driver.getPageSource();
            companies = mapJobsData(jobLimit, pageSource, search);
        } catch (Exception e) {
            System.out.println("Error while getting ChromeDriver = " + e);
        }
        return companies;
    }


    /**
     * @param jobLimit
     * @param input
     * @param type
     * @return Collection<Job>
     * @throws IOException
     */
    @Override
    public Collection<Job> mapJobsData(int jobLimit, String input, String type)
            throws IOException {
        Collection<Job> remoteOkJobs = new ArrayList<Job>();
        Document doc = Jsoup.parse(input);
        for (int i = 0; i < jobLimit; i++) {
            // Grab values from website
            String jobType = type;
            String companyName = doc.selectXpath("//h3[@itemprop='name']").get(i).text();
            String jobTitle = doc.selectXpath("//h2[@itemprop='title']").get(i).text();
            String salary = doc.select("div:containsOwn(💰)").not("div.markdown").get(i).text();
            String logo = doc.select("img[^data-src]").get(i).attr("src");
            String url = websiteUrl + doc.select("a.action-apply").get(i).attr("href");
            String location = doc.select("div.location").not("div.markdown").not("div:containsOwn(💰)").get(i)
                    .text();
            String shortDescription = doc.select("div.description").select("div.markdown").get(i).text();

            // push values into object
            Job job = new Job(companyName, jobTitle, salary, logo, url, location, shortDescription, jobType);
            remoteOkJobs.add(job);
        }
        return remoteOkJobs;
    }


    /**
     * @throws IOException
     */
    public void init() throws IOException {
    }
}
