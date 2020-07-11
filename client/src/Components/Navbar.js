import React, { useContext, useState, useEffect, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import '../Styles/Navbar.css'
import { UserContext } from '../App'
import M from 'materialize-css'

const Navbar = () => {

    const { state, dispatch } = useContext(UserContext)
    const searchModal = useRef(null)
    const [search, setSearch] = useState('')
    const [userDetails, setUserDetails] = useState([])
    const [dropdown, setDropdown] = useState(false)
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, [])

    const handleHome = () => {
        if (state) {
            return
        } else {
            M.Toast.dismissAll();
            M.toast({ html: 'You are not signed in!', classes: "#ff5252 red accent-2" })
        }
    }


    const renderList = () => {
        if (state) {
            return [
                <li key="454"><i data-target="modal1" className="searchBox unlike material-icons modal-trigger">search</i></li>,
                <li key="044" onClick={removeDropdown}><Link to="/followerspost">Following Posts</Link></li>,
                <li key="144" onClick={removeDropdown}><Link to="/profile">Profile</Link></li>,
                <button
                    key="544"
                    onClick={() => {
                        setDropdown(false)
                        localStorage.clear()
                        dispatch({ type: "CLEAR" })
                        history.push('/login')
                        M.Toast.dismissAll();
                        M.toast({ html: "Logged out!", classes: "#81c784 green lighten-2" })
                    }}
                >
                    Logout
                </button>
            ]
        } else {
            return [
                <li key="344" onClick={removeDropdown}><Link to="/login">Login</Link></li>,
                <li key="444" onClick={removeDropdown}><Link to="/signup">Signup</Link></li>
            ]
        }
    }

    const dropDownHandler = (e) => {
        if (dropdown) {
            setDropdown(false)
        } else {
            setDropdown(true)
        }
    }

    useEffect(() => {
        return () => {
            setDropdown(false)
        }
    }, [])

    const removeDropdown = () => {
        setDropdown(false)
    }

    const fetchUsers = (query) => {
        setLoading(true)
        setSearch(query)
        if (search) {
            fetch('/searchusers', {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    query
                })
            }).then(res => res.json())
                .then(users => {
                    setUserDetails(users.user)
                    setLoading(false)
                }).catch(err => {
                    console.log(err)
                    setLoading(false)
                })
        }
    }

    return (
        <nav>
            <div className="nav-wrapper">
                <Link to={state ? '/' : '/login'} onClick={handleHome} className="brand-logo left logo">Gamergram</Link>
                <div onClick={dropDownHandler} className="settings-icon">
                    <li></li>
                    <li></li>
                    <li></li>
                </div>
                <ul id="nav-mobile" className="nav-links right hide-on-med-and-down">
                    {renderList()}
                </ul>
                <div className={dropdown ? "addOpacity" : ""}></div>
                <ul className={dropdown ? "nav-links smallScreen show" : "hide"}>
                    {renderList()}
                </ul>
            </div>
            <div id="modal1" className="modal" ref={searchModal}>
                <div className="modal-content">
                    <input
                        value={search}
                        onChange={e => fetchUsers(e.target.value)}
                        type="text"
                        placeholder="Search users.."
                    />

                    <ul className="collection">
                        {
                            userDetails.length === 0 && !loading && search !== "" ?
                                <li className="collection-item">No user found!</li>
                                :
                                userDetails.map((user, index) =>

                                    <a href={user._id === state._id ? "/profile/" : `/profile/${user._id}`}>
                                        <li onClick={
                                            () => {
                                                M.Modal.getInstance(searchModal.current).close()
                                                setSearch('')
                                            }
                                        } key={index} className="collection-item">
                                            <img src={user.pic} alt='.' />
                                            <p>{user.name}</p>
                                        </li>
                                    </a>
                                )
                        }
                    </ul>
                </div>
                <div className="modal-footer">
                    <button href="#!" onClick={() => setSearch('')} className="modal-close waves-effect waves-green btn-flat">Close</button>
                </div>
            </div>
        </nav >
    )
}

export default Navbar
