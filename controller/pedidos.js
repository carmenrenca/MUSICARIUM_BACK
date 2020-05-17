'use strict'

var validator= require('validator');
var Pedido = require('../models/pedido');
var Articulo = require('../models/article');

var controller ={

 
createpedido:( req,res)=>{

  
    //recoger parametros por post 
    var params = req.body;

    console.log(params);

console.log(req);

        //crear el objeto a guardar
        var  pedido= new Pedido();
        pedido.Ciudad__c= params.Ciudad__c;
        pedido.cliente__c=params.cliente__c;
        pedido.Direccion__c=params.Direccion__c;
        pedido.Provincia__c=params.Provincia__c;
        pedido.email=params.email;
        pedido.total__c= params.total__c;  
        pedido.Status__c= params.Status__c;
        pedido.articulos=params.articulos;
        pedido.Infocliente=params.Infocliente;
        console.log( params.total__c+"coidad")
        //actualizar el stock de los articulos 
        pedido.articulos.forEach(Element=>{
            console.log(Element.stock__c+"STOCK")
            var stock = Element.stock__c -Element.unidad;
        console.log(stock+"resta");

            Articulo.findOneAndUpdate({_id:Element._id}, {$set:{stock__c:stock}}, (err, stockupdate)=>{
                if (err) {
                    console.log(err);
                   
                }else{
             console.log(stockupdate);
                  
                }
            })
        })
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

changeStatus:(req,res)=>{
    console.log(req.params.id);
    console.log(req.body.status)
       if(req.body.status!=''){
        Pedido.findByIdAndUpdate({_id:req.params.id},{$set:{Status__c:req.body.status}}, (err, pedidoupdate) =>{

            if (err) {
                console.log(err);
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al actualizar'
                });
            }else  if (!pedidoupdate) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el pedido!!'
                });
            }else{
         
                return res.status(200).send({
              
                    status: 'success',
                    article: pedidoupdate
                });
            }
          
        })
       }else{
        return res.status(200).send({
              
            status: 'error',
           message:'Elige un estado para actualizar el pedido'
        });
       }
  
},
getPedidoId: (req, res) => { 

    //recoger el id de la URL
  
    var clienteID =req.params.id;
      console.log(req.params.id);
  console.log(req)
      var query = Pedido.find({ _id: req.params.id});
  
      query.sort('-_id').exec((err, pedido) => {
  
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
  
  console.log(pedido);
  
          return res.status(200).send({
  
              status: 'success',
              pedido:pedido
  
  
          })
  
  
      })
  
  
  
  
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

  
getPedidoCliente: (req, res) => { 

    //recoger el id de la URL
    var clienteID =req.params.email;
      console.log(req.params.email);
  
      var query = Pedido.find({ email: req.params.email});
  
      query.sort('-email').exec((err, pedido) => {
  
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
  getCliente:(req, res)=>{
          
   
 console.log(req.params.status);
 var status=req.params.status;
 console.log(status);
// var cliente= req.params.email;
if(status){
   var query = Pedido.find({Status__c:status});

   query.sort('-Status__c').exec((err, pedido) => {
 
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
}else{
   var query = Pedido.find({});
 
   query.sort('-_id').exec((err, pedido) => {

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
}
 
 
 
  },
getAllPedidos: (req, res) => {

    //recoger el id de la URL
  
   
 console.log(req.params.status);
  var status=req.params.status;
  console.log(status);
 // var cliente= req.params.email;
 if(status){
    var query = Pedido.find({Status__c:status});

    query.sort('-Status__c').exec((err, pedido) => {
  
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
 }else{
    var query = Pedido.find({});
  
    query.sort('-_id').exec((err, pedido) => {

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
 }
  
  
  
  
  
  },
  

};
module.exports= controller;