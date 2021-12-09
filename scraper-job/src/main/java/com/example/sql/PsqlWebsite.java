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

import com.example.shell.Company;
import com.example.shell.SiteType;

public class PsqlWebsite implements DAO<Company, String> {
    private static final Logger LOGGER = Logger.getLogger(PsqlWebsite.class.getName());
    private final Optional<Connection> connection;

    public PsqlWebsite() {
        this.connection = PSQLConnection.getConnection();
    }


    /**
     * @return Collection<Company>
     */
    @Override
    public Collection<Company> getAll() {
        Collection<Company> companies = new ArrayList<>();
        String sql = "SELECT * FROM \"Website\"";

        connection.ifPresent(conn -> {
            try (Statement statement = conn.createStatement(); ResultSet resultSet = statement.executeQuery(sql)) {
                while (resultSet.next()) {
                    int id = resultSet.getInt("id");
                    String url = resultSet.getString("url");
                    String title = resultSet.getString("title");
                    String logo = resultSet.getString("logo");
                    String siteType = resultSet.getString("type").toString();

                    Company company = new Company(id, url, title, logo, SiteType.valueOf(siteType));

                    companies.add(company);
                }
            } catch (SQLException ex) {
                LOGGER.log(Level.SEVERE, null, ex);
            }
        });
        return companies;
    }


    /**
     * @param id
     * @return Optional<Company>
     */
    @Override
    public Optional<Company> get(Integer id) {
        return connection.flatMap(conn -> {
            Optional<Company> company = Optional.empty();
            String sql = "SELECT * FROM \"Website\" WHERE id = " + id;
            try (Statement statement = conn.createStatement(); ResultSet resultSet = statement.executeQuery(sql);) {
                if (resultSet.next()) {
                    String url = resultSet.getString("url");
                    String title = resultSet.getString("title");
                    String logo = resultSet.getString("logo");
                    String siteType = resultSet.getString("type").toString();

                    company = Optional.of(
                            new Company(id, url, title, logo, SiteType.valueOf(siteType)));
                    LOGGER.log(Level.SEVERE, "Found {0} in database", company.get());
                }
            } catch (SQLException ex) {
                LOGGER.log(Level.SEVERE, null, ex);
            }

            return company;
        });
    }


    /**
     * @param company
     * @param s
     * @param id
     * @return Optional<String>
     */
    @Override
    public Optional<String> save(Company company, Optional<Integer> s, Optional<Integer> id) {
        String errorMessage = "The company to be added must not be null";
        Company nonNullCompany = Objects.requireNonNull(company, errorMessage);
        String sql = "INSERT INTO " + "\"Website\"(id, url, title, logo, type) " + "VALUES(?, ?, ?, ?, ?)";

        return connection.flatMap(conn -> {
            Optional<String> generateId = Optional.empty();

            try (PreparedStatement statement = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                statement.setInt(1, nonNullCompany.getId());
                statement.setString(2, nonNullCompany.getUrl());
                statement.setString(3, nonNullCompany.getTitle());
                statement.setString(4, nonNullCompany.getLogo());
                statement.setString(5, nonNullCompany.getSiteType().toString());

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
    public void update(Company company) {
        String errorMessage = "The company to be updated must not be null";
        Company nonNullCompany = Objects.requireNonNull(company, errorMessage);
        String sql = "UPDATE \"Website\" "
                + "SET "
                + "url = ?, "
                + "title = ?, "
                + "logo = ?, "
                + "type = ? "
                + "WHERE "
                + "id = ?";

        connection.ifPresent(conn -> {
            try (PreparedStatement statement = conn.prepareStatement(sql)) {
                statement.setString(1, nonNullCompany.getUrl());
                statement.setString(2, nonNullCompany.getTitle());
                statement.setString(3, nonNullCompany.getLogo());
                statement.setString(4, nonNullCompany.getSiteType().toString());
                statement.setInt(5, nonNullCompany.getId());

                int numUpdatedRows = statement.executeUpdate();

                LOGGER.log(Level.INFO, "Was the customer updated successfully {0}", numUpdatedRows > 0);
            } catch (SQLException ex) {
                LOGGER.log(Level.SEVERE, null, ex);
            }
        });
    }

}

