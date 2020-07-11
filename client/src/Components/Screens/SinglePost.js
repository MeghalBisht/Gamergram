import React, { useState, useEffect, useContext } from 'react'
import '../../Styles/SinglePost.css'
import Loading from './Loading'
import { useParams } from 'react-router-dom'
import '../../Styles/Home.css'
import { Link } from 'react-router-dom'
import { UserContext } from '../../App'
import M from 'materialize-css'


function SinglePost() {

  const { state } = useContext(UserContext)
  const [miniLoading, setMiniLoading] = useState(false)
  const [post, setPost] = useState(null)
  const { id } = useParams()

  useEffect(() => {
    fetch(`/singlepost/${id}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then(res => res.json())
      .then(result => {
        setPost(result.post)

      }).catch(err => console.log(err))

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
        setPost(data)
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
        setPost(data)
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
        setPost(data)
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
        setPost(result)
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
        setPost(data)
        M.Toast.dismissAll()
        M.toast({ html: "Comment deleted", classes: "#43a047 green darken-1", displayLength: 1800 })
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    post ?
      <div key={post._id} className="single-post-container card home-card">
        <h5 className="posted-by">
          <img className="post-user-pic" src={post.postedBy.pic} alt="none" />
          <Link to={
            post.postedBy._id !== state._id ?
              "/profile/" + post.postedBy._id
              :
              "/profile"
          }
          > <span>{post.postedBy._id === state._id ? "You" : post.postedBy.name}</span></Link>
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
      : <Loading />
  )
}

export default SinglePost
