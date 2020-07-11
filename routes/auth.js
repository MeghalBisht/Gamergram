const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const { JWT_SECRET } = require('../config/key')
const jwt = require('jsonwebtoken')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { SENDGRID_API, EMAIL_LINK } = require('../config/key')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: SENDGRID_API
    }
}))

router.post('/signin', (req, res) => {
    const { password, email } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "all fields are required" })
    }
    User.findOne({ email })
        .then(savedUser => {
            if (!savedUser) {
                res.status(422).json({ error: "Invalid email or password" })
            }
            else {
                bcrypt.compare(password, savedUser.password)
                    .then(matched => {
                        if (matched) {
                            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                            const { _id, name, email, followers, following, pic } = savedUser
                            res.json({ token, user: { _id, name, email, followers, following, pic } })
                        }
                        else {
                            res.status(422).send({ error: "Invalid email or password" })
                        }
                    })

            }
        })
        .catch(err =>
            console.log(err))
})

router.post('/google-login', (req, res) => {
    const { email } = req.body;
    User.findOne({ email })
        .then(user => {
            if (user) {
                const token = jwt.sign({ _id: user._id }, JWT_SECRET)
                const { _id, name, email, followers, following, pic } = user
                res.json({ token, user: { _id, name, email, followers, following, pic } })
            }
            else {
                res.status(422).send({ error: "No such user found!" })
            }
        }).catch(err => {
            res.status(422).json({ error: "Oops! Something went wrong" })
        })
})

router.post('/signup', (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
        return res.status(422).json({ error: "all fields are required" })
    }
    User.findOne({ email })
        .then(savedUser => {
            if (savedUser) {
                return res.status(422).json({ error: "User already exists" })
            }

            bcrypt.hash(password, 12)
                .then(hashedPass => {
                    const user = new User({
                        email,
                        name,
                        password: hashedPass,
                        pic
                    })
                    user.save()
                        .then(user => {
                            transporter.sendMail({
                                to: user.email,
                                from: "mailtomeghu25@gmail.com",
                                subject: `Signup successfully!`,
                                html: `<h3>
                                Welcome to Gamergram ${user.name}
                                </h3>
                                <p>Have a wonderful experience with us!</p>
                                <p>Waiting for you to pen down your first post </p>
                                <p>Regards Gamergram</p> 
                                `
                            })
                            res.json({ message: "User saved successfully" })
                        })
                        .catch(err =>
                            console.log(err)
                        )
                })
        })
        .catch(err => {
            console.log(err);
        })
})

router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
        }
        const token = buffer.toString("hex")
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    res.status(422).json({ error: "Email is invalid!" })
                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save()
                    .then((result) => {
                        transporter.sendMail({
                            to: user.email,
                            from: "mailtomeghu25@gmail.com",
                            subject: "Password Reset for Gamergram",
                            html: `
                    <h4>Password reset for ${user.email}</h4>
                    <p>Hey ${user.name},</p>
                    <p>Forgot your pasword? No worries, click on the link below to reset your password.</p>
                    <a href="${EMAIL_LINK}/reset/${token}">Reset Password</a>
                    `
                        })
                        res.json({ message: "Password change request sent at your email!" })
                    })
            })
    })
})

router.post('/new-password', (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(422).json({ error: "Session expired, try again!" })
            }
            bcrypt.hash(newPassword, 12)
                .then(hashedPassword => {
                    user.password = hashedPassword
                    user.resetToken = undefined
                    user.expireToken = undefined
                    user.save().then(savedUser => {
                        res.json({ message: "Bravo! password changed" })
                    }).catch(error => {
                        res.status(422).json({ error: "Oops! It's not you it's us,try again" })
                    })
                })
        })
        .catch(err => {
            res.status(422).send({ error: "Something went wrong!" })
        })
})


module.exports = router