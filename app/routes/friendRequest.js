const express = require('express');
const router = express.Router();
const friendRequestController = require("./../../app/controllers/friendRequestController");
const appConfig = require("./../../config/appConfig");
const auth = require('../middlewares/auth');

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/friendRequest`;

    // defining routes.

    // get all notifications by userId
    app.get(`${baseUrl}/get/notification/:userId`, auth.isAuthorize, friendRequestController.getNotification);

    /**
     * @apiGroup Friend Request
     * @apiVersion  1.0.0
     * @api {get} /api/v1/friendRequest/get/notification/:userId Get all notifications by userId.
     *
     * @apiParam {string} userId userId of the friendRequest. (route params) (required)
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "All Notifications Listed",
            "status": 200,
            "data": {
                "friendId": string,
                "createdOn": date,
                "senderId": string,
                "senderName": string,
                "receiverId": string,
                "receiverName": string,
                "status": boolean
            }
        }
        @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "No Notifications Found",
	    "status": 500,
	    "data": null
	   }
    */


    // accept/reject friend request
    app.put(`${baseUrl}/update/request`, auth.isAuthorize, friendRequestController.updateFriendRequest);

    /**
     * @apiGroup Friend Request
     * @apiVersion  1.0.0
     * @api {put} /api/v1/friendRequest/update/request Accept/reject friend request.
     *
     * @apiParam {string} senderId senderId of the friendRequest. (body params) (required)
     * @apiParam {string} receiverId receiverId of the friendRequest. (body params) (required)
     * @apiParam {string} senderName senderName of the friendRequest. (body params) (required)
     * @apiParam {string} receiverName receiverName of the friendRequest. (body params) (required)
     * @apiParam {string} status status of the friendRequest. (body params) (required)
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Request edited successfully",
            "status": 200,
            "data": {
                "friendId": string,
                "createdOn": date,
                "senderId": string,
                "senderName": string,
                "receiverId": string,
                "receiverName": string,
                "status": boolean
            }
        }
        @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error occured",
	    "status": 500,
	    "data": null
	   }
    */



}