import React, { useState, useEffect, useContext } from 'react'
import '../../Styles/Profile.css'
import Loading from './Loading'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import MiniLoader from './MiniLoader'

function UserProfile() {

    const { dispatch } = useContext(UserContext)
    const [profile, setProfile] = useState(null)
    const [showFollow, setshowFollow] = useState(true)
    const [loading, setLoading] = useState(true)
    const [miniLoading, setMiniLoading] = useState(false)
    const { userid } = useParams()

    useEffect(() => {

        const loggedUser = JSON.parse(localStorage.getItem("user"))
        if (loggedUser.following.includes(userid)) {
            setshowFollow(false)
        } else {
            setshowFollow(true)
        }
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(userprofile => {
                setProfile(userprofile)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }, [showFollow])

    const followUser = () => {
        setMiniLoading(true)
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
            .then(data => {
                dispatch({
                    type: "UPDATE",
                    payload: { following: data.following, followers: data.followers }
                })
                localStorage.setItem("user", JSON.stringify(data))
                setProfile(prevState => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, userid]
                        }
                    }
                })
                setshowFollow(false)
                setMiniLoading(false)
            })
            .catch(err => {
                setMiniLoading(false)
                console.log(err)
            })
    }

    const unfollowUser = () => {
        setMiniLoading(true)
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
            .then(data => {
                dispatch({
                    type: "UPDATE",
                    payload: { following: data.following, followers: data.followers }
                })
                localStorage.setItem("user", JSON.stringify(data))
                setProfile(prevState => {
                    const newFollower = prevState.user.followers.filter(follower =>
                        follower !== userid
                    )
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollower
                        }
                    }
                })
                setshowFollow(true)
                setMiniLoading(false)
            })
            .catch(err => {
                setMiniLoading(false)
                console.log(err)
            })
    }

    if (loading) {
        return <Loading />
    } else {
        return (
            <div className="profileContainer">
                <div className="profile-inner-container">
                    <div className="img-container">
                        <img src={profile.user.pic} alt={profile.user.name} />
                    </div>
                    {
                        miniLoading ?
                            <div className="data-container">
                                <MiniLoader />
                            </div>
                            :
                            <div className="data-container">
                                <h4>{profile.user.name}</h4>
                                <h5>{profile.user.email}</h5>
                                <div className="profile-data">
                                    <h6>{profile.posts.length} posts</h6>
                                    <h6>{profile.user.followers.length} followers</h6>
                                    <h6>{profile.user.following.length} following</h6>
                                </div>
                                {
                                    showFollow ?
                                        <button className="followBtn" type="submit" onClick={followUser} >Follow</button>
                                        :
                                        <button className="unfollowBtn" type="submit" onClick={unfollowUser}>Unfollow</button>
                                }
                            </div>
                    }

                </div>
                
                <div className="profile-gallery">
                    {
                        profile.posts.length === 0 ?
                        <h5>No posts yet!</h5>
                        :
                        profile.posts.map((post, index) => {
                            return (
                                <Link to={`/singlepost/${post._id}`}>
                                    <img key={index} src={post.photo} alt="my_post" />
                                </Link>
                            )
                        })
                    }

                </div>
            </div>
        )
    }
}

export default UserProfile
