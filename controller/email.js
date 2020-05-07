'use strict'
//////////////


var nodemailer = require('nodemailer');
// email sender function
exports.sendEmail = function(req, res){
// Definimos el transporter
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'musicarium123@gmail.com',
            pass: 'renca3599'
        }
    });
// Definimos el email
var mailOptions = {
    from: 'musicarium123@gmail.com',
    to: 'carmenrenca3d@gmail.com',
    subject: 'Asunto',
    text: 'Contenido del email'
};
// Enviamos el email
transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
});
};