package com.example.shell;

public class Company {
    private Integer id;
    private String url;
    private String title;
    private String logo;
    private SiteType type;

    public Company(Integer id, String url, String title, String logo, SiteType type) {
        this.id = id;
        this.url = url;
        this.title = title;
        this.logo = logo;
        this.type = type;
    }

    public Integer getId() {
        return this.id;
    }

    public SiteType getSiteType() {
        return this.type;
    }

    public String getLogo() {
        return this.logo;
    }

    public String getTitle() {
        return this.title;
    }

    public String getUrl() {
        return this.url;
    }

    public Object siteId(String t) {
        return t;
    }
}
