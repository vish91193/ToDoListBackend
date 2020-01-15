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


let getAllPrivateList = (req, res) => {
    let validateInput = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.params.userId)) {
                logger.info('userId missing', 'getAllPrivateList handler', 9)
                let apiResponse = response.generate(true, 'userId missing.', 403, null)
                reject(apiResponse)
            } else {
                resolve()
            }
        });
    }; // end of validateInput

    let findList = () => {
        return new Promise((resolve, reject) => {

            let findQuery = {
                $and: [{ createdBy: req.params.userId }, { private: true }]
            }
            ListCurrentCountModel.find(findQuery)
                .select('-_id -__v -undoCurrentCount')
                .lean()
                .exec((err, lists) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'List Controller: findList', 10)
                        let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
                        reject(apiResponse)
                    }
                    else if (check.isEmpty(lists)) {
                        logger.info('No Lists Found', 'List Controller: findList')
                        let apiResponse = response.generate(true, 'No Lists Found', 404, null)
                        reject(apiResponse)
                    }
                    else {
                        console.log('List found and listed.')
                        // reversing array.
                        // let reverseResult = result.reverse();
                        resolve(lists)
                    }
                });
        });
    }; // end of findList

    validateInput(req, res).then(findList).then((resolve) => {
        let apiResponse = response.generate(false, 'All Lists Listed', 200, resolve)
        console.log(apiResponse);
        res.send(apiResponse)
    })
        .catch((error) => {
            res.send(error)
        });

}; // end of getAllPrivateList

let getAllPublicList = (req, res) => {
    let validateInput = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.params.userId)) {
                logger.info('userId missing', 'getAllPrivateList handler', 9)
                let apiResponse = response.generate(true, 'userId missing.', 403, null)
                reject(apiResponse)
            } else {
                resolve()
            }
        });
    }; // end of validateInput

    let findList = () => {
        return new Promise((resolve, reject) => {

            let findQuery = {
                $and: [{ createdBy: req.params.userId }, { private: false }]
            }
            ListCurrentCountModel.find(findQuery)
                .select('-_id -__v -undoCurrentCount')
                .lean()
                .exec((err, lists) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'List Controller: findList', 10)
                        let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
                        reject(apiResponse)
                    }
                    else if (check.isEmpty(lists)) {
                        logger.info('No Lists Found', 'List Controller: findList')
                        let apiResponse = response.generate(true, 'No Lists Found', 404, null)
                        reject(apiResponse)
                    }
                    else {
                        console.log('List found and listed.')
                        // reversing array.
                        // let reverseResult = result.reverse();
                        resolve(lists)
                    }
                });
        });
    }; // end of findList

    validateInput(req, res).then(findList).then((resolve) => {
        let apiResponse = response.generate(false, 'All Lists Listed', 200, resolve)
        console.log(apiResponse);
        res.send(apiResponse)
    })
        .catch((error) => {
            res.send(error)
        });

}; // end of getAllPublicList

