const express = require('express');
const router = express.Router();
const listController = require("./../../app/controllers/listController");
const appConfig = require("./../../config/appConfig");
const auth = require('../middlewares/auth');

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/lists`;

    // defining routes.

    // get all private list by userId
    app.get(`${baseUrl}/getAll/private/:userId`, auth.isAuthorize, listController.getAllPrivateList);

    /**
     * @apiGroup List
     * @apiVersion  1.0.0
     * @api {get} /api/v1/lists/getAll/private/:userId Get all private list by userId.
     *
     * @apiParam {string} userId userId of the list. (route params) (required)
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "All Lists Listed",
            "status": 200,
            "data": [
                "createdBy": string,
                "createdOn": date,
                "listId": string,
                "listName": string,
                "private": boolean
            ]
        }
        @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "No Lists Found",
	    "status": 500,
	    "data": null
	   }
    */

    // get all public list by userId
    app.get(`${baseUrl}/getAll/public/:userId`, auth.isAuthorize, listController.getAllPublicList);

    /**
     * @apiGroup List
     * @apiVersion  1.0.0
     * @api {get} /api/v1/lists/getAll/public/:userId Get all public list by userId.
     *
     * @apiParam {string} userId userId of the list. (route params) (required)
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "All Lists Listed",
            "status": 200,
            "data": [
                "createdBy": string,
                "createdOn": date,
                "listId": string,
                "listName": string,
                "private": boolean
            ]
        }
        @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "No Lists Found",
	    "status": 500,
	    "data": null
	   }
    */

    // get a particular list by listId
    app.get(`${baseUrl}/getList/:listId`, auth.isAuthorize, listController.getAList);

    /**
     * @apiGroup List
     * @apiVersion  1.0.0
     * @api {get} /api/v1/lists/getList/:listId Get a particular list by listId.
     *
     * @apiParam {string} listId listId of the list. (route params) (required)
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "List Found",
            "status": 200,
            "data": {
                "createdBy": string,
                "createdOn": date,
                "listId": string,
                "listItems": [
                    "createdBy": string,
                    "createdOn": date,
                    "itemId": string,
                    "itemName": string,
                    "parentId": string,
                    "status": string
                ],
                "listName": string,
                "private": boolean
            }
        }
        @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "No such list found",
	    "status": 500,
	    "data": null
	   }
    */

    // create a list
    app.post(`${baseUrl}/create/list`, auth.isAuthorize, listController.createAList);

    /**
     * @apiGroup List
     * @apiVersion  1.0.0
     * @api {post} /api/v1/lists/create/list Create a list.
     *
     * @apiParam {string} listName listName of the list. (body params) (required)
     * @apiParam {string} private private of the list. (body params) (required)
     * @apiParam {string} createdBy createdBy of the list. (body params) (required)
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "New list added successfully",
            "status": 200,
            "data": [
                "createdBy": string,
                "createdOn": date,
                "listId": string,
                "listName": string,
                "private": boolean
            ]
        }
        @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed to create new list",
	    "status": 500,
	    "data": null
	   }
    */

    // create a list item
    app.post(`${baseUrl}/create/item`, auth.isAuthorize, listController.createAItem);

    /**
     * @apiGroup List
     * @apiVersion  1.0.0
     * @api {post} /api/v1/lists/create/item Create a list item.
     *
     * @apiParam {string} listId listId of the list. (body params) (required)
     * @apiParam {string} itemName itemName of the list. (body params) (required)
     * @apiParam {string} parentId parentId of the list. (body params) (required)
     * @apiParam {string} status status of the list. (body params) (required)
     * @apiParam {string} createdBy createdBy of the list. (body params) (required)
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "List item added successfully",
            "status": 200,
            "data": {
                "createdBy": string,
                "createdOn": date,
                "listId": string,
                "listItems": [
                    "createdBy": string,
                    "createdOn": date,
                    "itemId": string,
                    "itemName": string,
                    "parentId": string,
                    "status": string
                ],
                "listName": string,
                "private": boolean
            }
        }
        @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed to create a new item",
	    "status": 500,
	    "data": null
	   }
    */

    // edit a list with it's items
    // why post req because I am creating a new list always due to track undo
    app.post(`${baseUrl}/edit/list/:listId`, auth.isAuthorize, listController.editAList);

    /**
     * @apiGroup List
     * @apiVersion  1.0.0
     * @api {post} /api/v1/lists/edit/list/:listId Edit a list with it's items.
     *
     * @apiParam {string} listId listId of the list. (route params) (required)
     * @apiParam {string} listItems[] listItems[] of the list. (body params) (required)
     * @apiParam {string} private private of the list. (body params) (required)
     * @apiParam {string} listName listName of the list. (body params) (required)
     * @apiParam {string} createdBy createdBy of the list. (body params) (required)
     * @apiParam {string} createdBy createdBy of the list. (body params) (required)
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "List update successfully",
            "status": 200,
            "data": {
                "createdBy": string,
                "createdOn": date,
                "listId": string,
                "listItems": [
                    "createdBy": string,
                    "createdOn": date,
                    "itemId": string,
                    "itemName": string,
                    "parentId": string,
                    "status": string
                ],
                "listName": string,
                "private": boolean
            }
        }
        @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed to update a list",
	    "status": 500,
	    "data": null
	   }
    */

    // undo list
    app.get(`${baseUrl}/undo/list/:listId`, auth.isAuthorize, listController.undoAList);

    /**
     * @apiGroup List
     * @apiVersion  1.0.0
     * @api {get} /api/v1/lists/undo/list/:listId Undo list.
     *
     * @apiParam {string} listId listId of the list. (route params) (required)
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "List undo successfully",
            "status": 200,
            "data": {
                "createdBy": string,
                "createdOn": date,
                "listId": string,
                "listItems": [
                    "createdBy": string,
                    "createdOn": date,
                    "itemId": string,
                    "itemName": string,
                    "parentId": string,
                    "status": string
                ],
                "listName": string,
                "private": boolean
            }
        }
        @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed to undo a list",
	    "status": 500,
	    "data": null
	   }
    */

    // delete a item
    app.post(`${baseUrl}/delete/item/:listId`, auth.isAuthorize, listController.deleteAItem);

    /**
     * @apiGroup List
     * @apiVersion  1.0.0
     * @api {post} /api/v1/lists/delete/item/:listId Delete a item.
     *
     * @apiParam {string} listId listId of the list. (route params) (required)
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "List item deleted successfully",
            "status": 200,
            "data": {
                "createdBy": string,
                "createdOn": date,
                "listId": string,
                "listItems": [
                    "createdBy": string,
                    "createdOn": date,
                    "itemId": string,
                    "itemName": string,
                    "parentId": string,
                    "status": string
                ],
                "listName": string,
                "private": boolean
            }
        }
        @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed to delete a list item",
	    "status": 500,
	    "data": null
	   }
    */

    // delete a list by listId
    app.post(`${baseUrl}/delete/list`, auth.isAuthorize, listController.deleteAList);

    /**
     * @apiGroup List
     * @apiVersion  1.0.0
     * @api {post} /api/v1/lists/delete/list Delete a list by listId.
     *
     * @apiParam {string} listId listId of the list. (body params) (required)
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "List deleted successfully",
            "status": 200,
            "data": null
        }
        @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed to delete a list",
	    "status": 500,
	    "data": null
	   }
    */

}