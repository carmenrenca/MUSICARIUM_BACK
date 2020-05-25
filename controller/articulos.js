'use strict'
var validator = require('validator');
var Article = require('../models/article');
var Favorito = require('../models/favorito');
var Categoria = require('../models/categoria');
var fs = require('fs');
var path = require('path');
var nodemailer = require('nodemailer');
const hbs =require('nodemailer-express-handlebars');
var controller = {

    datosCurso: (req, res) => {
        var hola = req.body.hola;

        return res.status(200).send({
            curso: 'Master en Framenworks JS',
            autor: 'carmen Rendon WEB',
            URL: 'carmenrendon.es',
            hola

        });


    },

    decotoken: (req, res) => {

        try{
            var token = req.params.token;
            var tokendeco =index.decodeToken(token);
            return res.status(200).send({
                curso: 'token deco',
              tokendeco
    
            });
        }catch(err){
            return res.status(500).send({
                curso: 'error al devolver el token decodificado',
             
                tokendeco
    
            });
        }
    


    },

    test: (req, res) => {
        console.log(req.body);
        return res.status(200).send({
            message: 'Soy la acción test de mi controlador de articulos'
        });
    },

    //CREAR NUEVO ARTICULO

    save: (req, res) => {

        //recoger parametros por post 
        var params = req.body;

        console.log(req);

        //VALIDAR DATOS
        try {
            var validateName = !validator.isEmpty(params.Name);
            console.log(params.Name);
            var validate_Precio__c = !validator.isEmpty(params.Precio__c);
            var validate_Descripcion__c = !validator.isEmpty(params.Descripcion__c);
        //    var validate_Cantidad__c = !validator.isEmpty(params.Cantidad__c);
             var validate_stock__c = !validator.isEmpty(params.stock__c);
           //   var validate_img__c = validator.isEmpty(params.img__c);
        } catch (err) {
           console.log("entra en catch"+err)
            return res.status(200).send({
                message: 'Datos No validos!!'
            });
        }

        if (validateName && validate_Precio__c && validate_Descripcion__c  && validate_stock__c) {
            //crear el objeto a guardar
            var article = new Article();
            article.Name = params.Name;
            article.Precio__c = params.Precio__c;
            article.Descripcion__c = params.Descripcion__c;
            article.Descuento=params.Descuento;
            article.PrecioFinal=0;
            article.imagen = null;
            article.categoria=params.categoria;
            article.stock__c=params.stock__c;
            //CALCULAR EL DESCUENTO DE LOS ARTICULOS
if(article.Descuento){
    article.Descuento=article.Descuento/100;
    var aux=0;
  aux= ( article.Descuento*params.Precio__c);
  article.PrecioFinal=params.Precio__c- aux;
  console.log(article.PrecioFinal)  
  article.PrecioFinal=Math.round(article.PrecioFinal)-0.01;
}else{
    article.PrecioFinal=article.Precio__c;
}
    console.log(article.PrecioFinal)        //guardar el articulo
            article.save((err, articleStore) => {


                if (err || !articleStore) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El artículo no se ha guardado !!'
                    })
                }
                //devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStore,
                    message:'El Articulo se ha guardado correctamente!!'
                });
            });

        } else {
            console.log("Los datos no son validos!!")
            return res.status(200).send({
               
                status: 'error',
                message: 'Los datos no son validos!!'
            });
        }

    },

    //SACAR TODOS LOS ARTÍCULOS