let getAList = (req, res) => {
    let validateInput = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.params.listId)) {
                logger.info('listId missing', 'getAList handler', 9)
                let apiResponse = response.generate(true, 'listId missing.', 403, null)
                reject(apiResponse)
            } else {
                resolve()
            }
        });
    }; // end of validateInput

    let findList = () => {
        return new Promise((resolve, reject) => {

            ListCurrentCountModel.findOne({ listId: req.params.listId })
                .select('-_id -__v')
                .lean()
                .sort('-createdOn')
                .exec((err, list) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'List Controller: findList', 10)
                        let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
                        reject(apiResponse)
                    }
                    else if (check.isEmpty(list)) {
                        logger.info('No such list found', 'List Controller: findList')
                        let apiResponse = response.generate(true, 'No such list found', 404, null)
                        reject(apiResponse)
                    }
                    else {
                        console.log('List found')
                        // reversing array.
                        // let reverseResult = result.reverse();
                        resolve(list)
                    }
                });
        });
    }; // end of findList

    let getList = (list) => {
        return new Promise((resolve, reject) => {
            let findQuery = {
                $and: [{ listId: list.listId }, { undoCounts: list.undoCurrentCount }]
            };
            ListModel.findOne(findQuery).exec((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'List Controller: findList', 10)
                    let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
                    reject(apiResponse)
                }
                else if (check.isEmpty(result)) {
                    logger.info('No such list found', 'List Controller: findList')
                    let apiResponse = response.generate(true, 'No such list found', 404, null)
                    reject(apiResponse)
                }
                else {
                    console.log('List found')
                    // reversing array.
                    // let reverseResult = result.reverse();
                    let resultObj = result.toObject();
                    resolve(resultObj)
                }
            });
        });
    };

    validateInput(req, res).then(findList).then(getList).then((resolve) => {
        delete resolve._id;
        delete resolve.__v;
        delete resolve.undoCounts;
        let apiResponse = response.generate(false, 'List Found', 200, resolve)
        console.log(apiResponse);
        res.send(apiResponse)
    })
        .catch((error) => {
            res.send(error)
        });

}; // end of getAList

let createAList = (req, res) => {
    let validateInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.listName && req.body.private && req.body.createdBy) {
                resolve();
            }
            else {
                logger.info('parameters missing', 'createAList handler', 9)
                let apiResponse = response.generate(true, 'parameters missing.', 403, null)
                reject(apiResponse)
            }
        });
    }; // end of validateInput

    let createListCurrentCount = () => {
        return new Promise((resolve, reject) => {
            ListModel.findOne({ $and: [{ listName: req.body.listName }, { createdBy: req.body.createdBy }] }).exec((err, found) => {
                if (err) {
                    logger.error(err.message, "listController => createAList()", 5);
                    let apiResponse = response.generate(true, "Failed to create list", 500, null);
                    reject(apiResponse);
                }
                // no such listName found
                else if (check.isEmpty(found)) {
                    let newListCurrentCount = new ListCurrentCountModel({
                        listId: shortid.generate(),
                        undoCurrentCount: 0,
                        listName: req.body.listName,
                        createdBy: req.body.createdBy,
                        private: req.body.private,
                        createdOn: time.now(),
                    });

                    newListCurrentCount.save((err, savedListDetails) => {
                        if (err) {
                            logger.error(err.message, "listController => createAList()", 5);
                            let apiResponse = response.generate(true, "Failed to create new list", 500, null);
                            reject(apiResponse);
                        }
                        else {
                            req.body.listId = savedListDetails.listId
                            // console.log(req.body.listId);
                            resolve();
                        }
                    });

                }
                else {
                    let apiResponse = response.generate(true, 'Same list name already exists', 403, null);
                    reject(apiResponse);
                }
            });
        });
    }; // end of createListCurrentCount

    let createList = () => {
        return new Promise((resolve, reject) => {
            let newList = new ListModel({
                listId: req.body.listId,
                listName: req.body.listName,
                private: req.body.private,
                createdBy: req.body.createdBy,
                createdOn: time.now(),
                undoCounts: 0
            });

            newList.save((err, newListDetails) => {
                if (err) {
                    logger.error(err.message, "listController => createAList()", 5);
                    let apiResponse = response.generate(true, "Failed to create new list", 500, null);
                    reject(apiResponse);
                }
                else {
                    let newListDetailsObj = newListDetails.toObject();
                    resolve(newListDetailsObj);
                }
            });
        });
    }; // end of createList

    validateInput(req, res).then(createListCurrentCount).then(createList).then((resolve) => {
        delete resolve._id;
        delete resolve.__v;
        let apiResponse = response.generate(false, "New list added successfully", 200, resolve);
        res.send(apiResponse);
    })
        .catch((err) => {
            console.log(err);
            res.send(err);
        });

}; // end of createAList

