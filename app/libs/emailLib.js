// nodemmailer with sendgrid
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
const tokenLib = require('./tokenLib');

var options = {
    auth: {
        api_user: 'vishal91193',
        api_key: 'dhn_dhn11'
    }
};
let forgotPassToken;
var client = nodemailer.createTransport(sgTransport(options));

let forgotEmail = (newUserDetails) => {
    tokenLib.generateToken(newUserDetails, (err, tokenDetails) => {

        if (err) {
            // logger.error("Failed to generate token","userController => generateToken()",10);
            // let apiResponse = response.generate(true,"Failed to generate token",500,null);
            // reject(apiResponse);
            console.log(err);
        }
        else {
            forgotPassToken = tokenDetails.token;
            console.log(forgotPassToken);
        }
    });
    let email = {
        from: 'Real Time To do List App,dungoensIsWaiting@donotreply.com',
        to: newUserDetails.email,
        subject: 'Forgot Password',
        text: 'Welcome ' + newUserDetails.firstName + " " + newUserDetails.lastName + " to our Real Time To do List App",
        html: '<p>Welcome ' + '<b>' + newUserDetails.firstName + " " + newUserDetails.lastName + '</b>' + ' to our Real Time To do List App.To reset your password </p><a href="http://todolist.abhishekpalwankar.xyz/forgot-password/' + forgotPassToken + '">Click here</a>'
    };

    client.sendMail(email, function (err, info) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Email sent successfully!!');
        }
    });

};

module.exports = {
    forgotEmail: forgotEmail
};