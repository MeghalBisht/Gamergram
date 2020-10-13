import React, { useState, useContext } from 'react'
import '../../Styles/LoginSignup.css'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import { UserContext } from '../../App'
import Footer from './Footer'
import GoogleLogin from 'react-google-login'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
const eye = <FontAwesomeIcon icon={faEye} />;

function Login() {
    const { dispatch } = useContext(UserContext);
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordShow,setPasswordShow] = useState(false);

    const signinHandler = () => {

        if (!/^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.Toast.dismissAll()
            M.toast({ html: "Please enter a valid email", classes: "#ff5252 red accent-2" })
            return
        }

        fetch('/signin', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
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
                    localStorage.setItem("jwt", data.token)
                    localStorage.setItem("user", JSON.stringify(data.user))
                    dispatch({ type: "USER", payload: data.user })
                    M.toast({ html: 'Signed in successfully!', classes: "#81c784 green lighten-2" })
                    history.push('/')
                }
            })
            .catch(err => {
                M.Toast.dismissAll();
                M.toast({ html: "Something went wrong!", classes: "#ff5252 red accent-2" })
            })
    }

    const responseGoogle = (res) => {
        setEmail(res.profileObj.email)
        fetch('/google-login', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: res.profileObj.email
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
                    localStorage.setItem("jwt", data.token)
                    localStorage.setItem("user", JSON.stringify(data.user))
                    dispatch({ type: "USER", payload: data.user })
                    M.toast({ html: 'Signed in successfully!', classes: "#81c784 green lighten-2" })
                    history.push('/')
                }
            })
            .catch(err => {
                M.Toast.dismissAll();
                M.toast({ html: "Something went wrong!", classes: "#ff5252 red accent-2" })
            })
    }

    const togglePasswrod = () => {
        setPasswordShow(passwordShow ? false:true);
    }

    return (
        <div className="myCard">
            <div className="card authCard">
                <h2 className="logo">Gamergram</h2>
                <div className="google-login">
                    <GoogleLogin
                        clientId="552762679533-v5n3kq7efv87jvnk3aht8go8m6di009a.apps.googleusercontent.com"
                        buttonText="Login"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
                </div>
                
                <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    type="text"
                    placeholder="email"
                />
                <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type={passwordShow?"text" : "password"}
                    placeholder="password"
                />
                <i onClick={togglePasswrod}>{eye}</i>
                <button type="submit" onClick={signinHandler} className="btn waves-effect waves-light">Login</button>
                <div className="alterLink">
                    <span>
                        No account?
                    <Link className="link" to="/signup">Signup</Link>
                        <p>
                            <Link className="link" to="/reset">Forgot Password?</Link>
                        </p>
                    </span>
                </div>
            </div>
            <Footer />
        </div>

    )
}

export default Login