let createAItem = (req, res) => {
    let validateInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.listId && req.body.parentId && req.body.itemName && req.body.status && req.body.createdBy) {
                resolve();
            }
            else {
                let apiResponse = response.generate(true, "Body parameter are missing", 400, null);
                reject(apiResponse);
            }
        });
    }; // end of validateInput

    let incrementingListCurrentCount = () => {
        return new Promise((resolve, reject) => {
            ListCurrentCountModel.findOne({ listId: req.body.listId }).exec((err, result) => {
                if (err) {
                    logger.error(err.message, "listController => createAItem()", 5);
                    let apiResponse = response.generate(true, "Failed to increment list current count", 500, null);
                    reject(apiResponse);
                }
                else if (check.isEmpty(result)) {
                    let apiResponse = response.generate(true, "No such list found", 404, null);
                    reject(apiResponse);
                }
                else {
                    result.undoCurrentCount++;
                    result.save((err, update) => {
                        if (err) {
                            logger.error(err.message, "listController => createAItem()", 5);
                            let apiResponse = response.generate(true, "Failed to increment list current count", 500, null);
                            reject(apiResponse);
                        }
                        else {
                            resolve(update.undoCurrentCount);
                        }
                    });
                }
            });
        });
    }

    let undoCountIncrement = (undoCurrentCount) => {
        return new Promise((resolve, reject) => {
            ListModel.findOne({ $and: [{ listId: req.body.listId }, { undoCounts: undoCurrentCount - 1 }] }).exec((err, listDetail) => {
                if (err) {
                    logger.error(err.message, "listController => createAItem()", 5);
                    let apiResponse = response.generate(true, "Failed to find a item", 500, null);
                    reject(apiResponse);
                }
                else if (check.isEmpty(listDetail)) {
                    let apiResponse = response.generate(true, "No such list found", 404, null);
                    reject(apiResponse);
                }
                else {
                    let newList = new ListModel({
                        listId: listDetail.listId,
                        listName: listDetail.listName,
                        private: listDetail.private,
                        createdBy: listDetail.createdBy,
                        createdOn: listDetail.createdOn,
                        undoCounts: listDetail.undoCounts + 1,
                        listItems: listDetail.listItems
                    });

                    newList.save((err, newSavedList) => {
                        if (err) {
                            logger.error(err.message, "listController => createAItem()", 5);
                            let apiResponse = response.generate(true, "Failed to create a new list", 500, null);
                            reject(apiResponse);
                        }
                        else {
                            resolve(newSavedList);
                        }
                    });
                }
            });
        });
    };

    let creatingItem = (list) => {
        return new Promise((resolve, reject) => {
            let findQuery = {
                $and: [{ listId: list.listId }, { undoCounts: list.undoCounts }]
            };
            let updateQuery = {
                $push: {
                    listItems: {
                        itemId: shortid.generate(),
                        parentId: req.body.parentId,
                        itemName: req.body.itemName,
                        status: req.body.status,
                        createdBy: req.body.createdBy,
                        createdOn: time.now()
                    }
                }
            };

            ListModel.findOneAndUpdate(findQuery, updateQuery, { new: true }).exec((err, updatedList) => {
                if (err) {
                    logger.error(err.message, "listController => createAItem()", 5);
                    let apiResponse = response.generate(true, "Failed to create a new item", 500, null);
                    reject(apiResponse);
                }
                else {
                    updatedListObj = updatedList.toObject();
                    resolve(updatedListObj);
                }
            });
        });

    };

    validateInput(req, res).then(incrementingListCurrentCount).then(undoCountIncrement).then(creatingItem).then((resolve) => {
        delete resolve._id;
        delete resolve.__v;
        delete resolve.undoCounts;
        let apiResponse = response.generate(false, 'List item added successfully', 200, resolve);
        logger.info('List item added successfully', 'List Controller->createAItem', 5);
        res.send(apiResponse);
    })
        .catch((error) => {
            res.send(error)
        })

}; // end of createAItem

