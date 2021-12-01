// username: ramili7526@terasd.com
// password: "7H^e%7bFbfY!wWJ!"
package com.example.scraper.glassdoor;

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

public class Glassdoor implements Scraper<Job> {
    public SiteType title = SiteType.GLASSDOOR;
    private static String websiteUrl = "https://www.indeed.com";

    @Override
    public Collection<Job> getJobsData(int jobLimit, String search) throws IOException {
        String fakeUsername = "ramili7526@terasd.com";
        String fakePassword = "7H^e%7bFbfY!wWJ!";

        System.setProperty("webdriver.chrome.driver",
                "/Users/williamssissoko/Desktop/MDX/ADVANCED-WEB-CLASS/coursework1/salary-comp/scraper-job/src/main/java/com/example/scraper/chromedriver");
        ChromeDriver driver = new ChromeDriver();
        Collection<Job> companies = new ArrayList<Job>();

        try {
            driver.get(websiteUrl);
            driver.findElement(By.cssSelector(".d-none.d-lg-block.p-0.LockedHomeHeaderStyles__signInButton")).click();
            driver.findElement(By.cssSelector("#userEmail")).sendKeys(fakeUsername + Keys.ENTER);
            driver.findElement(By.cssSelector("#userPassword")).sendKeys(fakePassword + Keys.ENTER);
            driver.get(websiteUrl);

            driver.get(websiteUrl + "/Job/jobs.htm?sc.keyword=" + search + "&minSalary=64000&maxSalary=159000");

            String pageSource = driver.getPageSource();
            companies = mapJobsData(jobLimit, pageSource, search);
        } catch (Exception e) {
            System.out.println("Error while getting ChromeDriver = " + e);
        }

        return companies;
    }

    @Override
    public Collection<Job> mapJobsData(int jobLimit, String input, String jobType) throws IOException {
        Collection<Job> glassDoor = new ArrayList<Job>();
        Document doc = Jsoup.parse(input);

        for (int i = 0; i < jobLimit; i++) {
            String logo = "";
            String companyName = doc.selectXpath("//a[@class=' job-search-key-l2wjgv e1n63ojh0 jobLink']").get(i)
                    .text();
            String jobTitle = doc.selectXpath("//a[@data-test='job-link']").get(i).text();
            String location = doc
                    .selectXpath("//span[@class='css-1buaf54 pr-xxsm job-search-key-iii9i8 e1rrn5ka4']").get(i)
                    .text();
            String salary = doc.selectXpath("//span[@data-test='detailSalary']").get(i).text(); // you must click
                                                                                                // salary
            String jobId = doc.select("li[data-brandviews*=BRAND:n]").get(i).attr("data-id");

            String formatCompJob = jobTitle.replace("(", "").replace(")", "").replace(" ", "-").replace("/", "")
                    .replace("--", "-").replace(",", "").toLowerCase() + "-"
                    + companyName.replace(",", "").replace(" ", "-").toLowerCase();

            String url = "https://www.glassdoor.com/job-listing/" + formatCompJob + "?jl=" + jobId;
            System.out.println(url + "\n \n");
            String shortDescription = "";

            // only get the ones with a job
            if (i != -1) {
                String xpath = "img[title='" + companyName + " Logo']";
                logo = doc.select(xpath).attr("src");
            } else
                logo = "no-logo";

            Job job = new Job(companyName, jobTitle, salary, logo, url, location, shortDescription, jobType);
            glassDoor.add(job);
        }
        return glassDoor;
    }

    @Override
    public void init() throws IOException {
    }
}