cerrarsession:(req, res)=>{
    
    Article.update(
      
        { like : "like" }, { $set:{ like : "dislike" } }, { multi : true } ,
        function(err, result) {
          if (err) {
           console.log("err singin")
          } else {
            console.log(result);
          }
        }
      );
},
    getArticles: (req, res) => {

        var query = Article.find({});
        var Arrayarticles=[];
        var last = req.params.last;
  
        if (last || last != undefined) {
            query.limit(5);
        }

        //Find sacar los datos de la bd
        query.sort('-_id').exec((err, articles) => {

            var queryfav = Favorito.find({cliente: req.params.email});
            queryfav.sort('-cliente').exec((err, res) => {
              
     

        var iguales=0;
for(var i=0;i<articles.length;i++)
{        
	for(var j=0;j<res.length;j++)
	{


		if(articles[i]._id==res[j].Idfav){
      Arrayarticles.push(res[j]);
      articles[i].like=true
                console.log(articles[i].like)
           articles.push(res[j]);
        }else{
            Arrayarticles.push(articles[i]);
            articles[i].like=false
        }

	}
}
       });

        console.log("00"+Arrayarticles)

    console.log("entraa");
    return res.status(200).send({
        status: 'success',
        articles
    });

      
           
        });

    

    },


    getArticle: (req, res) => {

        //recoger el id de la URL

        var articleId = req.params.id;

        //comprobar que existe
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo!!'
            });
        }

        //buscar el articulo
        Article.findById(articleId, (err, article) => {
            if (err || !article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulos!!'
                });
            }
            return res.status(200).send({
                status: 'success',
                article
            });
        });
        //Devolver en json

    },


    getArticleCategoria: (req, res) => {

        //recoger el id de la URL
        console.log("entra en article categoria")
      
        var categoria = req.params.categori;
console.log(categoria);
        //comprobar que existe
        if (!categoria || categoria == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe la categoria!!'
            });
        }
     
        //buscar el articulo
        Article.find({"categoria":categoria}, (err, article) => {

            if (err || !article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulos!!'
                });
            }else{
                return res.status(200).send({
                    status: 'success',
                    article
                });
            }
         
        });
        //Devolver en json

    },
    //EDITAR ARTICULOS

    update: (req, res) => {
console.log("editaa")
        //Recoger el ID del articulo por la URL

        var articleId = req.params.id;


        //Regoger los datos que llegan por put 
        var params = req.body;

        //Validar datos
        console.log(params);
        try {
            var validate_title = !validator.isEmpty(params.Name);
            var validate_content = !validator.isEmpty(params.Descripcion__c);
         //   var validate_precio = !validator.isEmpty(params.Precio__c);
          //  var validate_stock__c=  !validator.isEmpty(params.stock__c);
        //    var validate_categoria=  !validator.isEmpty(params.categoria);
            //var precio=  !validator.isEmpty(params.precio);

        } catch (err) {
            console.log(err);
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar!!'
            });

        }

        if (validate_title && validate_content) {
            //Find and Update
            console.log("entraa" + articleId);
            Article.findOneAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdate) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar'
                    });
                }


                if (!articleUpdate) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articulo!!'
                    });
                }
                return res.status(404).send({
                    status: 'success',
                    article: articleUpdate
                });

            });
        } else {
            return res.status(200).send({
                status: 'error',
                message: 'La validación no es correcta'
            });
        }


    },

    //ELIMINAR ARTICULO

    delete: (req, res) => {


        //RECOGER EL ID DEL LA URL
        var articleId = req.params.id;

        //fing and delete

        Article.findOneAndDelete({ _id: articleId }, (err, articleremove) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al eliminar'
                });
            }
            if (!articleremove) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo!!'
                });
            }
            return res.status(200).send({
                status: 'succes',
                article: articleremove
            });

        });



    },

    //SUBIDA DE ARCHIVOS 
    image:(req,res)=>{
        return res.status(200).send({
            status: 'succes',
            message: 'entroo'
        });
    },
    upload: (req, res) => {
        var path = require('path');
        //configurar el modulo connect multiparty router/article.js (hecho)

            console.log("22222")
        //recoger el fichero de la peticion 
        var file_name = 'imagen no subida..';

        console.log(req.files+"filessss");
        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }
        //conseguir el nombre y la extensión del archivo

        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        var file_name = file_split[2];

        //extension del fichero 
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        //comproba la extencion (solo imagenes )

        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
            //borrar el artivo subido
            console.log("entra");
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: "error",
                    message: 'La extension de la imagen no es valida!!!'
                });
            })
        } else {
            //Si todo es valido, bucar el artículo asignarle el nombre la img y actualizar
            var articleId = req.params.id;
            console.log(articleId);
            Article.findOneAndUpdate({ _id: articleId }, { imagen: file_name }, { new: true }, (err, articleUpdated) => {
                console.log(articleUpdated);
                if (err || !articleUpdated) {
                    return res.status(200).send({
                        status: "error",
                        message: "Error al guardar la imagen de articulo"
                    });
                }

                return res.status(200).send({
                    status: "success",
                    article: articleUpdated
                });
            });


        }



    },

    getImage: (req, res) => {
        var file = req.params.image;
        console.log(file);
        var path_file = './upload/articles/' + file;

        fs.exists(path_file, (exists) => {
            console.log(exists);
            if (exists) {
                console.log("exiii");
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });
            }
        });
    },

    search: (req, res) => {

        //SACAR EL STRING A BUSCAR

        var searchstring = req.params.search;


        //FIND OR
        Article.find({
            "$or": [
                { "title": { "$regex": searchstring, "$options": "i" } },
                { "content": { "$regex": searchstring, "$options": "i" } },

            ]
        }).sort([['date', 'descending']]).exec((err, articles) => {


            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: "Error en la petición!!!"

                });
            }
            if (!articles || articles.length <= 0) {
                return res.status(404).send({
                    status: 'error',
                    message: "No hay articulos para mostrar con tu busquedad!!"

                });
            }
            return res.status(200).send({
                status: 'success',
                articles

            });
        })



    },

    
    searchCategoria: (req, res) => {

        //SACAR EL STRING A BUSCAR

        var searchstring = req.params.search;


        //FIND OR
        Article.find({
            "$or": [
                { "categoria": { "$regex": searchstring, "$options": "i" } },
              

            ]
        }).sort([['date', 'descending']]).exec((err, articles) => {


            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: "Error en la petición!!!"

                });
            }
            if (!articles || articles.length <= 0) {
                return res.status(404).send({
                    status: 'error',
                    message: "No hay articulos para mostrar con tu busquedad!!"

                });
            }
            return res.status(200).send({
                status: 'success',
                articles

            });
        })



    },


    
    saveCategori: (req, res) => {
console.log("eeentra")
        //recoger parametros por post 
        var params = req.body;

        console.log(params);

        //VALIDAR DATOS
        try {
            var validateTitle = !validator.isEmpty(params.title);
           
        } catch (err) {
            status: 'error'
            return res.status(200).send({
                message: 'Faltan datos por enviar!!'
            });
        }

        if (validateTitle) {
            //crear el objeto a guardar
            var categoria = new Categoria();
            categoria.title = params.title;
            categoria.imagen = null;
          categoria.artitulos=null;
            //asignar valores

            //guardar el articulo
            categoria.save((err, categoriaStore) => {


                if (err || !categoriaStore) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'La categoria no se ha guardado !!'
                    })
                }
                //devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    categoria: categoriaStore
                });
            });

        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos!!'
            });
        }

    },

    getArticle: (req, res) => {

        //recoger el id de la URL

        var articleId = req.params.id;

        //comprobar que existe
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo!!'
            });
        }

        //buscar el articulo
        Article.findById(articleId, (err, article) => {

            if (err || !article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulos!!'
                });
            }
            return res.status(200).send({
                status: 'success',
                article
            });
        });
        //Devolver en json

    },

    getCategoria: (req, res) => {

        var query = Categoria.find({});

        var last = req.params.last;

        if (last || last != undefined) {
            query.limit(5);
        }

        //Find sacar los datos de la bd
        query.sort('-_id').exec((err, Categoria) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error  al  devolver la categoria!!'
                })
            }

            if (!Categoria) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay categoria para mostrar!!'
                })
            }

            return res.status(200).send({
                status: 'success',
                Categoria
            });
        });


    },

    deleteCategori: (req, res) => {

        //RECOGER EL ID DEL LA URL
        var categoriId = req.params.id;

        //fing and delete
            console.log(categoriId);
        Categoria.findOneAndDelete({ _id: categoriId }, (err, categoriaremove) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al eliminar'
                });
            }
            if (!categoriaremove) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe la categoria!!'
                });
            }
            return res.status(200).send({
                status: 'succes',
                categoria: categoriaremove
            });

        });



    },

    sendEmail:(req,res)=>{
// email sender function
console.log("%%%%%%%%%%%%%%%%%%%%%");
console.log(req.params.correo);
    // Definimos el transporter
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            host: "my.smtp.host",
  port: 465,
  secure: true,
            auth: {
                user: 'musicarium123@gmail.com',
                pass: 'renca3599'
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
              }
        });
    
        
    // Definimos el email
    var mailOptions = {
        from: 'musicarium123@gmail.com',
        to: req.params.correo,
        subject: 'Gracias por tu pedido',
        html : { path: './views/index.html' }

        
    };


    transporter.verify(function(error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log("Server is ready to take our messages");
        }
      });
    // Enviamos el email
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
    });
    },
    search: (req, res) => {

        //SACAR EL STRING A BUSCAR

        var searchstring = req.params.search;
console.log(searchstring+"string search")

        //FIND OR
        Article.find({
            "$or": [
                { "Name": { "$regex": searchstring, "$options": "i" } },
                { "Descripcion__c": { "$regex": searchstring, "$options": "i" } },

            ]
        }).sort([['date', 'descending']]).exec((err, articles) => {


            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: "Error en la petición!!!"

                });
            }
            if (!articles || articles.length <= 0) {
                return res.status(404).send({
                    status: 'error',
                    message: "No hay articulos para mostrar con tu busquedad!!"

                });
            }
            return res.status(200).send({
                status: 'success',
                articles

            });
        })



    },
    addfavorito:(req,res)=>{
        var params = req.body;

        
            //crear el objeto a guardar
            var article = new Favorito();
         
            article.Name = params.Name;
            article.cliente=req.params.email;
            article.Idfav=params._id;
            article.imagen = params.imagen;
         var query= {cliente: req.params.email, Idfav: article.Idfav}
            //comprobar que ese articulo no esté ya en favorti
      
            
       Favorito.find( {cliente: req.params.email, Name: article.Name} ,function(err, result){
           if(err){
               console.log(err)
           }else{
               console.log(result)
               if(result.length==0){
                   //guardar el articulo

            article.save((err, articleStore) => {
 

                if (err || !articleStore) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El artículo no se ha guardado !!'
                    })
                }
                //devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStore,
                    message:'El Articulo se ha guardado en fav!!'
                });
            });

               }else{
                return res.status(200).send({
                    status: 'error',
               
                    message:'El Articulo ya se ha guardado en fav!!'
                });
               }
           }
       });

           

    },

    getfavoritos:(req, res)=>{ 
    
        var query = Favorito.find({cliente: req.params.email});
        

        //Find sacar los datos de la bd
        query.sort('-cliente').exec((err, articles) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error  al  devolver los favoritos!!'
                })
            }

            if (!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos en favoritos!!'
                })
            }

            return res.status(200).send({
                status: 'success',
                articles
            });
        });

    },

    deletefavorito:(req, res)=>{
          //RECOGER EL ID DEL LA URL
          
          var favid = req.params.id;

        var cliente= req.body.email;

          //fing and delete
              console.log(favid);
              console.log(cliente);
              var article = new Favorito();
            
        

              Favorito.findOneAndDelete({ Idfav: favid, cliente:cliente }, (err, favremove) => {
              if (err) {
                  return res.status(500).send({
                      status: 'error',
                      message: 'Error al eliminar'
                  });
              }
              if (!favremove) {
                  return res.status(404).send({
                      status: 'error',
                      message: 'No existe el articulo en favoritos!!'
                  });
              }
              return res.status(200).send({
                  status: 'succes',
                  article: favremove
              });
  
          });
  
  
    },

    getfavorito: (req, res) => {

        //recoger el id de la URL

        var articleId = req.params.id;
            var cliente= req.body.email;
            
            console.log(cliente);
        //comprobar que existe
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo!!'
            });
        }

        //buscar el articulo

        var query = Favorito.find({ Idfav: articleId, cliente:cliente});

        query.sort('-Idfav').exec((err, user) => {
            if (err) {

                return res.status(500).send({
                    status: 'error',
                    message: 'Error no se encuentra el articulo en fav!!',

                })
            }
            if (user.length == 0) {

                return res.status(404).send({
                    status: 'error',
                    message: 'No Existe!!',

                })
            }



            req.user = user

            return res.status(200).send({

                message: 'Existe',
         


            })


        })
    

    },

}; //end controller

module.exports = controller;