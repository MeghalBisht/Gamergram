import React, { useState } from 'react'
import '../../Styles/LoginSignup.css'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import Footer from './Footer'

function Reset() {
    const history = useHistory()
    const [email, setEmail] = useState('')

    const signinHandler = () => {

        if (!/^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.Toast.dismissAll()
            M.toast({ html: "Please enter a valid email", classes: "#ff5252 red accent-2" })
            return
        }

        fetch('/reset-password', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
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
                    M.toast({ html: data.message, classes: "#81c784 green lighten-2" })
                    history.push('/login')
                }
            })
            .catch(err => {
                M.Toast.dismissAll();
                M.toast({ html: "Something went wrong!", classes: "#ff5252 red accent-2" })
            })
    }

    return (
        <div className="myCard">
            <div className="card authCard">
                <h2 className="logo">Gamergram</h2>
                <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    type="text"
                    placeholder="email"
                />
                <button type="submit" onClick={signinHandler} className="btn waves-effect waves-light">Reset Password</button>
            </div>
            <Footer />
        </div>

    )
}

export default Reset
