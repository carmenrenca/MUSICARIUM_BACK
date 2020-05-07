'use strict'

var jwt = require('jwt-simple');
const moment = require('moment')
const config = require('../config')

function createToken (user) {
console.log(user)
  console.log("crear el token")
  const payload = {
    sub: user[0]._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix(),
    role:user[0].rol,
    nombre:user[0].nombre,
    apellido:user[0].apellido,
    email:user[0].email
  }
console.log(payload);
  return jwt.encode(payload, config.SECRET_TOKEN)
}

function createTokenRegistre (user) {
  console.log(user)
    console.log("crear el token")
    const payload = {
      sub: user._id,
      iat: moment().unix(),
      exp: moment().add(14, 'days').unix(),
      role:user.rol,
      nombre:user.nombre,
      apellido:user.apellido,
      email:user.email
    }
  console.log(payload);
    return jwt.encode(payload, config.SECRET_TOKEN)
  }

function decodeToken (token) {
  const decoded = new Promise((resolve, reject) => {
    try {
      const payload = jwt.decode(token, config.SECRET_TOKEN)

      if (payload.exp <= moment().unix()) {
        reject({
          status: 401,
          message: 'El token ha expirado'
        })
      }
      resolve(payload.sub)
    } catch (err) {
      reject({
        status: 500,
        message: 'Invalid Token'
      })
    }
  })
console.log(decoded);
  return decoded
}



module.exports = {
  createToken,
  decodeToken,createTokenRegistre
}