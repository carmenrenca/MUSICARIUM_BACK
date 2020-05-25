'use strict'

var validator= require('validator');
var Pedido = require('../models/pedido');
var Articulo = require('../models/article');
const PDFDocument = require("pdfkit");

const fs = require('fs');

function generateCustomerInformation(doc, invoice) {
    doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Info Pedido", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("ID Pedido:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.invoice_nr, 150, customerInformationTop)
    .font("Helvetica")
    .text("Date:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text("Estado:", 50, customerInformationTop + 30)
  

    .font("Helvetica-Bold")
    .text(invoice.estado, 150, customerInformationTop+30)
    .font("Helvetica")
    .text(invoice.cliente.nombre+" "+invoice.cliente.apellido, 300, customerInformationTop + 15)
    .text(
        invoice.cliente.direccion +
        ", " +
        invoice.shipping.state +
        ", " +
        invoice.shipping.country,
      300,
      customerInformationTop + 30
    )
    .moveDown();

  generateHr(doc, 252);
  }

  function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
  
    return year + "/" + month + "/" + day;
  }
  function generateTableRow(doc, y, c1, c2, c3, c4, c5) {
    doc
      .fontSize(10)
      .text(c1, 50, y)
      .text(c2, 250, y)
      .text(c3, 280, y, { width: 90, align: "right" })
      .text(c4, 370, y, { width: 90, align: "right" })
      .text(c5, 0, y, { align: "right" });
  }
  function generateFooter(doc) {
    doc
      .fontSize(10)
      .text(
        "Payment is due within 15 days. Thank you for your business.",
        50,
        780,
        { align: "center", width: 500 }
      );
  }

  
function generateHr(doc, y) {
    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }
  
  function generateInvoiceTable(doc, invoice) {
    let i,
      invoiceTableTop = 360;
  
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Nombre",
    "Precio",
    "Precio unidad",

    "Line Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

    for (i = 0; i < invoice.items.length; i++) {
      const item = invoice.items[i];
      const position = invoiceTableTop + (i + 1) * 60;
      generateTableRow(
        doc,
        position,
        item.Name,
        item.Precio__c,
        item.unidad,
        item.Precio__c*item.unidad
     
       
      );
    }
    const subtotalPosition = invoiceTableTop + (i + 1) * 60;
    generateTableRow(
      doc,
      subtotalPosition,
      "",
     
      "Subtotal",
      "",
      invoice.subtotal+"€"
    );
  
    const paidToDatePosition = subtotalPosition + 50;
    generateTableRow(
      doc,
      paidToDatePosition,
      "",
  
      "Total",
      "",
     invoice.paid+"€"
    );
    
  }


var controller ={

   
      
createPDF:(req, res)=>{
    console.log("createpdf")
    console.log(req);

    var items = req.body.articulos;
    var cliente=req.body.Infocliente[0];
    console.log("CLLLIIIIENTEE")
console.log(cliente)
    const invoice = {
        shipping: {
          name: "John Doe",
          address: "1234 Main Street",
          city: "Sevilla",
          state: "CA",
          country: "ES",
          postal_code: 4234
        },
           items, cliente,
        subtotal: req.body.total__c,
        paid:  req.body.total__c,
        invoice_nr: req.body._id,
        estado:req.body.Status__c,
      };

 
      let doc = new PDFDocument({ margin: 50 });

    var pedidoId = req.body._id;
    var namepdf= pedidoId+'.pdf'
    console.log(namepdf);

doc
.image("./upload/logo.jpg", 50, 45, { width: 50 })
.fillColor("#444444")
.fontSize(20)
.text("MUSICARIUM.", 110, 57)
.fontSize(10)
.text("123 Main Street", 200, 65, { align: "right" })
.text("España, ES, 10025", 200, 80, { align: "right" })
.moveDown();
generateCustomerInformation(doc, invoice);
generateInvoiceTable(doc, invoice);
generateFooter(doc);
doc.end();
doc.pipe(fs.createWriteStream('./upload/pdf/'+namepdf));


Pedido.findOneAndUpdate({ _id: pedidoId }, { pdf: namepdf }, { new: true }, (err, pedidoUpdated) => {
    console.log(pedidoUpdated);
    if (err || !pedidoUpdated) {
        return res.status(200).send({
            status: "error",
            message: "Error al guardarel pdf del pedido"
        });
    }

    return res.status(200).send({
        status: "success",
        article: pedidoUpdated
    });
});




},
 
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


getPDF:(req,res)=>{
    console.log("EENTRAA")
    console.log(req);
  var  name=req.params.id;
     console.log(name);
    var file = './upload/pdf/'+name+'.pdf';   
    res.download(file, function (err) {
        if (err) {
            console.log("Error");
            console.log(err);
        } else {
            console.log("Success");
        }    
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

    var query = Pedido.find({ email: req.query.cliente__c});

    query.sort('-email').exec((err, pedido) => {
        console.log(pedido)

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
  console.log("eeeeeee")
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