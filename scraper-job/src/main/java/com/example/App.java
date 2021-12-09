// File: App.java
// Main class for our program
/**
 * @title App - The main entry of our JAVA program
 *
 * @see main entry: public static void main(String[] args)
 *
 * @author @wcisco17
 */

package com.example;

import java.io.IOException;

import com.example.scraper.ExcecuteDB;

public final class App {

    /**
     * @title Function that basically runs the Prompts to look up the websites
     * @param args
     */
    public static void main(String[] args) {
        try {
            /**
             * Runs the ExcecuteDB class accessing main see
             * {@link com.example.scraper.ExcecuteDB}.
             */
            ExcecuteDB.main();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
