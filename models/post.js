const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    comments: [{
        text: String,
        postedBy: { type: ObjectId, ref: "User" }
    }],
    likes: [
        {
            type: ObjectId, ref: "User"
        }
    ],
    postedBy: {
        type: ObjectId,
        ref: "User"
    }
},{
    timestamps: true
})

mongoose.model('Post', postSchema)