const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib');
const passwordLib = require('../libs/passwordLib');
const tokenLib = require('../libs/tokenLib');
const emailLib = require('../libs/emailLib');

/* Models */
const UserModel = mongoose.model('User');
const AuthModel = mongoose.model('Auth');
const ListModel = mongoose.model('List');
const ListCurrentCountModel = mongoose.model('ListCurrentCount');
const FriendRequestModel = mongoose.model('FriendRequest');

let getNotification = (req, res) => {
    let validateInput = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.params.userId)) {
                logger.info('userId missing', 'getNotification handler', 9)
                let apiResponse = response.generate(true, 'userId missing.', 403, null)
                reject(apiResponse)
            } else {
                resolve()
            }
        });
    }; // end of validateInput

    let findNotification = () => {
        return new Promise((resolve, reject) => {

            let findQuery = {
                $and: [{ receiverId: req.params.userId }, { status: 'requested' }]
            }
            FriendRequestModel.find(findQuery)
                .select('-_id -__v')
                .lean()
                .exec((err, lists) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'FriendRequest Controller: getNotification', 10)
                        let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
                        reject(apiResponse)
                    }
                    else if (check.isEmpty(lists)) {
                        logger.info('No Notifications Found', 'FriendRequest Controller: getNotification')
                        let apiResponse = response.generate(true, 'No Notifications Found', 404, null)
                        reject(apiResponse)
                    }
                    else {
                        console.log('Notifications found and listed.')
                        // reversing array.
                        // let reverseResult = result.reverse();
                        resolve(lists)
                    }
                });
        });
    }; // end of findList

    validateInput(req, res).then(findNotification).then((resolve) => {
        let apiResponse = response.generate(false, 'All Notifications Listed', 200, resolve)
        console.log(apiResponse);
        res.send(apiResponse)
    })
        .catch((error) => {
            res.send(error)
        });

}; //end of getNotification


// updateFriendRequest
let updateFriendRequest = (req, res) => {

    let validateInput = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.senderId && req.body.senderName && req.body.receiverId && req.body.receiverName && req.body.status)) {
                logger.info('parameters missing', 'getNotification handler', 9)
                let apiResponse = response.generate(true, 'parameters missing.', 403, null)
                reject(apiResponse)
            } else {
                resolve()
            }
        });
    }; // end of validateInput

    let update = () => {
        return new Promise((resolve, reject) => {
            let findQuery = {
                $and: [{ senderId: req.body.senderId }, { receiverId: req.body.receiverId }]
            }
            let updateQuery = {
                $set: { status: req.body.status }
            }
            FriendRequestModel.findOneAndUpdate(findQuery, updateQuery, { new: true })
                .select('-_id -__v')
                .exec((err, result) => {
                    if (err) {
                        logger.error(err.message, 'FriendRequest Controller->updateFriendRequest', 10)
                        let apiResponse = response.generate(true, 'Error occured', 500, null);
                        reject(apiResponse);
                    }
                    else if (check.isEmpty(result)) {
                        logger.info('No Record found!', 'FriendRequest Controller->updateFriendRequest');
                        let apiResponse = response.generate(true, 'No Record found!', 400, null);
                        reject(apiResponse);
                    }
                    else {
                        logger.info('Request edited successfully', 'FriendRequest Controller->updateFriendRequest', 5);
                        resolve(result);

                    }
                })
        });
    };

    validateInput(req, res).then(update).then((resolve) => {
        let apiResponse = response.generate(false, 'Request edited successfully', 200, resolve);
        res.send(apiResponse);
    })
        .catch((error) => {
            res.send(error)
        });
}


module.exports = {
    getNotification: getNotification,
    updateFriendRequest: updateFriendRequest
};