import React, { useState, useEffect, useContext } from 'react'
import '../../Styles/Home.css'
import { Link } from 'react-router-dom'
import Loading from './Loading'
import { UserContext } from '../../App'
import M from 'materialize-css'
import { relativeDate } from '../../Utils/date-util.js';

function Home() {

    const { state } = useContext(UserContext)
    const [loading, setLoading] = useState(true)
    const [miniLoading, setMiniLoading] = useState(false)
    const [posts, setPosts] = useState([])
    useEffect(() => {
        fetch('/allposts', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(data => {
                setPosts(data.posts)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }, [])

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                text,
                postId
            })
        }).then(res => res.json())
            .then(data => {
                const newData = posts.map(post => {
                    if (post._id === data._id) {
                        return data
                    } else {
                        return post
                    }
                })
                setPosts(newData)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const likePost = (id) => {
        setMiniLoading(true)
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(data => {
                const newData = posts.map(post => {
                    if (post._id === data._id) {
                        return data
                    } else {
                        return post
                    }
                })
                setPosts(newData)
                setMiniLoading(false)
            })
            .catch(err => {
                setMiniLoading(false)
                console.log(err)
            })
    }

    const unlikePost = (id) => {
        setMiniLoading(true)
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(data => {
                const newData = posts.map(post => {
                    if (post._id === data._id) {
                        return data
                    } else {
                        return post
                    }
                })
                setPosts(newData)
                setMiniLoading(false)
            })
            .catch(err => {
                setMiniLoading(false)
                console.log(err)
            })
    }

    const deletePost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                const newData = posts.filter(post => {
                    return post._id !== result._id
                })
                setPosts(newData)
                M.Toast.dismissAll()
                M.toast({ html: "Post deleted", classes: "#43a047 green darken-1" })
            })
            .catch(err => console.log(err))
    }

    const deleteComment = (postId, commentId) => {
        fetch(`/deletecomment/${commentId}`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId
            })
        }).then(res => res.json())
            .then(data => {
                const newData = posts.map(post => {
                    if (post._id === data._id) {
                        return data
                    } else {
                        return post
                    }
                })
                setPosts(newData)
                M.Toast.dismissAll()
                M.toast({ html: "Comment deleted", classes: "#43a047 green darken-1", displayLength: 1800 })
            })
            .catch(err => {
                console.log(err)
            })
    }

    if (loading || !posts) {
        return (
            <Loading />
        )
    } else {
        return (
            <div className="homeContainer">
                <div className="home-create-post">
                    <Link to="/create">
                        <h5>
                            <i className="unlike material-icons">create</i>
                        Create Post
                        </h5>
                    </Link>
                </div>
                {
                    posts.map((post, index) => {

                        let name = ""
                        if (state._id === post.postedBy._id) {
                            name = "You"
                        } else {
                            name = post.postedBy.name
                        }
                        return (
                            <div key={index} className="card home-card">
                                <h5 className="posted-by">
                                    <img className="post-user-pic" src={post.postedBy.pic} alt="none" />
                                    <Link to={
                                        post.postedBy._id !== state._id ?
                                            "/profile/" + post.postedBy._id
                                            :
                                            "/profile"
                                    }
                                    > <span> {name}</span></Link>
                                    {
                                        post.postedBy._id === state._id
                                        &&
                                        <span>
                                            <i className="unlike material-icons"
                                                onClick={() => deletePost(post._id)}>delete_forever</i>
                                        </span>
                                    }
                                </h5>
                                <div className="card-image">
                                    <img src={post.photo} alt="post_img" />
                                </div>
                                <div className="card-content">
                                  <div class="post-info-stripe">
                                  {
                                        miniLoading ?
                                            <div className="like-loader">
                                            </div>
                                            :
                                            <div>
                                                {
                                                    post.likes.includes(state._id) ?
                                                        <i onClick={() => unlikePost(post._id)} className="unlike material-icons">thumb_up</i>
                                                        :
                                                        <i onClick={() => likePost(post._id)} className="like material-icons">thumb_up</i>
                                                }
                                            </div>
                                    }
                                    <div class="post-date">{ relativeDate(post.createdAt) }</div>
                                  </div>
                                    
                                    <p className="likes">{post.likes.length} likes</p>
                                    <p>{post.body}</p>

                                    <div className="comment-box">
                                        <h5>Comments</h5>
                                        <div className="inner-comment-box">
                                            {

                                                post.comments.map((comment, index) => {

                                                    return (
                                                        <>
                                                            <h6 key={index}><span className={comment.postedBy._id === state._id ? "Me" : ""}>{
                                                                comment.postedBy._id === state._id ?
                                                                    "You"
                                                                    :
                                                                    comment.postedBy.name
                                                            }</span> :   <span>{comment.text}</span>
                                                                {
                                                                    comment.postedBy._id === state._id &&
                                                                    <span className="delete-comment">
                                                                        <i onClick={() => deleteComment(post._id, comment._id)} className="unlike material-icons">delete</i>
                                                                    </span>
                                                                }
                                                            </h6>
                                                            <hr />
                                                        </>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>

                                    <form onSubmit={e => {
                                        e.preventDefault();
                                        makeComment(e.target[0].value, post._id)
                                        e.target[0].value = ""
                                    }
                                    }>
                                        <input type="text" placeholder="Add a comment..." />
                                    </form>
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        )
    }
}
export default Home