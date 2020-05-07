'use strict'
 
// Cargamos el módulo de mongoose
var mongoose = require('mongoose');
 
// Usaremos los esquemas
var Schema = mongoose.Schema;
// Creamos el objeto del esquema y tendrá dos campos de tipo String
var PedidoSchema = Schema({
    Status__c: String,
    Ciudad__c: String,
    cliente__c:String,
    Direccion__c:String,
    Provincia__c:String,
    total__c:String,
    date : {type:Date, default: Date.now},
});
 
// Exportamos el modelo para usarlo en otros ficheros
module.exports = mongoose.model('Pedido', PedidoSchema);
