const mongoose = require('mongoose')
const { MONGOURI } = require('./config/key')

mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
})

mongoose.connection.on('connected', () => {
    console.log('connected to mongodb');
})

mongoose.connection.on('error', error => {
    console.log('error in connecting to mongodb', error);
})