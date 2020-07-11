const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/key')
const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        res.status(422).json({ error: "you must be logged in!" })
    }
    const token = authorization && authorization.replace("Bearer ", "")
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
            res.status(422).json({ error: "you must be logged in!" })
        }
        const { _id } = payload
        User.findById(_id)
            .then(userdata => {
                req.user = userdata
                next()
            })
            .catch(err => console.log(err))
    })
}