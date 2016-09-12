/* globals $ */
/* eslint-env node, dirigible */

var database = require("db/database");
var datasource = database.getDatasource();

exports.get = function(id) {
	var result = null;
	var connection = datasource.getConnection();
    try {
        var sql = "SELECT * FROM US_USER_STORY WHERE USER_STORY_ID = ?";
        var statement = connection.prepareStatement(sql);
        statement.setInt(1, id);

        var resultSet = statement.executeQuery();
        if (resultSet.next()) {
            result = createEntity(resultSet);
        }
    } finally {
    	connection.close();
	}
	return result;
};

exports.getByProjectId = function(projectId) {
	var result = [];
	var connection = datasource.getConnection();
    try {
        var sql = "SELECT * FROM US_USER_STORY WHERE PROJECT_ID = ?";
        var statement = connection.prepareStatement(sql);
        statement.setInt(1, projectId);

        var resultSet = statement.executeQuery();
        while (resultSet.next()) {
            result.push(createEntity(resultSet));
        }
    } finally {
    	connection.close();
	}
	return result;
};

exports.create = function(userStory) {
	var connection = datasource.getConnection();
    try {
        var sql = "INSERT INTO US_USER_STORY (USER_STORY_ID, WHO, WHY, WHAT, PROJECT_ID) VALUES (?, ?, ?, ?, ?)";
        var statement = connection.prepareStatement(sql);
        userStory.userStoryId = datasource.getSequence('USER_STORY_ID').next();
        statement.setInt(1, userStory.userStoryId);
        statement.setString(2, userStory.who);
        statement.setString(3, userStory.why);
        statement.setString(4, userStory.what);
        statement.setInt(5, userStory.projectId);
        statement.executeUpdate();
    } finally {
    	connection.close();
	}
	return userStory;
};

exports.update = function(userStory) {
	var connection = datasource.getConnection();
    try {
        var sql = "UPDATE US_USER_STORY SET WHO = ?, WHY= ?, WHAT = ? WHERE USER_STORY_ID = ?";
        var statement = connection.prepareStatement(sql);
        statement.setString(1, userStory.who);
        statement.setString(2, userStory.why);
        statement.setString(3, userStory.what);
        statement.setInt(4, userStory.userStoryId);
        statement.executeUpdate();
    } finally {
    	connection.close();
	}
	return userStory;
};

exports.delete = function(id) {
	var connection = datasource.getConnection();
    try {
        var sql = "DELETE FROM US_USER_STORY WHERE USER_STORY_ID = ?";
        var statement = connection.prepareStatement(sql);
        statement.setInt(1, id);
        statement.executeUpdate();
    } finally {
    	connection.close();
	}
};

exports.deleteByProjectId = function(projectId) {
	var connection = datasource.getConnection();
    try {
        var sql = "DELETE FROM US_USER_STORY WHERE PROJECT_ID = ?";
        var statement = connection.prepareStatement(sql);
        statement.setInt(1, projectId);
        statement.executeUpdate();
    } finally {
    	connection.close();
	}
};

function createEntity(resultSet) {
	var entity = {
		'userStoryId': resultSet.getInt("USER_STORY_ID"),
		'who': resultSet.getString("WHO"),
		'why': resultSet.getString("WHY"),
		'what': resultSet.getString("WHAT"),
		'projectId': resultSet.getInt("PROJECT_ID")
	};
    return entity;
}
