const express = require('express');
const PORT = process.env.PORT || 5000;
require('./db')
const mongoose = require('mongoose')
const cors = require('cors')
require('./models/user')
require('./models/post')
const app = express()
const path = require('path')


app.use(cors())
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if (process.env.NODE_ENV === "production") {
    app.use(express.static('client/build'))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}


app.listen(PORT, () => {
    console.log(`app is running on ${PORT} port`);
})