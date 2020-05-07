'use strict'

var validator= require('validator');
var Article = require('../models/article');
var Pedido = require('../models/pedido');
var jsforce = require('jsforce');
const fs = require('fs');

var nodemailer = require('nodemailer');
var conn = new jsforce.Connection({ });
  conn.login('crendon@resourceful-panda-9m01yc.com','jalovi3599FSAEcfbBqGKCKkseKSc08aHmH', function(err, userInfo) {
    if (err) { return console.error(err); }
    // Now you can get the access token and instance URL information.
    // Save them to establish connection next time.
    console.log(conn.accessToken);
    console.log(conn.instanceUrl);
    // logged in user property
    console.log("User ID: " + userInfo.id);
    console.log("Org ID: " + userInfo.organizationId);
    // ...
  });
var controller ={
 
  upload:(req,res)=>{
    var fileOnServer = '../backend/upload/foto.jpeg',
    fileName = 'foto.jpeg',
    fileType = 'image/jpeg';

    fs.readFile(fileOnServer, function (err, filedata) {
    if (err){
        console.error(err);
    }
    else{
        var base64data = new Buffer(filedata).toString('base64');
        conn.sobject('Articulo__c').create({ 
                Id: 'a043X00000hDwWtQAK',
                Name : 'Canon 400D',
                Body: base64data,
                ContentType : fileType,  
            }, 
            function(err, uploadedAttachment) {
                console.log(err,uploadedAttachment);
        });
}
});
  },
 
  getArticleForCategori(req,res){
    var categori= req.params.categori;
    console.log("entraa")
    if(categori || categori!=undefined){

        conn.query(`SELECT Name FROM Product2 Where Family = ${categori}`, function(err, result) {
            if (err) {   return res.status(404).send({
              status: 'err', 
             article:err
          })}
            return res.status(200).send({
              status: 'success', 
              article: result
          })
          });
    }
  },
    getarticles:(req,res)=>{
        var categori= req.params.categori;
        console.log("entraa"+categori)
        if(categori || categori!=undefined){
  
            conn.query(`SELECT Id, Name, Precio__c,Description, DisplayUrl  FROM Product2 Where Family = '${categori}'`, function(err, result) {
                if (err) {   return res.status(404).send({
                  status: 'err', 
                 article:err
              })}
                return res.status(200).send({
                  status: 'success', 
                  article: result
              })
              });
        }else{
          var records = [];
          conn.query("SELECT  Id, Name, Precio__c,Description, DisplayUrl   from Product2", function(err, result) {
            if (err) {   return res.status(404).send({
              status: 'err', 
              message:"error"
          })}
            return res.status(200).send({
              status: 'success', 
              message:result
          })
          });
        }
       
      
    },

    
    getArticle: (req, res) => {

      //recoger el id de la URL

      var articleId = req.params.id;
        console.log(articleId+"id");
      //comprobar que existe
      if (!articleId || articleId == null) {
          return res.status(404).send({
              status: 'error',
              message: 'No existe el articulo!!'
          });
      }
      conn.sobject("Product2").retrieve(articleId, function(err, article) {
        if (err) {  return res.status(404).send({
          status: 'error',
          message: 'No existe el producto!!'
      }); }
        console.log("Name : " + article.Name);
        return res.status(200).send({
          status: 'success', 
          article: article
      })
      });
     
  
 


  },

  getcategori(req, res){
    conn.query("SELECT  Family FROM Product2 group by Family", function(err, result) {
      if (err) {   return res.status(404).send({
        status: 'err', 
        message:"error"
    })}
      return res.status(200).send({
        status: 'success', 
        message:result
    })
    });
  },

    save:(req,res)=>{
        //recoger los parametros del cliente
var params = req.body;
console.log(params);
        //validarlos
            try{
                    var validate_title= !validator.isEmpty(params.title);
                    var validate_precio= !validator.isEmpty(params.precio);
                    var validate_cantidad= !validator.isEmpty(params.cantidad);
                    var validate_descripcion= !validator.isEmpty(params.descripcion);

            }catch(err){
                return res.status(200).send({
                    status:'error',
                    message:'Faltan datos por enviar!!!'
                });
            }
        //crear el objeto a guardar
var article= new Article();

        //Asignar valores
        article.title= params.title;
article.Precio__c= params.precio;
article.Descripcion__c=params.descripcion;
article.Cantidad__c=params.cantidad;
article.img__c=params.img;
        //guardar el articulo
        conn.sobject("Articulo__c").create({ Name : article.title,Precio__c:article.Precio__c,Descripcion__c: article.Descripcion__c,Cantidad__c:article.Cantidad__c,img__c:article.img__c}, function(err, ret) {
            if (err || !ret.success) { return res.status(404).send({
                    status:'error',
                    message:'el articulo no se ha guardado!!!'
                }); }
                return res.status(200).send({
                    status: 'success', 
                   article:ret.id
                });            // ...
          });
 
        //devolver una respuesta
        return res.status(200).send({
            status: 'success', 
           article:params
        });
    },
update:(req,res)=>{
    var params = req.body;

    console.log(req.params.id);
    console.log(req);
    conn.sobject("Articulo__c").update({ 
        Id : req.params.id,
        Name : params.Name,
        Precio__c:params.Precio__c,
        Descripcion__c:params.Descripcion__c,
        Cantidad__c:params.Cantidad__c,
        img__c: params.img__c
      }, function(err, ret) {
        if (err || !ret.success) {   return res.status(404).send({
            status:'error',
            message:'el articulo no se ha actualizado!!!'+err
        }); }
        return res.status(200).send({
            status: 'success', 
           article:ret.Name
        }); 
        // ...
      });
},
delete:(req,res)=>{
    var params = req.body;

   
    conn.sobject("Articulo__c").destroy(req.params.id, function(err, ret) {
        
        if (err || !ret.success) { return res.status(404).send({
            status:'error',
            message:'el articulo no se ha eliminado!!!'+err
        });  }
        return res.status(200).send({
            status: 'success', 
           article:'El articulo '+ret.Name+' se ha eliminado'
        }); 
      });
},

createpedido:( req,res)=>{
  var params = req.body;
console.log(req.body)
 var  pedido= new Pedido();

     //Asignar valores
  //   pedido.Status__c= params.Status__c;
  pedido.Ciudad__c= params.Ciudad__c;
  pedido.cliente__c=params.cliente__c;
  pedido.Direccion__c=params.Direccion__c;
  pedido.Provincia__c=params.Provincia__c;
  pedido.total__c=params.total__c;
  console.log( params.total__c+"coidad")

    conn.sobject("Pedido__c").create({ Ciudad__c:   pedido.Ciudad__c, Provincia__c:pedido.Provincia__c, total__c:params.total__c, Direccion__c:   pedido.Direccion__c, Status__c:'Pendiente', cliente__c:  pedido.cliente__c}, function(err, ret) {
      if (err || !ret.success) { return console.error(err, ret); }
      
      // ...
      if(err){
        return res.status(404).send({
          status:'err',
          message:err
        })
      }else{
        return res.status(200).send({
          status: 'success', 
          message:ret
        })
    
        console.log("Created record id : " + ret.id);
      }
    
    });
  



},
  
getPedido: (req, res) => {

  //recoger el id de la URL

  var clienteID = req.query.id;
    console.log(clienteID+"id");
  //comprobar que existe
  if (!clienteID || clienteID == null) {
      return res.status(404).send({
          status: 'error',
          message: 'No existe el cliente!!'
      });
  }
  conn.query(`SELECT Id,cliente__r.Name, Status__c,  FechaPedido__c, total__c    FROM Pedido__c   WHERE  cliente__r.Id = '${clienteID}' ` , function(err, pedido) {
    if (err) {    console.log("err"+err) 
    return res.status(404).send({
      status: 'err', 
      message:err
    
  })}else{
     
    console.log(pedido);
          return res.status(200).send({
     
              status:'success',
              message:pedido.records
             
          })
      
 
  }

});
 




},


};
module.exports= controller;