let editAList = (req, res) => {
    let updateListCurrentCount = () => {
        return new Promise((resolve, reject) => {
            ListCurrentCountModel.findOne({ listId: req.params.listId }).exec((err, result) => {
                if (err) {
                    logger.error(err.message, "listController => editAList()", 5);
                    let apiResponse = response.generate(true, "Failed to find a list", 500, null);
                    reject(apiResponse);
                }
                else if (check.isEmpty(result)) {
                    let apiResponse = response.generate(true, "No such list found", 404, null);
                    reject(apiResponse);
                }
                else {
                    result.undoCurrentCount++;
                    result.listName = req.body.listName;
                    console.log(result);
                    result.save((err, savedListDetails) => {
                        if (err) {
                            logger.error(err.message, "listController => editAList()", 5);
                            let apiResponse = response.generate(true, "Failed to save a list in list current count model", 500, null);
                            reject(apiResponse);
                        }
                        else {
                            resolve(savedListDetails);
                        }
                    });
                }
            });
        });
    }; // end of updateListCurrentCount

    let updateList = (listCurrentCountModelDetails) => {
        return new Promise((resolve, reject) => {
            let newList = new ListModel({
                listId: req.body.listId,
                listName: req.body.listName,
                private: req.body.private,
                createdBy: req.body.createdBy,
                createdOn: req.body.createdOn,
                undoCounts: listCurrentCountModelDetails.undoCurrentCount,
                listItems: req.body.listItems
            });

            newList.save((err, newListDetails) => {
                if (err) {
                    logger.error(err.message, "listController => editAList()", 5);
                    let apiResponse = response.generate(true, "Failed to save a list in list model", 500, null);
                    reject(apiResponse);
                }
                else {
                    resolve(newListDetails);
                }
            });

        });

    }; // end of updateList

    updateListCurrentCount(req, res).then(updateList).then((resolve) => {
        delete resolve._id;
        delete resolve.__v;
        delete resolve.undoCounts;
        let apiResponse = response.generate(false, 'List update successfully', 200, resolve);
        logger.info('List update successfully', 'List Controller->updateList', 5);
        res.send(apiResponse);
    })


}; // end of editAList

let undoAList = (req, res) => {
    let validateInput = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.params.listId)) {
                logger.info('parameters missing', 'getIssuesByAssignee handler', 9)
                let apiResponse = response.generate(true, 'parameters missing.', 403, null)
                reject(apiResponse)
            } else {
                resolve()
            }
        });
    }; // end of validateInput

    let decrementingListCurrentCount = () => {
        return new Promise((resolve, reject) => {
            ListCurrentCountModel.findOne({ listId: req.params.listId }).exec((err, result) => {
                if (err) {
                    logger.error(err.message, "listController => undoAList()", 5);
                    let apiResponse = response.generate(true, "Failed to decrement list current count", 500, null);
                    reject(apiResponse);
                }
                else if (check.isEmpty(result)) {
                    let apiResponse = response.generate(true, "No such list found", 404, null);
                    reject(apiResponse);
                }
                else if (result.undoCurrentCount == 0) {
                    let apiResponse = response.generate(true, "Nothing left to undo", 400, null);
                    reject(apiResponse);
                }
                else {
                    result.undoCurrentCount--;
                    result.save((err, update) => {
                        if (err) {
                            logger.error(err.message, "listController => undoAList()", 5);
                            let apiResponse = response.generate(true, "Failed to decrement list current count", 500, null);
                            reject(apiResponse);
                        }
                        else {
                            resolve(update.undoCurrentCount);
                        }
                    });
                }
            });
        });
    };

    let deletingCurrentList = (undoCurrentCount) => {
        return new Promise((resolve, reject) => {
            ListModel.remove({ $and: [{ listId: req.params.listId }, { undoCounts: undoCurrentCount + 1 }] }).exec((err, result) => {
                if (err) {
                    logger.error(err.message, "listController => undoAList()", 5);
                    let apiResponse = response.generate(true, "Failed to find a item", 500, null);
                    reject(apiResponse);
                }
                else {
                    resolve(undoCurrentCount)
                }
            });
        });
    };

    let getPreviousList = (undoCurrentCount) => {
        return new Promise((resolve, reject) => {
            ListModel.findOne({ $and: [{ listId: req.params.listId }, { undoCounts: undoCurrentCount }] }).exec((err, result) => {
                if (err) {
                    logger.error(err.message, "listController => undoAList()", 5);
                    let apiResponse = response.generate(true, "Failed to find a list", 500, null);
                    reject(apiResponse);
                }
                else if (check.isEmpty(result)) {
                    let apiResponse = response.generate(true, "No such list found", 404, null);
                    reject(apiResponse);
                }
                else {
                    resolve(result);
                }
            });
        });
    };

    validateInput(req, res).then(decrementingListCurrentCount).then(deletingCurrentList).then(getPreviousList).then((resolve) => {
        delete resolve._id;
        delete resolve.__v;
        delete resolve.undoCounts;
        logger.info('List undo successfully', 'List Controller->undoAList', 5);
        let apiResponse = response.generate(false, 'List undo successfully', 200, resolve);
        res.send(apiResponse);
    }).catch((error) => {
        res.send(error)
    })


}; // end of undoAList

