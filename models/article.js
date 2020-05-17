'use strict'
 
// Cargamos el módulo de mongoose
var mongoose = require('mongoose');
 
// Usaremos los esquemas
var Schema = mongoose.Schema;
 
// Creamos el objeto del esquema y tendrá dos campos de tipo String
var ArticleSchema = Schema({
    Name: String,
    Precio__c: Number,
    Descuento:Number,
    PrecioFinal:Number,
    Descripcion__c:String,
    Cantidad__c:Number,
    stock__c:Number,
    img__c:String,
    imagen: String,
    categoria:String,
    like:Boolean,
    date : {type:Date, default: Date.now},
});
 
// Exportamos el modelo para usarlo en otros ficheros
module.exports = mongoose.model('Articulo', ArticleSchema);
