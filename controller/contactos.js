'use strict'

var validator= require('validator');
var Contacto = require('../models/contactos');
var jsforce = require('jsforce');
const fs = require('fs');
var conn = new jsforce.Connection({ });
 conn.login('crendon@resourceful-panda-9m01yc.com','Tres+10=13wRFmvdSajQnNazQJYELgxcxB9', function(err, userInfo) {

  });


var controller={


 getcontacts:(req,res)=>{
     console.log("LLAMADS CONTACT");
     
 var records = [];
conn.query("SELECT Id, Name, Email, Birthdate, City, Street, LastName, FirstName FROM Lead", function(err, result) {
  if (err) {   return res.status(404).send({
    status: 'err', 
    message:err
})}
  return res.status(200).send({
    status: 'success', 
    message:result
})
});
 },
 getcontacLogin:(req,res)=>{
        console.log("getcontacLogin");

        console.log(req);
        var Email = req.body.Email;
        console.log(Email);
      if (!Email || Email == null) {
        return res.status(404).send({
            status: 'error',
            message: 'No existe ese email!!'
        });
    }

    conn.query(`SELECT Id, Name, Email, Birthdate, City, Street, LastName, FirstName FROM Lead WHERE Email = '${Email}' ` , function(err, result) {
      if (err) {   return res.status(404).send({
        status: 'err', 
        message:err
    })}
  
    return res.status(200).send({
      status: 'success', 
      message:result
  })
 });
}

}

module.exports= controller;