let deleteAList = (req, res) => {
    let validateInput = () => {
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.listId)) {
                logger.info('parameters missing', 'getIssuesByAssignee handler', 9)
                let apiResponse = response.generate(true, 'parameters missing.', 403, null)
                reject(apiResponse)
            } else {
                resolve()
            }
        });
    }; // end of validateInput

    let deletingList = () => {
        return new Promise((resolve, reject) => {
            ListCurrentCountModel.remove({ listId: req.body.listId }).exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'List Controller->deletingList', 10)
                    let apiResponse = response.generate(true, 'Error occured', 500, null);
                    reject(apiResponse);
                }
                else if (check.isEmpty(result)) {
                    logger.info('No List found!', 'List Controller->deletingList');
                    let apiResponse = response.generate(true, 'No List found!', 400, null);
                    reject(apiResponse);
                }
                else {
                    ListModel.deleteMany({ listId: req.body.listId }).exec((err, deleted) => {
                        if (err) {
                            logger.error(err.message, 'List Controller->deletingList', 10)
                            let apiResponse = response.generate(true, 'Error occured', 500, null);
                            reject(apiResponse);
                        }
                        else {

                            resolve(deleted);
                        }
                    });

                }
            })
        });
    }; // end of deletingList

    validateInput(req, res).then(deletingList).then((resolve) => {
        let apiResponse = response.generate(false, 'List deleted successfully', 200, null);
        logger.info('List deleted successfully', 'List Controller->deletingList', 5);
        res.send(apiResponse);
    })
        .catch((error) => {
            res.send(error)
        })

}; // end of deleteAList

