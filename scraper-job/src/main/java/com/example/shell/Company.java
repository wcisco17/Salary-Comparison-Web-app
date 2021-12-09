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


    /**
     * @return Integer
     */
    public Integer getId() {
        return this.id;
    }


    /**
     * @return SiteType
     */
    public SiteType getSiteType() {
        return this.type;
    }


    /**
     * @return String
     */
    public String getLogo() {
        return this.logo;
    }


    /**
     * @return String
     */
    public String getTitle() {
        return this.title;
    }


    /**
     * @return String
     */
    public String getUrl() {
        return this.url;
    }


    /**
     * @param t
     * @return Object
     */
    public Object siteId(String t) {
        return t;
    }
}
