import React from 'react'
import { AuthProvider } from '../contexts/AuthContext.js';
import Signup from "./Signup.js"
import Dashboard from "./Dashboard.js"
import Login from "./Login.js"
import UserDashboard from "./UserDashboard.js"
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute.js'
import ForgotPassword from './ForgotPassword.js'
import UpdateProfile from './UpdateProfile.js'
import AddEvent from './AddEvent.js'
import DeleteEvent from './DeleteEvent.js'
import UpdateEvent from './UpdateEvent.js'


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
          <PrivateRoute path="/add-event" component={AddEvent} />
          <PrivateRoute path="/update-event" component={UpdateEvent} />
          <PrivateRoute path="/delete-event" component={DeleteEvent} />
          <Route path="/forgot-password" component={ForgotPassword} />
        </Switch>
        
      </AuthProvider>

    </Router>
    </>
  );
}

export default App;

//TODO:
//1. Maybe fix refreshing with Update and Delete
//2. Fix when hometown is fetched (add await)