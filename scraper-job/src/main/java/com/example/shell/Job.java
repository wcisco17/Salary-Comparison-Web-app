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


    /**
     * @return String
     */
    public String getCompanyName() {
        return this.companyName;
    }


    /**
     * @return String
     */
    public String getJobTitle() {
        return this.jobTitle;
    }


    /**
     * @return String
     */
    public String getJobType() {
        return this.jobType;
    }


    /**
     * @return String
     */
    public String getUrl() {
        return this.url;
    }


    /**
     * @return String
     */
    public String getLocation() {
        return this.location;
    }


    /**
     * @return String
     */
    public String getShortDescription() {
        return this.shortDescription;
    }


    /**
     * @return String
     */
    public String getSalary() {
        return this.salary;
    }


    /**
     * @return String
     */
    public String getLogo() {
        return this.logo;
    }

}
