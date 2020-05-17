var validator = require('validator');
var Cliente = require('../models/cliente');
const User = require('../models/user')
var fs = require('fs');
var path = require('path');

const service = require('../services')
//var nodemailer = require('nodemailer');


  
var controller = {

    datosCurso: (req, res) => {


        return res.status(200).send({
            status:'success',
            curso: 'Estoy en cliente',
            autor: 'carmen Rendon WEB',
            URL: 'carmenrendon.es',


        });


    },


    save: (req, res) => {

        //recoger parametros por post 
        var params = req.body;
        var validate_email = !validator.isEmpty(params.email);
        var validate_password = !validator.isEmpty(params.password);
        console.log(params);

        //VALIDAR DATOS
        try {
            var validateNombre = !validator.isEmpty(params.nombre);
            var validate_apellido = !validator.isEmpty(params.apellido);
            var validate_telefono = validator.isMobilePhone (params.telefono,'sk-SK', 'sr-RS');
            var validate_direccion = !validator.isEmpty(params.direccion);
            var validate_email = validator.isEmail(params.email);
            var validate_dni = !validator.isEmpty(params.dni);
            var validate_password = !validator.isEmpty(params.password);
            var validate_rol = !validator.isEmpty(params.rol);
        } catch (err) {
          
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar!!'
            });
        }

        if (validateNombre && validate_password && validate_dni && validate_apellido && validate_telefono && validate_direccion && validate_email && validate_rol) {
            //crear el objeto a guardar
            var cliente = new Cliente();
            cliente.nombre = params.nombre;
            cliente.apellido = params.apellido;
            cliente.direccion = params.direccion;
            cliente.telefono = params.telefono;
            cliente.email = params.email;
            cliente.dni = params.dni;
            cliente.password= params.password;
            cliente.rol = params.rol;




            //asignar valores

            //guardar el articulo

            cliente.save((err, clienteStore) => {


                if (err || !clienteStore) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El cliente no se ha guardado !!'
                    })
                }
                //devolver una respuesta

                return res.status(200).send({
                    status: 'success',
                    article: clienteStore
                });
            });

        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos!!'
            });
        }

    },

    //SACAR TODOS LOS CLIENTES

    getClientes: (req, res) => {

        var query = User.find({});

        var last = req.params.last;

        if (last || last != undefined) {
            query.limit(2);
        }

        //Find sacar los datos de la bd
        query.sort('-id').exec((err, clientes) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error  al  devolver los articulos!!'
                })
            }

            if (!clientes) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar!!'
                })
            }

            return res.status(200).send({
                status: 'success',
                clientes
            });
        });


    },
    getCliente: (req, res) => {

        //recoger el id de la URL

        var clienteId = req.params.id;
console.log(clienteId+"IDD")
        //comprobar que existe
        if (!clienteId || clienteId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el cliente!!'
            });
        }

        //buscar el articulo
        User.findById(clienteId, (err, cliente) => {

            if (err || !cliente) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el cliente!!'
                });
            }
            return res.status(200).send({
                status: 'success',
                cliente
            
            });
        });
        //Devolver en json

    },
    //ELIMINAR ARTICULO

    delete: (req, res) => {


        //RECOGER EL ID DEL LA URL
        var clienteId = req.params.id;

        //fing and delete

        User.findOneAndDelete({ _id: clienteId }, (err, clienteremove) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al eliminar'
                });
            }
            if (!clienteremove) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el cliente!'
                });
            }
            return res.status(200).send({
                status: 'succes',
                article: clienteremove
            });

        });



    },
    search: (req, res) => {

           //SACAR EL STRING A BUSCAR

        var searchstring = req.params.search;


        //FIND OR
        Cliente.find({
            "$or": [
                { "nombre": { "$regex": searchstring, "$options": "i" } },
                { "apellido": { "$regex": searchstring, "$options": "i" } },
                { "dni": { "$regex": searchstring, "$options": "i" } },
                { "direccion": { "$regex": searchstring, "$options": "i" } },
                { "email": { "$regex": searchstring, "$options": "i" } },
                { "rol": { "$regex": searchstring, "$options": "i" } },

            ]
        }).sort([['date', 'descending']]).exec((err, clientes) => {


            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: "Error en la petición!!!"

                });
            }
            if (!clientes || clientes.length <= 0) {
                return res.status(404).send({
                    status: 'error',
                    message: "No hay articulos para mostrar con tu busquedad!!"

                });
            }
            return res.status(200).send({
                status: 'success',
                clientes

            });
        })



    },

    updateEmail: (req, res) => {
      
                var email= req.params.email;
        
                var params = req.body;

                console.log(params.email);
                try {
                    var validate_email = !validator.isEmpty(params.email);
                    var validate_password = !validator.isEmpty(params.password);
              
        
                } catch (err) {
                    console.log(err);
                    return res.status(200).send({
                        status: 'error',
                        message: 'Faltan datos por enviar!!'
                    });
        
                }
                var query = User.find({ password: req.body.password });

           
                console.log("password"+req.body.password)
                query.sort('-password').exec((err, pass) => {
           console.log(pass);
                    if (pass.length==0) { 
                       
                        return res.status(500).send({
                            status: 'error',
                            message: 'La contraseña no existe'
                        });
                     
                    }else{
                        if (validate_email  ) {
                            //Find and Update
                           console.log("3333"+ email)
                            User.findOneAndUpdate({ email: email }, {$set: {email: req.body.email}}, { new: true }, (err, articleUpdate) => {
                                if (err) {
                                    return res.status(500).send({
                                        status: 'error',
                                        message: 'Error al actualizar'
                                    });
                                }
                console.log(articleUpdate)
                
                                if (!articleUpdate) {
                                    return res.status(404).send({
                                        status: 'error',
                                        message: 'error al actualizar la direccion'
                                    });
                                }
                                return res.status(200).send({
                                    status: 'success',
                                    article: articleUpdate
                                });
                
                            })
                        } else {
                            return res.status(200).send({
                                status: 'error',
                                message: 'La validación no es correcta'
                            });
                        }
                    } 

                });
         

              
        
        
            },

            updatePassword: (req, res) => {
             
                        var email= req.params.email;
                
                        //Regoger los datos que llegan por put 
                        var params = req.body;
                
                        try {
                          
                            var validate_password = !validator.isEmpty(params.password);
                            var validate_passwordNew = !validator.isEmpty(params.passwordNew);
                
                        } catch (err) {
                            console.log(err);
                            return res.status(200).send({
                                status: 'error',
                                message: 'Faltan datos por enviar!!'
                            });
                
                        }
                        var querypass = User.find({ password: req.body.password });
        
                        querypass.exec((err, pass) => {
                            if (pass.length == 0) {
                                return res.status(404).send({
                                    status: 'error',
                                    message: 'No existe la contraseña!!',
                    
                                })
                                
                            } else{
                                if (validate_passwordNew ) {
                                    //Find and Update
                                   
                                    User.findOneAndUpdate({ email: email }, {$set: {password: req.body.passwordNew}}, { new: true }, (err, articleUpdate) => {
                                        if (err) {
                                            return res.status(500).send({
                                                status: 'error',
                                                message: 'Error al actualizar'
                                            });
                                        }
                        console.log(articleUpdate)
                        
                                        if (!articleUpdate) {
                                            return res.status(404).send({
                                                status: 'error',
                                                message: 'error al actualizar la contraseña'
                                            });
                                        }
                                        return res.status(200).send({
                                            status: 'success',
                                            article: articleUpdate,
                                            message:'Contraseña actualizada!!'
                                        });
                        
                                    });
                                } else {
                                    return res.status(200).send({
                                        status: 'error',
                                        message: 'La validación no es correcta'
                                    });
                                }
                            }
                    
                    
                        })

                      
                
                
                    },

}//end controller

module.exports = controller;