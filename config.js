module.exports={
    port: process.env.PORT || 3900,
    db: process.env.MONGODB_URI || 'mongodb://localhost:27017/Musicarium',
    SECRET_TOKEN: 'miclavedetokens'
}