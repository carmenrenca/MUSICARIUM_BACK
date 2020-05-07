'use strict'

var validator= require('validator');
var Pedido = require('../models/pedido');


var controller ={

 
createpedido:( req,res)=>{

  
    //recoger parametros por post 
    var params = req.body;

    console.log(params);



        //crear el objeto a guardar
        var  pedido= new Pedido();
        pedido.Ciudad__c= params.Ciudad__c;
        pedido.cliente__c=params.cliente__c;
        pedido.Direccion__c=params.Direccion__c;
        pedido.Provincia__c=params.Provincia__c;
        pedido.total__c= params.total__c;  
        pedido.Status__c= params.Status__c;
        console.log( params.total__c+"coidad")
        //asignar valores
                console.log(pedido);
        //guardar el articulo
        pedido.save((err, pedidoStore) => {


            if (err || !pedidoStore) {
                console.log(err);
                return res.status(404).send({
                    status: 'error',
                    message: 'El pedido se ha guardado correctamente !!'
                })
            }
            //devolver una respuesta
            return res.status(200).send({
                status: 'success',
                pedido: pedidoStore
            });
        });

  


},
  
getPedido: (req, res) => {

  //recoger el id de la URL

  var clienteID =req.query.cliente__c;
    console.log(req.query.cliente__c);

    var query = Pedido.find({ cliente__c: req.query.cliente__c});

    query.sort('-cliente__c').exec((err, pedido) => {

        if (err) {

            return res.status(500).send({
                status: 'error',
                message: 'Error  en el pedido!!',

            })
        }
        if (pedido.length == 0) {

            return res.status(404).send({
                status: 'error',
                message: 'No existe el pedido!!',

            })
        }



        return res.status(200).send({

            status: 'success',
            pedido:pedido


        })


    })




},


};
module.exports= controller;