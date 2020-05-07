'use strict'
var express= require('express');
var ArticleController= require('../controller/article');
var ArticleMongo = require('../controller/articulos')
var PedidoController= require('../controller/pedidos');
var EmailCtrl = require('../controller/email');
var router= express.Router();
var multipart = require('connect-multiparty');
var md_upload= multipart({uploadDir:'./upload/articles'});
//router.post('/save', ArticleController.save);
router.get('/articles/:categori?',ArticleMongo.getArticles);
router.get('/article/:id',ArticleMongo.getArticle);
router.get('/articleCategori',ArticleMongo.getCategoria);
router.delete('/deletecategori/:id',ArticleMongo.deleteCategori);
router.get('/articleforcategori/:categori', ArticleMongo.getArticleCategoria);
router.post('/savecategori', ArticleMongo.saveCategori);
router.put('/articleupdate/:id',ArticleMongo.update);
router.delete('/article/:id',ArticleMongo.delete);
router.post('/pedido', PedidoController.createpedido);
router.get('/getpedido', PedidoController.getPedido);
router.post('/save', ArticleMongo.save );
router.post('/test', ArticleMongo.test);
router.get('/get-article' ,ArticleMongo.getArticles);
router.post('/upload-image/:id', md_upload, ArticleMongo.upload);
router.get('/get-image/:image', ArticleMongo.getImage);
router.post('/email/:correo', ArticleMongo.sendEmail);

//router.get('/search/:search',ArticleController.search);
module.exports=router;
