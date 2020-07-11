import React, { useState } from 'react'
import '../../Styles/LoginSignup.css'
import { Link, useHistory, useParams } from 'react-router-dom'
import M from 'materialize-css'
import Footer from './Footer'

function NewPassword() {
    const history = useHistory()
    const [password, setPassword] = useState('')
    const { token } = useParams()
    const signinHandler = () => {

        fetch('/new-password', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password,
                token
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
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                    placeholder="Enter new password"
                />
                <button type="submit" onClick={signinHandler} className="btn waves-effect waves-light">Update Password</button>
            </div>
            <Footer />
        </div>

    )
}

export default NewPassword
