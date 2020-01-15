const check = require('../libs/checkLib');
const redis = require('redis');

let client = redis.createClient({
    // commenting it as we have install redis on ubuntu server
     port: 19580,
     host: 'redis-19580.c52.us-east-1-4.ec2.cloud.redislabs.com',
     password: 'XZt3ZuyGbpyKwkRBE9c10733rkjneWbY'
});

client.on('connect', () => {
    console.log("Redis connection open success");
});

let getFriendsToAUserInAHash = (hashName, callBack) => {
    console.log(hashName);
    client.HGETALL(hashName, (err, result) => {
        if (err) {
            console.log(err);
            callBack(err, null);
        }
        else if (check.isEmpty(result)) {
            console.log("User list is empty");
            console.log(result);
            callBack(null, {});
        }
        else {
            console.log(result);
            callBack(null, result);
        }
    });
};

let setFriendsToAUserInAHash = (hashName, key, value, callBack) => {
    client.HMSET(hashName, [key, value], (err, result) => {
        if (err) {
            console.log(err);
            callBack(err, null);
        }
        else {
            console.log("User set online successfully");
            console.log(result);
            callBack(null, result);
        }
    });
};

let deleteFromAHash = (hashName, key) => {
    client.HDEL(hashName, key);
    return true;
};

module.exports = {
    getFriendsToAUserInAHash: getFriendsToAUserInAHash,
    setFriendsToAUserInAHash: setFriendsToAUserInAHash,
    deleteFromAHash: deleteFromAHash
};