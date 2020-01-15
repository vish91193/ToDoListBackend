const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const logger = require('./loggerLib');
const tokenLib = require('./tokenLib');
const time = require('./timeLib');
const check = require('./checkLib');
const response = require('./responseLib');
const events = require('events');
const eventEmitter = new events.EventEmitter();
const redisLib = require('../libs/redisLib');
const FriendRequestModel = mongoose.model('FriendRequest');

let setServer = (server) => {
    let io = socketio.listen(server);
    let myIo = io.of('RealTimeToDoList');

    myIo.on('connection', (socket) => {
        console.log("Socket Connection!!");
        socket.emit("verify-user", "");
        socket.on('set-user', (authToken) => {
            console.log('set-user');
            tokenLib.verifyClaims(authToken, (err, user) => {
                if (err) {
                    if (err.name == "TokenExpiredError") {
                        socket.emit('auth-error', { status: 500, error: 'Token expired' });
                    }
                    else {
                        socket.emit('auth-error', { status: 500, error: 'Please provide correct authToken' });
                    }
                }
                else {
                    console.log("User is verified setting details");
                    currentUser = user.data;
                    socket.userId = currentUser.userId;
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`;
                    console.log(fullName + " is online");

                    // joining our issues which we are watching

                    // redisLib.getWatchersFromAIssueInAHash(currentUser.userId, (err, result) => {
                    //     if (err) {
                    //         console.log(err);
                    //     }
                    //     else {
                    //         console.log(result);
                    //         for(let r in result){
                    //             console.log(r);
                    //             socket.join(r);
                    //             console.log("Joined");
                    //         }
                    //     }

                    // });


                }
            });
        });

        socket.on('send-request', (data) => {
            console.log('1');
            eventEmitter.emit('save-friend-request', data);
        });

        socket.on('notify-creater-list-updated', (data) => {
            let sendRes = {
                status: 'Updated List',
                data: `${data.updaterName} updated your ${data.listName} list`
            };
            myIo.emit(data.createrId, sendRes);
        });

        socket.on('notify-friends-list-updated', (data) => {
            redisLib.getFriendsToAUserInAHash(data.userId, (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Friends");
                    let sendRes = {
                        status: 'Updated List',
                        data: `${data.userName} updated his ${data.listName} list`
                    };
                    for (let x in result) {
                        console.log(x);
                        myIo.emit(x, sendRes);
                    }
                }
            });

        });

        socket.on('notify-creater-list-edited', (data) => {
            let sendRes = {
                status: 'Edited List',
                data: `${data.updaterName} edited your ${data.listName} list`
            };
            myIo.emit(data.createrId, sendRes);
        });

        socket.on('notify-friends-list-edited', (data) => {
            redisLib.getFriendsToAUserInAHash(data.userId, (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Friends");
                    let sendRes = {
                        status: 'Edited List',
                        data: `${data.userName} edited his ${data.listName} list`
                    };
                    for (let x in result) {
                        console.log(x);
                        myIo.emit(x, sendRes);
                    }
                }
            });
        });

        socket.on('notify-creater-list-deleted', (data) => {
            let sendRes = {
                status: 'Deleted List',
                data: `${data.updaterName} deleted your ${data.listName} list`
            };
            myIo.emit(data.createrId, sendRes);
        });

        socket.on('notify-friends-list-deleted', (data) => {
            redisLib.getFriendsToAUserInAHash(data.userId, (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Friends");
                    let sendRes = {
                        status: 'Deleted List',
                        data: `${data.userName} deleted his ${data.listName} list`
                    };
                    for (let x in result) {
                        console.log(x);
                        myIo.emit(x, sendRes);
                    }
                }
            });
        });

        socket.on('get-friends', (userId) => {
            redisLib.getFriendsToAUserInAHash(userId, (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    let sendRes = {
                        status: 'FriendsList',
                        data: result
                    };
                    socket.emit(userId, sendRes);
                }
            });
        });

        socket.on('request-accepted', (data) => {

            let key = data.receiverId;
            let value = data.receiverName;
            redisLib.setFriendsToAUserInAHash(data.senderId, key, value, (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(result);
                }
            });

            let key1 = data.senderId;
            let value1 = data.senderName;
            redisLib.setFriendsToAUserInAHash(data.receiverId, key1, value1, (err, result1) => {
                if (err) {
                    console.log(err);
                }
                else {

                    console.log(result1);
                    let sendRes = {
                        status: 'Request Accepted Notification',
                        data: `Your friend requested is accepted by ${data.receiverName}`
                    };
                    myIo.emit(data.senderId, sendRes);


                }
            });

        });

        eventEmitter.on('sent-request', (data) => {
            console.log('3');
            console.log(data);
            socket.emit(data.data.senderId, data);
            if (data.status === 'Requested successfully') {
                console.log(data);
                console.log('4');
                let sendRes = {
                    status: 'Request Notification',
                    data: `Got a friend request from ${data.data.senderName}`
                };
                myIo.emit(data.data.receiverId, sendRes);
            }
        });

    });
}; // end of setServer

eventEmitter.on('save-friend-request', (data) => {
    console.log(data);
    let validatingInputs = () => {
        return new Promise((resolve, reject) => {
            if (data.senderId && data.senderName && data.receiverId && data.receiverName) {
                resolve();
            }
            else {
                let apiResponse = response.generate(true, "Body parameter are missing", 400, null);
                reject(apiResponse);
            }
        });
    }; // end of validateInputs

    let createRequest = () => {
        return new Promise((resolve, reject) => {
            let findQuery = {
                $or: [
                    { $and: [{ senderId: data.senderId }, { receiverId: data.receiverId }] },
                    { $and: [{ senderId: data.receiverId }, { receiverId: data.senderId }] }
                ]

            };
            FriendRequestModel.findOne(findQuery).exec((err, FriendRequestDetails) => {
                if (err) {
                    logger.error(err.message, "socketLib => createReq()", 5);
                    let apiResponse = response.generate(true, "Failed to create user", 500, data);
                    reject(apiResponse);

                }
                else if (check.isEmpty(FriendRequestDetails)) {
                    let newFriendRequest = new FriendRequestModel({
                        friendId: shortid.generate(),
                        senderId: data.senderId,
                        senderName: data.senderName,
                        receiverId: data.receiverId,
                        receiverName: data.receiverName,
                        status: 'requested',
                        createdOn: time.now()
                    });

                    newFriendRequest.save((err, newFriendRequestDetails) => {
                        if (err) {
                            logger.error(err.message, "socketLib => createReq()", 5);
                            let apiResponse = response.generate(true, "Failed to create new friend request", 500, data);
                            reject(apiResponse);
                        }
                        else {
                            let newFriendRequestDetailsObj = newFriendRequestDetails.toObject();
                            resolve(newFriendRequestDetailsObj);
                        }
                    });

                }

                else {
                    let apiResponse = response.generate(true, 'You both are friends or requested already!', 403, data);
                    reject(apiResponse);
                }

            });


        });
    }; // end of createRequest

    validatingInputs().then(createRequest).then((resolve) => {
        delete resolve._id;
        delete resolve.__v;
        let apiResponse = response.generate(false, "Requested successfully", 'Requested successfully', resolve);
        console.log('2');
        eventEmitter.emit('sent-request', apiResponse);

    }).catch((err) => {
        console.log(err);
        console.log('2');
        eventEmitter.emit('sent-request', err);
    });
});

module.exports = {
    setServer: setServer
};