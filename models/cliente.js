'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Clientechema = Schema({
nombre: String,
apellido: String,
telefono:Number,
direccion: String,
email:String,
dni:String,
password:String,
rol:String
});

module.exports = mongoose.model('users',Clientechema);