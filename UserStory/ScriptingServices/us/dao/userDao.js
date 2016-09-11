/* globals $ */
/* eslint-env node, dirigible */

var database = require("db/database");
var datasource = database.getDatasource();

exports.get = function(id) {
	var result = null;
	var connection = datasource.getConnection();
    try {
        var sql = "SELECT * FROM US_USER WHERE TOKEN_ID = ?";
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

exports.create = function(user) {
	var connection = datasource.getConnection();
    try {
        var sql = "INSERT INTO US_USER (TOKEN_ID, DISPLAY_NAME, GIVEN_NAME, FAMILY_NAME, EMAIL, PHOTO_URL) VALUES (?, ?, ?, ?, ?, ?)";
        var statement = connection.prepareStatement(sql);
        statement.setString(1, user.tokenId);
        statement.setString(2, user.displayName);
        statement.setString(3, user.givenName);
        statement.setString(4, user.familyName);
        statement.setString(5, user.email);
        statement.setString(6, user.photoUrl);
        statement.executeUpdate();
    } finally {
    	connection.close();
	}
};

exports.delete = function(id) {
	throw new Error('Not Implemented');
};

function createEntity(resultSet) {
	var entity = {
		'tokenId': resultSet.getString("TOKEN_ID"),
		'displayName': resultSet.getString("DISPLAY_NAME"),
		'givenName': resultSet.getString("GIVEN_NAME"),
		'familyName': resultSet.getString("FAMILY_NAME"),
		'email': resultSet.getString("EMAIL"),
		'photoUrl': resultSet.getString("PHOTO_URL")
	};
    return entity;
}
