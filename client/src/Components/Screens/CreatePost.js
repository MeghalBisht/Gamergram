import React, { useState, useEffect, useContext } from 'react'
import '../../Styles/CreatePost.css'
import { useHistory } from 'react-router-dom'
import M from 'materialize-css'
import Loading from './Loading'
import { UserContext } from '../../App'

function CreatePost() {

    const { state } = useContext(UserContext);
    const history = useHistory()
    const [loading, setLoading] = useState(false)
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")

    useEffect(() => {

        if (url) {
            fetch('/createpost', {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    body,
                    pic: url

                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        M.Toast.dismissAll();
                        setLoading(false)
                        M.toast({ html: data.error, classes: "#e53935 red darken-1" })
                    }
                    else {
                        M.Toast.dismissAll();
                        setLoading(false)
                        M.toast({ html: 'Posted successfully!', classes: "#43a047 green darken-1" })
                        history.push('/')
                    }
                })
                .catch(err => {
                    setLoading(false)
                    M.Toast.dismissAll();
                    M.toast({ html: "Something went wrong!", classes: "#e53935 red darken-1" })
                })
        }

    }, [url])


    const postDetails = () => {
        setLoading(true)
        if (!body || !image) {
            setLoading(false)
            M.Toast.dismissAll();
            M.toast({ html: "Empty fields!", classes: "#e53935 red darken-1" })
            return
        }
        const data = new FormData()
        data.append('file', image)
        data.append('upload_preset', "insta-clone")
        data.append('cloud_name', "Gamoby India")
        fetch("https://api.cloudinary.com/v1_1/gamoby-india/image/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => setUrl(data.url))
            .catch(err => {
                setLoading(false)
                M.Toast.dismissAll();
                M.toast({ html: "Unable to upload", classes: "#e53935 red darken-1" })
            })
    }

    if (loading) {
        return (
            <Loading />
        )
    } else {
        return (
            <div className="card createContainer input-field">
                <span className="post-here"><span>{state ? state.name : ""}</span> post an update!</span>
                <input
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    type="text"
                    placeholder="Caption"
                />
                <div className="file-field input-field">
                    <div className="btn">
                        <span>File</span>
                        <input
                            onChange={e => setImage(e.target.files[0])}
                            type="file"
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button onClick={postDetails} className="btn submitBtn waves-effect waves-light">Submit Post</button>

            </div>
        )
    }
}
export default CreatePost
