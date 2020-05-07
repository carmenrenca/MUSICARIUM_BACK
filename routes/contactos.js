'use strict'
var express= require('express');
var ContactController= require('../controller/contactos');
var autch = require('../../midelware/autch');
var router= express.Router();
var multipart = require('connect-multiparty');
var AutchControl= require('../controller/auth');



router.get('/contact',ContactController.getcontacts);
router.post('/contactlogin', ContactController.getcontacLogin);
router.get('/private',autch,(req,res)=>{
    res.status(200).send({
        message:'Tienes acceso'
    })
});

router.post('/signUp', AutchControl.singUp);
router.post('/signIn', AutchControl.singIn);

module.exports=router;
