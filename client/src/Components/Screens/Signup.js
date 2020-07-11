import React, { useState, useEffect } from 'react'
import '../../Styles/LoginSignup.css'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import Footer from './Footer'

function Signup() {
    const history = useHistory()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)

    useEffect(()=>{
        if(url){
            uploadFields()
        }
    },[url])

    const uploadPic = () => {
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
                M.Toast.dismissAll();
                M.toast({ html: "Unable to upload", classes: "#ff5252 red accent-2" })
            })
    }

    const uploadFields = () => {

        if(password.length < 4){
            M.Toast.dismissAll()
            M.toast({ html: "Length of the passworrd must be atleast 4", classes: "#ff5252 red accent-2" })
            return         
        }

        if(name.length < 3 || name.length > 18){
            M.Toast.dismissAll()
            M.toast({ html: "Name length be from 3 to 18 characters", classes: "#ff5252 red accent-2" })
            return         
        }

        if (!/^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.Toast.dismissAll()
            M.toast({ html: "Please enter a valid email", classes: "#ff5252 red accent-2" })
            return
        }

        fetch('/signup', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
                pic: url
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.Toast.dismissAll();
                    M.toast({ html: data.error, classes: "#ff5252 red accent-2" })
                }
                else {
                    M.Toast.dismissAll();
                    M.toast({ html: 'Signed up successfully!', classes: "#81c784 green lighten-2" })
                    history.push('/login')
                }
            })
            .catch(err => {
                M.Toast.dismissAll();
                M.toast({ html: "Something went wrong!", classes: "#ff5252 red accent-2" })
            })
    }


    const signupHandler = () => {

        if (image) {
            uploadPic()
        } else {
            uploadFields()
        }

    }

    return (
        <div className="myCard">
            <div className="card authCard">
                <h2 className="logo">Gamergram</h2>
                <input
                    onChange={e => setName(e.target.value)}
                    value={name}
                    type="text"
                    placeholder="name"
                />
                <input
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                    type="text"
                    placeholder="email"
                />
                <input
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder="password"
                />
                <div className="file-field input-field">
                    <div className="btn choose_file">
                        <span>Profile Picture</span>
                        <input
                            onChange={e => setImage(e.target.files[0])}
                            type="file"
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button type="submit" onClick={signupHandler} className="btn waves-effect waves-light">Signup</button>
                <div className="alterLink">
                    <span>
                        Already have an account?
                    <Link className="link" to="/login">Login</Link>
                    </span>
                </div>
            </div>
        
            <Footer />
        </div>
    )
}

export default Signup
