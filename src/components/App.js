import React, { useState } from 'react'
import { AuthProvider } from '../contexts/AuthContext.js';
import Signup from "./Signup.js"
import Dashboard from "./Dashboard.js"
import Login from "./Login.js"
import UserDashboard from "./UserDashboard.js"
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute.js'
import ForgotPassword from './ForgotPassword.js'
import UpdateProfile from './UpdateProfile.js'
// import { db } from '../firebase.js'


function App() {

  return (

    <>
    <Router>
      <AuthProvider>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/userdashboard" component={UserDashboard} />
          <PrivateRoute path="/update-profile" component={UpdateProfile} />
          <Route path="/forgot-password" component={ForgotPassword} />
        </Switch>
        
      </AuthProvider>

    </Router>
    </>
  );
}

export default App;
