import React, { useState, useEffect, useContext } from 'react'
import '../../Styles/Profile.css'
import Loading from './Loading'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'
import M from 'materialize-css'
import MiniLoader from './MiniLoader'

function Profile() {

    const { dispatch, state } = useContext(UserContext)
    const [mypost, setMypost] = useState([])
    const [loading, setLoading] = useState(true)
    const [imageLoad, setImageLoad] = useState(false)
    const [image, setImage] = useState("")
    const [settings, setSettings] = useState(false)

    useEffect(() => {

        fetch('/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(data => {
                setMypost(data.posts)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }, [])

    useEffect(() => {

        if (image) {
            setSettings(false)
            const data = new FormData()
            data.append('file', image)
            data.append('upload_preset', "insta-clone")
            data.append('cloud_name', "Gamoby India")
            fetch("https://api.cloudinary.com/v1_1/gamoby-india/image/upload", {
                method: "post",
                body: data
            })
                .then(res => res.json())
                .then(data => {
                    fetch('/updatepic', {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    }).then(res => res.json())
                        .then(result => {
                            localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }))
                            dispatch({ type: "UPDATEPIC", payload: result.url })
                            setImageLoad(false)
                            setSettings(false)
                        }).catch(err => {
                            console.log(err)
                            setImageLoad(false)
                            setSettings(false)
                        })
                    setSettings(false)
                })
                .catch(err => {
                    M.Toast.dismissAll();
                    M.toast({ html: "Unable to upload", classes: "#ff5252 red accent-2" })
                })
        }

    }, [image])

    const updatePhoto = (file) => {
        setImage(file)
    }

    if (loading) {
        return <Loading />
    } else {
        return (
            <div className="profileContainer">
                <div className="profile-inner-container">
                    <div className="profile-settings">
                        <i onClick={() => { settings ? setSettings(false) : setSettings(true) }} className="unlike material-icons">settings</i>
                    </div>
                    <div className="img-container">
                        {
                            imageLoad ? <MiniLoader />
                                :
                                <img src={state.pic} alt={state.name} />
                        }
                        <div className={settings ? "show file-field input-field" : "file-field input-field hide"}>
                            <div className="btn choose_file">
                                <span>Change dp</span>
                                <input
                                    onChange={e => {
                                        setImageLoad(true)
                                        updatePhoto(e.target.files[0])
                                    }}
                                    type="file"
                                />
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" type="text" />
                            </div>
                        </div>
                    </div>
                    <div className="data-container">
                        <h4>{state ? state.name : ""}</h4>
                        <div className="profile-data">
                            <h6>{mypost.length} posts</h6>
                            <h6>{state.followers ? state.followers.length : "0"} followers</h6>
                            <h6>{state.following ? state.following.length : "0"} following</h6>
                        </div>
                    </div>
                </div>
                <div className="profile-gallery">
                    {
                        mypost.length === 0 ?

                            <div className="create-post">
                                <h5>No post yet!
                        <Link className="link" to='/create'>Create</Link>
                                </h5>
                            </div>
                            :
                            <div className="gallery-inner">
                                {
                                    mypost.map((post, index) => {
                                        return (
                                            <Link key={index} to={'/singlepost/' + post._id}>
                                                <img src={post.photo} alt="my_post" />
                                            </Link>
                                        )
                                    })
                                }
                            </div>
                    }
                </div>
            </div>
        )
    }
}

export default Profile
