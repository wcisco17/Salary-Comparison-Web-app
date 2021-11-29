package com.example.shell;

public class Job {
    public final String companyName, jobTitle, salary, logo, url, location, shortDescription, jobType;
    public Integer id;

    public Job(String companyName, String jobTitle, String salary, String logo, String url, String location,
            String shortDescription, String jobType) {
        this.companyName = companyName;
        this.jobTitle = jobTitle;
        this.salary = salary;
        this.logo = logo;
        this.url = url;
        this.location = location;
        this.shortDescription = shortDescription;
        this.jobType = jobType;
    }

    public String getCompanyName() {
        return this.companyName;
    }

    public String getJobTitle() {
        return this.jobTitle;
    }

    public String getJobType() {
        return this.jobType;
    }

    public String getUrl() {
        return this.url;
    }

    public String getLocation() {
        return this.location;
    }

    public String getShortDescription() {
        return this.shortDescription;
    }

    public String getSalary() {
        return this.salary;
    }

    public String getLogo() {
        return this.logo;
    }

}
