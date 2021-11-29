package com.example;

import java.io.IOException;

import com.example.scraper.ExcecuteDB;

public final class App {
    // private static String[] websites = {"RemoteOK", "Indeed", "Glassdoor",
    // "AngelCo"};
    // Function that basically runs the Prompts to look up the websites
    public static void main(String[] args) {
        try {
            ExcecuteDB.main();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
