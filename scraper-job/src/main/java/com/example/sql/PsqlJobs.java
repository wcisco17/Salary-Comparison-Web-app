package com.example.sql;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Objects;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.example.shell.Job;

import io.netty.util.internal.ThreadLocalRandom;

public class PsqlJobs implements DAO<Job, String> {
    private static final Logger LOGGER = Logger.getLogger(PsqlWebsite.class.getName());
    private final Optional<Connection> connection;

    public PsqlJobs() {
        this.connection = PSQLConnection.getConnection();
    }


    /**
     * @return Collection<Job>
     */
    @Override
    public Collection<Job> getAll() {
        Collection<Job> jobs = new ArrayList<>();
        String sql = "SELECT * FROM \"Job\"";

        connection.ifPresent(conn -> {
            try (Statement statement = conn.createStatement(); ResultSet resultSet = statement.executeQuery(sql)) {
                while (resultSet.next()) {
                    String title = resultSet.getString("title");
                    String salary = resultSet.getString("salary");
                    String company_name = resultSet.getString("company_name");
                    String url = resultSet.getString("url");
                    String location = resultSet.getString("location");
                    String shortDescription = resultSet.getString("short_description");
                    String logo = resultSet.getString("logo");
                    String jobType = resultSet.getString("job_type");

                    Job job = new Job(company_name, title, salary, logo, url, location, shortDescription, jobType);

                    jobs.add(job);
                }
            } catch (SQLException ex) {
                LOGGER.log(Level.SEVERE, null, ex);
            }
        });
        return jobs;
    }


    /**
     * @param id
     * @return Optional<Job>
     */
    @Override
    public Optional<Job> get(Integer id) {
        return null;
    }


    /**
     * @param job
     * @param websiteId
     * @param id
     * @return Optional<String>
     */
    @Override
    public Optional<String> save(Job job, Optional<Integer> websiteId, Optional<Integer> id) {
        String errorMessage = "The company to be added must not be null";
        Job nonNullCompany = Objects.requireNonNull(job, errorMessage);
        String sql = "INSERT INTO "
                + "\"Job\"(id, title, salary, company_name,url,\"websiteId\",location,short_description,job_type,logo) "
                + "VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        ;

        return connection.flatMap(conn -> {
            Optional<String> generateId = Optional.empty();

            try (PreparedStatement statement = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                int min = 1;
                int max = 10000000;
                int randomNum = ThreadLocalRandom.current().nextInt(min, max + 1);
                statement.setInt(1, randomNum); // generate your unique ID

                statement.setString(2, nonNullCompany.getJobTitle());
                statement.setString(3, nonNullCompany.getSalary());
                statement.setString(4, nonNullCompany.getCompanyName());
                statement.setString(5, nonNullCompany.getUrl());

                statement.setInt(6, websiteId.get());

                statement.setString(7, nonNullCompany.getLocation());
                statement.setString(8, nonNullCompany.getShortDescription());
                statement.setString(9, nonNullCompany.getJobType());
                statement.setString(10, nonNullCompany.getLogo());

                int numInsertedRows = statement.executeUpdate();
                if (numInsertedRows > 0) {
                    try (ResultSet resultSet = statement.getResultSet()) {
                        if (resultSet != null) {
                            generateId = Optional.of(resultSet.getMetaData().toString());
                        }
                    }
                }

                LOGGER.log(Level.INFO, "Created successfully? {1}",
                        new Object[] { nonNullCompany, (numInsertedRows > 0) });
            } catch (SQLException ex) {
                LOGGER.log(Level.SEVERE, null, ex);
            }

            return generateId;
        });
    }


    /**
     * @param company
     */
    @Override
    public void update(Job company) {
    }
}
