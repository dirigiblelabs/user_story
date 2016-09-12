/* globals $ */
/* eslint-env node, dirigible */

var database = require("db/database");
var datasource = database.getDatasource();

exports.get = function(id) {
	var result = null;
	var connection = datasource.getConnection();
    try {
        var sql = "SELECT * FROM US_PROJECT WHERE PROJECT_ID = ?";
        var statement = connection.prepareStatement(sql);
        statement.setString(1, id);

        var resultSet = statement.executeQuery();
        if (resultSet.next()) {
            result = createEntity(resultSet);
        }
    } finally {
    	connection.close();
	}
	return result;
};

exports.getByUserId = function(userId) {
	var result = [];
	var connection = datasource.getConnection();
    try {
        var sql = "SELECT * FROM US_PROJECT WHERE TOKEN_ID = ?";
        var statement = connection.prepareStatement(sql);
        statement.setString(1, userId);

        var resultSet = statement.executeQuery();
        while (resultSet.next()) {
            result.push(createEntity(resultSet));
        }
    } finally {
    	connection.close();
	}
	return result;
};

exports.create = function(project) {
	var connection = datasource.getConnection();
    try {
        var sql = "INSERT INTO US_PROJECT (PROJECT_ID, NAME, TOKEN_ID) VALUES (?, ?, ?)";
        var statement = connection.prepareStatement(sql);
        project.projectId = datasource.getSequence('PROJECT_ID').next();
        statement.setInt(1, project.projectId);
        statement.setString(2, project.name);
        statement.setString(3, project.tokenId);
        statement.executeUpdate();
    } finally {
    	connection.close();
	}
	return project;
};

exports.update = function(project) {
	var connection = datasource.getConnection();
    try {
        var sql = "UPDATE US_PROJECT SET NAME = ? WHERE PROJECT_ID = ?";
        var statement = connection.prepareStatement(sql);
        statement.setString(1, project.name);
        statement.setInt(2, project.projectId);
        statement.executeUpdate();
    } finally {
    	connection.close();
	}
	return project;
};

exports.delete = function(id) {
	var connection = datasource.getConnection();
    try {
        var sql = "DELETE FROM US_PROJECT WHERE PROJECT_ID = ?";
        var statement = connection.prepareStatement(sql);
        statement.setInt(1, id);
        statement.executeUpdate();
    } finally {
    	connection.close();
	}
};

exports.deleteByUserId = function(userId) {
	var connection = datasource.getConnection();
    try {
        var sql = "DELETE FROM US_PROJECT WHERE TOKEN_ID = ?";
        var statement = connection.prepareStatement(sql);
        statement.setString(1, userId);
        statement.executeUpdate();
    } finally {
    	connection.close();
	}
};

function createEntity(resultSet) {
	var entity = {
		'projectId': resultSet.getInt("PROJECT_ID"),
		'name': resultSet.getString("NAME"),
		'tokenId': resultSet.getString("TOKEN_ID")
	};
	// TODO fetch user stories!
    return entity;
}
