'use strict'
 
// Cargamos el módulo de mongoose
var mongoose = require('mongoose');
 
// Usaremos los esquemas
var Schema = mongoose.Schema;
 
// Creamos el objeto del esquema y tendrá dos campos de tipo String
var FavoritoSchema = Schema({
    Name: String,
    cliente:String,
    Idfav:String,
 
    imagen: String,

    date : {type:Date, default: Date.now},
});
 
// Exportamos el modelo para usarlo en otros ficheros
module.exports = mongoose.model('Favorito', FavoritoSchema);
