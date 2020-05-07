'use strict'

 
// Cargamos el módulo de mongoose
var mongoose = require('mongoose');
 
// Usaremos los esquemas
var Schema = mongoose.Schema;
 
// Creamos el objeto del esquema y tendrá dos campos de tipo String
var ContactSchema = Schema({
  
    LastName: String,
    Alias:String,
    Email:String,
    Username:String,
    TimeZoneSidKey:String,
    LocaleSidKey:String,
    EmailEncodingKey:String,
    ProfileId:String,
    LanguageLocaleKey:String,
    ContactId:String,
    City:String
});
 
// Exportamos el modelo para usarlo en otros ficheros
module.exports = mongoose.model('Contactos', ContactSchema);
