import React, { useEffect, createContext, useReducer, useContext } from 'react';
import Signup from './Components/Screens/Signup';
import Login from './Components/Screens/Login';
import Home from './Components/Screens/Home';
import Profile from './Components/Screens/Profile';
import CreatePost from './Components/Screens/CreatePost';
import Reset from './Components/Screens/Reset';
import FollowedUser from './Components/Screens/FollowedUser';
import UserProfile from './Components/Screens/UserProfile';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import Navbar from './Components/Navbar';
import { reducer, initialState } from './Reducers/UserReducer'
import './App.css'
import SinglePost from './Components/Screens/SinglePost';
import NewPassword from './Components/Screens/NewPassword';
import ToggleTheme from './Components/ToggleTheme';

export const UserContext = createContext()

function Routing() {
  const history = useHistory()
  const { dispatch } = useContext(UserContext)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      dispatch({ type: "USER", payload: user })
      if (history.location.pathname.startsWith('/login') || history.location.pathname.startsWith('/signup')){
        history.push('/')
      }
    } else {
      if (!history.location.pathname.startsWith('/reset'))
        history.push('/login')
    }
  }, [])


  return (
    <Switch>
      <Route path='/' exact component={Home} />
      <Route path='/followerspost' exact component={FollowedUser} />
      <Route path='/signup' exact component={Signup} />
      <Route path='/login' component={Login} />
      <Route path='/profile' exact component={Profile} />
      <Route path='/create' component={CreatePost} />
      <Route path='/reset' exact component={Reset} />
      <Route path='/reset/:token' component={NewPassword} />
      <Route path='/singlepost/:id' exact component={SinglePost} />
      <Route path='/profile/:userid' component={UserProfile} />
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }} >
        <div className="App">
          <Router>
            <Navbar />
            <ToggleTheme />
            <Routing />
          </Router>
        </div>
    </UserContext.Provider>
  );
}

export default App;
