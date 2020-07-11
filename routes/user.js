const express = require('express')
const mongoose = require('mongoose')
const { Router } = require('express')
const router = express.Router()
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model('Post')
const User = mongoose.model('User')

router.get('/user/:id', requireLogin, (req, res) => {
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then(user => {
            Post.find({ postedBy: req.params.id })
                .populate("postedBy", "_id name")
                .exec((err, posts) => {
                    if (err) {
                        return res.status(422).json({ error: err })
                    }
                    return res.status(200).json({ user, posts })
                })
        }).catch(err => {
            return res.status(404).json({ error: "No user found" })
        })
})

router.put('/follow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        User.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId }
        }, {
            new: true
        }).select("-password").then(result => {
            return res.status(200).json(result)
        }).catch(err => {
            return res.status(422).json({ error: err })
        })
    })
})

router.put('/unfollow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.unfollowId }
        }, {
            new: true
        }).select("-password").then(result => {
            return res.status(200).json(result)
        }).catch(err => {
            return res.status(422).json({ error: err })
        })
    })
})

router.put('/updatepic',requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, {
        $set: { pic: req.body.pic }
    }, {
        new: true
    },
        (err, result) => {
            if (err) {
                res.status(422).json({ error: "Error during upload!" })
            }
            res.json(result)
        })
})

router.post('/searchusers',requireLogin, (req,res)=>{
    let userPattern = new RegExp("^" + req.body.query)
    User.find({name: {$regex: userPattern}})
    .select("_id name pic")
    .then(user =>{
        if(!user){
            res.status(404).json({error: "No user found!"})
        }
        res.json({user})
    })
    .catch(err => res.status(422).json({error: "Search not executed"}))
})

module.exports = router