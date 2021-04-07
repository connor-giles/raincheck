import React, { useState } from 'react'
import { Card, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext.js'
import { Link, useHistory } from 'react-router-dom'
import helperFunctions from '../firebase.js'

export default function UserDashboard() {
    
    const[error, setError] = useState('')
    const[homeT, setHomeT] = useState('')
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    async function handleLogout() {
        setError('')

        try {
          await logout()
          history.push('/')
        } catch {
            setError('Failed to log out')
        }

    }

    //gets the users hometown from the database and displays it on their profile
    helperFunctions.firestoreFunctions("get_user_hometown", currentUser.uid)
    .then((res) => {
        setHomeT(res.homeTown)
    })
    
    
    
    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Profile</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <strong>Email: </strong> {currentUser.email}
                    <strong>Hometown: </strong> {homeT}
                    <Link to="/update-profile" className="btn btn-primary w-100 mt-3">Edit Profile</Link>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                <Button variant="link" onClick={handleLogout}>Log Out</Button>
            </div> 
        </>
    )
}
