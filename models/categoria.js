'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CategoriSchema = Schema({
title: String,

date : {type:Date, default: Date.now},
imagen: String


});

module.exports = mongoose.model('categoria',CategoriSchema);