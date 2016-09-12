/* globals $ */
/* eslint-env node, dirigible */

var request = require('net/http/request');
var response = require('net/http/response');

var userStoryDao = require('us/dao/userStoryDao');
var projectDao = require('us/dao/projectDao');
var httpUtils = require('us/utils/httpUtils');
var commonUtils = require('us/utils/commonUtils');

dispatchRequest(request, response);

function dispatchRequest(httpRequest, httpResponse) {
	switch(httpRequest.getMethod()) {
		case 'GET':
			handleGetRequest(httpRequest, httpResponse);
			break;
		case 'POST': 
			handlePostRequest(httpRequest, httpResponse);
			break;
		case 'DELETE':
			handleDeleteRequest(httpRequest, httpResponse);
			break;
		default:
			handleNotAllowedRequest(httpResponse);
	}
}

function handleGetRequest(httpRequest, httpResponse) {
	var userStoryId = httpRequest.getParameter('userStoryId');
	var projectId = httpRequest.getParameter('projectId');
	
	if (userStoryId && projectId) {
		httpUtils.sendResponse(httpResponse, httpResponse.BAD_REQUEST, 'text/plain', 'Only one of the \'userStoryId\' or \'projectId\' query parameters should be supplied');
	} else if (userStoryId) {
		var userStory = userStoryDao.get(userStoryId);
		if (userStory) {
			httpUtils.sendResponse(httpResponse, httpResponse.OK, 'application/json', JSON.stringify(userStory));
		} else {
			httpUtils.sendResponse(httpResponse, httpResponse.NOT_FOUND, 'text/plain', 'No user story found with \'userStoryId\'=' + userStoryId);
		}
	} else if (projectId) {
		var userStories = userStoryDao.getByProjectId(projectId);
		httpUtils.sendResponse(httpResponse, httpResponse.OK, 'application/json', JSON.stringify(userStories));
	} else {
		httpUtils.sendResponse(httpResponse, httpResponse.BAD_REQUEST, 'text/plain', 'Either \'userStoryId\' or \'projectId\' query parameter should be supplied');
	}
}

function handlePostRequest(httpRequest, httpResponse) {
	var userStory = httpUtils.getRequestBody(httpRequest);
	if (isValidUserStory(userStory)) {
		if (hasValidProject(userStory)) {
			var persistedUserStory = null;
			if (userStory.userStoryId) {
				if (userStoryDao.get(userStory.userStoryId)) {
					persistedUserStory = userStoryDao.update(userStory);
				} else {
					httpUtils.sendResponse(httpResponse, httpResponse.NOT_FOUND, 'text/plain', 'No user story found with \'userStoryId\'=' + userStory.userStoryId);
				}
			} else {
				persistedUserStory = userStoryDao.create(userStory);
			}
			httpUtils.sendResponse(httpResponse, httpResponse.CREATED, 'text/plain', persistedUserStory.userStoryId);
		} else {
			httpUtils.sendResponse(httpResponse, httpResponse.BAD_REQUEST, 'text/plain', 'No project found with \'projectId\'=' + userStory.projectId);
		}
	} else {
		httpUtils.sendResponse(httpResponse, httpResponse.BAD_REQUEST);
	}
}

function handleDeleteRequest(httpRequest, httpResponse) {
	var userStoryId = httpRequest.getParameter('userStoryId');
	var projectId = httpRequest.getParameter('projectId');
		
	if (userStoryId && projectId) {
		httpUtils.sendResponse(httpResponse, httpResponse.BAD_REQUEST, 'text/plain', 'Only one of the \'userStoryId\' or \'projectId\' query parameters should be supplied');
	} else if (userStoryId) {
		var userStory = userStoryDao.get(userStoryId);
		if (userStory) {
			userStoryDao.delete(userStoryId);
			httpUtils.sendResponse(httpResponse, httpResponse.OK);
		} else {
			httpUtils.sendResponse(httpResponse, httpResponse.NOT_FOUND, 'text/plain', 'No user story found with \'userStoryId\'=' + userStoryId);
		}
	} else if (projectId) {
		if (userStoryDao.getByProjectId(projectId)) {
			userStoryDao.deleteByProjectId(projectId);
			httpUtils.sendResponse(httpResponse, httpResponse.OK);
		} else {
			httpUtils.sendResponse(httpResponse, httpResponse.NOT_FOUND, 'text/plain', 'No user story found with \'projectId\'=' + projectId);
		}
	} else {
		httpUtils.sendResponse(httpResponse, httpResponse.BAD_REQUEST, 'text/plain', 'Either \'userStoryId\' or \'projectId\' query parameter should be supplied');
	}
}

function handleNotAllowedRequest(httpResponse) {
	httpUtils.sendResponse(httpResponse, httpResponse.METHOD_NOT_ALLOWED);
}

function isValidUserStory(userStory) {
	return userStory && commonUtils.isNotNull([userStory.projectId]);
}

function hasValidProject(userStory) {
	return projectDao.get(userStory.projectId) !== null;
}
