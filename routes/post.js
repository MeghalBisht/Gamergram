const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model('Post')

mongoose.set('useFindAndModify', false);

router.put('/deletecomment/:commentId', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { comments: { _id: req.params.commentId } }
    }, {
        new: true
    })
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name pic")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
            res.status(200).json(result)
        })
})

router.delete('/deletepost/:postId', requireLogin, (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id name pic")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({ error: err })
            }
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post.remove()
                    .then(result => res.json(result))
                    .catch(err => console.log(err))
            }
        })
})

router.put('/comment', requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true
    })
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.status(200).json(result)
            }
        })
})

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    })
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name pic")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.status(200).json(result)
            }
        })
})

router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    })
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name pic")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.status(200).json(result)
            }
        })
})

router.get('/mypost', requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name pic")
        .sort('-createdAt')
        .then(posts => {
            if (!posts) {
                return res.send({ message: "No posts" })
            }
            res.send({ posts: posts })
        })
        .catch(err => console.log(err))
})

router.get('/allposts', requireLogin, (req, res) => {
    Post.find()
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name")
        .sort('-createdAt')
        .then(posts => {
            if (!posts)
                res.send({ message: "No posts" })
            res.send({ posts: posts })
        })
        .catch(err => console.log(error))
})

// Paginated post fetching api
router.get('/allposts/:page', requireLogin, (req, res) => {
    const page = req.params.page;
    Post.find()
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name")
        .sort('-createdAt').skip(5*(page-1)).limit(5)
        .then(posts => {
            if (!posts)
                res.send({ message: "No posts" })
            res.send({ page:page, posts: posts })
        })
        .catch(err => console.log(error))
})

router.get('/followerspost', requireLogin, (req, res) => {
    Post.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name")
        .sort('-createdAt')
        .then(posts => {
            if (!posts)
                res.send({ message: "No posts" })
            res.send({ posts: posts })
        })
        .catch(err => {
            res.status(422).send({ error: err })
        })
})

router.post('/createpost', requireLogin, (req, res) => {
    const { body, pic } = req.body;
    if (!body || !pic)
        res.status(422).send({ error: "All fields are required" })
    req.user.password = undefined
    const post = new Post({
        body,
        photo: pic,
        postedBy: req.user
    })
    post.save()
        .then(post => res.json({ post: post }))
        .catch(err => console.log(err))
})

router.get('/singlepost/:id', requireLogin, (req, res) => {
    Post.findOne({ _id: req.params.id })
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name")
        .then(post => {
            if (!post) {
                return res.send({ message: "No post" })
            }
            res.send({ post: post })
        })
        .catch(err => console.log(err))
})

module.exports = router