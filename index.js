'use strict'
var mongoose = require('mongoose');
//var config= require ('./config');
 var app = require('./app');
 var port = 3900;
mongoose.set('useFindAndModify', false);
mongoose.Promise= global.Promise;
////mongoose.connect('mongodb://localhost:27017/Musicarium',{useNewUrlParser: true} ).then(()=>{

mongoose.connect('mongodb+srv://user:renca123456@cluster0-vvcre.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser: true} ).then(()=>{

console.log('conexion a la base de datos se ha realizado con exito!!!');
//crear servidor y ponerme a escuchar peticiones http
app.listen(port, ()=>{
    console.log('Sevidor corriendo en producción');
})
}).catch(error=>{
  mongoose.connect('mongodb://localhost:27017/Musicarium',{useNewUrlParser: true} ).then(()=>{

    console.log('conexion a la base de datos se ha realizado con exito!!!');
    //crear servidor y ponerme a escuchar peticiones http
    app.listen(port, ()=>{
        console.log('Sevidor corriendo en http://localhost:'+port);
    })
    })
});
/**
 * require('dotenv').config();
var jsforce = require('jsforce');
var conn = new jsforce.Connection();
var app= require('./app');
var port=3900;

  conn.login('crendon@resourceful-panda-9m01yc.com', 'jalovi3599FSAEcfbBqGKCKkseKSc08aHmH' ).then(()=>{
    console.log("Conexion a SALESFORCE!!!");
    //crear servidor y escuchar peticiones http
    app.listen(port,()=>{
      console.log('Servidor corriendo en http://localhost:'+port);
    })

    conn.query('SELECT  Name, Precio__c FROM Articulo__c	', function(err, accounts) {
      if (err) { return console.error(err); }
      console.log(accounts);
    });
  })
 



console.log(process.env.USER_NAME);

console.log(process.env.PASSWORD);

 * 
 */
