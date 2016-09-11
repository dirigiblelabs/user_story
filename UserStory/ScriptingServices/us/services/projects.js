/* globals $ */
/* eslint-env node, dirigible */

var request = require('net/http/request');
var response = require('net/http/response');

var userDao = require('us/dao/userDao');
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
			// TODO 
			break;
		default:
			handleNotAllowedRequest(httpResponse);
	}
}

function handleGetRequest(httpRequest, httpResponse) {
	var projectId = httpRequest.getParameter('projectId');
	var userId = httpRequest.getParameter('userId');
	
	if (projectId && userId) {
		httpUtils.sendResponse(httpResponse, httpResponse.BAD_REQUEST, 'text/plain', 'Only one of the \'projectId\' or \'userId\' query parameters should be supplied');
	} else if (!projectId && !userId) {
	} else if (projectId) {
		var project = projectDao.get(projectId);
		if (project) {
			httpUtils.sendResponse(httpResponse, httpResponse.OK, 'application/json', JSON.stringify(project));
		} else {
			httpUtils.sendResponse(httpResponse, httpResponse.NOT_FOUND, 'text/plain', 'No project found with \'projectId\'=' + projectId);
		}
	} else if (userId) {
		var projects = projectDao.getByUserId(userId);
		if (projects) {
			httpUtils.sendResponse(httpResponse, httpResponse.OK, 'application/json', JSON.stringify(projects));
		} else {
			httpUtils.sendResponse(httpResponse, httpResponse.NOT_FOUND, 'text/plain', 'No projects found with \'userId\'=' + userId);
		}
	} else {
		httpUtils.sendResponse(httpResponse, httpResponse.BAD_REQUEST, 'text/plain', 'Either \'projectId\' or \'userId\' query parameter should be supplied');
	}
}

function handlePostRequest(httpRequest, httpResponse) {
	var project = httpUtils.getRequestBody(httpRequest);
	if (isValidProject(project)) {
		if (hasValidUser(project)) {
			var persistedProject = null;
			if (project.projectId) {
				if (projectDao.get(project.projectId)) {
					persistedProject = projectDao.update(project);
				} else {
					httpUtils.sendResponse(httpResponse, httpResponse.NOT_FOUND, 'text/plain', 'No project found with \'projectId\'=' + project.projectId);
				}
			} else {
				persistedProject = projectDao.create(project);
			}
			httpUtils.sendResponse(httpResponse, httpResponse.CREATED, 'text/plain', persistedProject.projectId);
		} else {
			httpUtils.sendResponse(httpResponse, httpResponse.BAD_REQUEST, 'text/plain', 'No user found with \'tokenId\'=' + project.tokenId);
		}
	} else {
		httpUtils.sendResponse(httpResponse, httpResponse.BAD_REQUEST);
	}
}

function handleNotAllowedRequest(httpResponse) {
	httpUtils.sendResponse(httpResponse, httpResponse.METHOD_NOT_ALLOWED);
}

function isValidProject(project) {
	return project && commonUtils.isNotNull([project.name, project.tokenId]);
}

function hasValidUser(project) {
	return userDao.get(project.tokenId) !== null;
}