let deleteAItem = (req, res) => {
    let validateInput = () => {
        return new Promise((resolve, reject) => {
            if (req.params.listId && req.body.itemId) {
                resolve();
            }
            else {
                let apiResponse = response.generate(true, "Body parameter are missing", 400, null);
                reject(apiResponse);
            }
        });
    }; // end of validateInput

    let incrementingListCurrentCount = () => {
        return new Promise((resolve, reject) => {
            ListCurrentCountModel.findOne({ listId: req.params.listId }).exec((err, result) => {
                if (err) {
                    logger.error(err.message, "listController => deleteAItem()", 5);
                    let apiResponse = response.generate(true, "Failed to increment list current count", 500, null);
                    reject(apiResponse);
                }
                else if (check.isEmpty(result)) {
                    let apiResponse = response.generate(true, "No such list found", 404, null);
                    reject(apiResponse);
                }
                else {
                    result.undoCurrentCount++;
                    result.save((err, update) => {
                        if (err) {
                            logger.error(err.message, "listController => deleteAItem()", 5);
                            let apiResponse = response.generate(true, "Failed to increment list current count", 500, null);
                            reject(apiResponse);
                        }
                        else {
                            resolve(update.undoCurrentCount);
                        }
                    });
                }
            });
        });
    }

    let undoCountIncrement = (undoCurrentCount) => {
        return new Promise((resolve, reject) => {
            ListModel.findOne({ $and: [{ listId: req.params.listId }, { undoCounts: undoCurrentCount - 1 }] }).exec((err, listDetail) => {
                if (err) {
                    logger.error(err.message, "listController => deleteAItem()", 5);
                    let apiResponse = response.generate(true, "Failed to find a item", 500, null);
                    reject(apiResponse);
                }
                else if (check.isEmpty(listDetail)) {
                    let apiResponse = response.generate(true, "No such list found", 404, null);
                    reject(apiResponse);
                }
                else {
                    let newList = new ListModel({
                        listId: listDetail.listId,
                        listName: listDetail.listName,
                        private: listDetail.private,
                        createdBy: listDetail.createdBy,
                        createdOn: listDetail.createdOn,
                        undoCounts: listDetail.undoCounts + 1,
                        listItems: listDetail.listItems
                    });

                    newList.save((err, newSavedList) => {
                        if (err) {
                            logger.error(err.message, "listController => deleteAItem()", 5);
                            let apiResponse = response.generate(true, "Failed to create a new list", 500, null);
                            reject(apiResponse);
                        }
                        else {
                            resolve(newSavedList);
                        }
                    });
                }
            });
        });
    };

    let deletingItem = (newList) => {
        return new Promise((resolve, reject) => {
            let findQuery = {
                $and: [{ listId: newList.listId }, { undoCounts: newList.undoCounts }]
            };
            let updateQuery = {
                $pull: { listItems: { itemId: req.body.itemId } }
            };
            ListModel.findOneAndUpdate(findQuery, updateQuery, { new: true }).exec((err, deleted) => {
                if (err) {
                    logger.error(err.message, "listController => deleteAItem()", 5);
                    let apiResponse = response.generate(true, "Failed to create a new list", 500, null);
                    reject(apiResponse);
                }
                else {
                    resolve(deleted);
                }
            });
        });
    };

    let deletingSubItems = (newList) => {
        return new Promise((resolve, reject) => {
            let findQuery = {
                $and: [{ listId: newList.listId }, { undoCounts: newList.undoCounts }]
            };
            let updateQuery = {
                $pull: { listItems: { parentId: req.body.itemId } }
            };
            ListModel.findOneAndUpdate(findQuery, updateQuery, { new: true }).exec((err, deleted) => {
                if (err) {
                    logger.error(err.message, "listController => deleteAItem()", 5);
                    let apiResponse = response.generate(true, "Failed to create a new list", 500, null);
                    reject(apiResponse);
                }
                else {
                    resolve(deleted);
                }
            });
        });
    };

    validateInput(req, res).then(incrementingListCurrentCount).then(undoCountIncrement).then(deletingItem).then(deletingSubItems)
        .then((resolve) => {
            delete resolve._id;
            delete resolve.__v;
            delete resolve.undoCounts;
            logger.info('List item deleted successfully', 'List Controller->deleteAItem', 5);
            let apiResponse = response.generate(false, 'List item deleted successfully', 200, resolve);
            res.send(apiResponse);
        }).catch((error) => {
            res.send(error)
        })

}; // end of deleteAItem


module.exports = {
    getAllPrivateList: getAllPrivateList,
    getAllPublicList: getAllPublicList,
    getAList: getAList,
    createAList: createAList,
    createAItem: createAItem,
    editAList: editAList,
    undoAList: undoAList,
    deleteAList: deleteAList,
    deleteAItem: deleteAItem


}// end exports