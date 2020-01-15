const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const appConfig = require("./../../config/appConfig");
const auth = require('../middlewares/auth');

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;

    // defining routes.
    app.post(`${baseUrl}/signup`, userController.signUpFunction);

    /**
     * @apiGroup User
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/signup User SignUp.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} firstName firstName of the user. (body params) (required)
     * @apiParam {string} lastName lastName of the user. (body params)
     * @apiParam {string} countryCode countryCode of the user. (body params) (required)
     * @apiParam {string} countryCode country of the user. (body params) (required)
     * @apiParam {number} mobileNumber mobileNumber of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Signed up successfully",
            "status": 200,
            "data": {
                "userId":string,
                "email": string
                "firstName": string,
                "lastName": string,
                "fullName": string,
                "country" : string,
                "countryCode" : string,
                "mobileNumber" : number,
                "createdOn": date,
            }
        }
        @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed to create new user",
	    "status": 500,
	    "data": null
	   }
    */

    app.post(`${baseUrl}/login`, userController.loginFunction);
    /**
     * @apiGroup User
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/login User Login.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Login successful!!",
            "status": 200,
            "data": {
                "authToken": string,
                "userDetails": {
                    "userId":string,
                    "email": string
                    "firstName": string,
                    "lastName": string,
                    "fullName": string,
                    "country" : string,
                    "countryCode" : string,
                    "mobileNumber" : number
                }
            }
        }
        @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Login failed",
	    "status": 500,
	    "data": null
	   }
    */

    app.post(`${baseUrl}/sendMail`, userController.sendMail);

    /**
     * @apiGroup User
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/sendMail User SendMail.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Email sent successfully",
            "status": 200,
            "data": {
                "userId":string,
                "email": string
                "firstName": string,
                "lastName": string,
                "fullName": string,
                "country" : string,
                "countryCode" : string,
                "mobileNumber" : number,
                "createdOn": date,
            }
        }
        @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed",
	    "status": 500,
	    "data": null
	   }
    */

    app.post(`${baseUrl}/authorizeUser`, userController.verifyUser);

    /**
     * @apiGroup User
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/authorizeUser User AuthorizeUser.
     *
     * @apiParam {string} forgotPassToken forgotPassToken of the user. (body params) (required)
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "User authorized",
            "status": 200,
            "data": {
                "userId":string,
                "email": string
                "firstName": string,
                "lastName": string,
                "fullName": string,
                "country" : string,
                "countryCode" : string,
                "mobileNumber" : number,
            }
        }
        @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed To Authorized",
	    "status": 500,
	    "data": null
	   }
    */

    app.put(`${baseUrl}/changePassword`, userController.changePassword);

    /**
     * @apiGroup User
     * @apiVersion  1.0.0
     * @api {put} /api/v1/users/changePassword User ChangePassword.
     *
     * @apiParam {string} userId userId of the user. (body params) (required)
     * @apiParam {string} newPassword newPassword of the user. (body params) (required)
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Password changed successfully!",
            "status": 200,
            "data": {
                "userId":string,
                "email": string
                "firstName": string,
                "lastName": string,
                "fullName": string,
                "country" : string,
                "countryCode" : string,
                "mobileNumber" : number,
            }
        }
        @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed To Change Password",
	    "status": 500,
	    "data": null
	   }
    */

    // get a particular friend by name
    app.get(`${baseUrl}/getFriend/:fullName`, auth.isAuthorize, userController.getFriendDetail);

    /**
     * @apiGroup User
     * @apiVersion  1.0.0
     * @api {get} /api/v1/users/getFriend/:fullName User FullName.
     *
     * @apiParam {string} fullName fullName of the user. (route params) (required)
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "User found!",
            "status": 200,
            "data": {
                "userId":string,
                "email": string
                "firstName": string,
                "lastName": string,
                "fullName": string,
                "country" : string,
                "countryCode" : string,
                "mobileNumber" : number,
            }
        }
        @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed",
	    "status": 500,
	    "data": null
	   }
    */

    app.post(`${baseUrl}/logout`, auth.isAuthorize, userController.logout);

    /**
     * @apiGroup User
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/logout User logout.
     *
     * @apiParam {string} userId userId of the user. (body params) (required)
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Logged out successfully",
            "status": 200,
            "data": null
        }
        @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Failed",
	    "status": 500,
	    "data": null
	   }
    */

}