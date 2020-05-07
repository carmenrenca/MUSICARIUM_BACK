'use strict'
//cargar modulos de node
var express= require('express');
var bodyParser= require('body-parser');
var jsforce = require('jsforce');

//EJECUTAR EXPRESS
var app= express();

//CARGAR LAS RUTAS
var article_route=require('./routes/article');
//var contact_route=require('./routes/contactos');
var user_route=require('./routes/cliente');
//CARGAR MIDELWARES
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//CARGAR CORS

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//AÑADIR PREFIJOS A RUTAS /cargar rutas
app.use('/' , article_route);
//app.use('/' , contact_route);
app.use('/',user_route);
//ruta de prueba
app.get('/probando', (req, res)=>{
return res.status(200).send(`
<h2>holiii</h2>`);
});
//EXPORTAR MODULO (fichero actual)

module.exports=app;