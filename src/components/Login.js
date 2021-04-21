import React, {useRef, useState } from 'react'
import { Card, Form, Button, Container, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext.js'
import { Link, useHistory } from "react-router-dom"
import { Avatar, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Image from '../assets/pic3resize.jpg';

const useStyles = makeStyles((theme) => ({
    fullPage: {
        backgroundImage:  `url(${Image})`
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: '#3b5480',
    },
}));

export default function Login() {

    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const[error, setError] = useState('')
    const[loading, setLoading] = useState(false)
    const history = useHistory()
    const classes = useStyles() //handles css stuff

    //asynchronous functions that handles the submission of the user's account
    async function handleSubmit(e) {
        e.preventDefault()

        //attempts to create the user
        try {
            setError('')
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            history.push('/userdashboard')
        } catch {
            setError('Failed to log in')
        }

        setLoading(false)
    }

    return (
        <div className={classes.fullPage}>
           <Container className="d-flex align-items center justify-content-center pt-5" style={{ minHeight: "100vh "}}>
                <div className="w-100" style={{ maxWidth: "400px", marginTop: "50px"}}>
                    <Card>
                        <Card.Body>
                            <Box display="flex" alignItems="center" justifyContent="center">
                                <Avatar className={classes.avatar} align="center">
                                    <VpnKeyIcon />
                                </Avatar>
                            </Box>
                            <h2 className="text-center mb-4">Log In</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                    <Form.Group id="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" ref={emailRef} required />
                                    </Form.Group>
                                    <Form.Group id="password">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" ref={passwordRef} required />
                                    </Form.Group>
                                    <Button disabled={loading} style={{backgroundColor: '#3b5480', outlineColor: '#3b5480'}} className="w-100" type="submit" color="#215d81">
                                        Log In
                                    </Button>
                            </Form>
                            <div className="w-100 text-center mt-3">
                                <Link to="/forgot-password" style={{color: '#3b5480'}}>Forgot Password?</Link>
                            </div>
                        </Card.Body>
                    </Card>
                    <div className="w-100 text-center mt-2">
                            Dont have an account? <Link to="/signup" style={{color: '#3b5480'}}>Sign Up</Link>
                    </div>
                    <div className="w-100 text-center mt-2">
                            Return to Dashboard? <Link to="/" style={{color: '#3b5480'}}>Dashboard</Link>
                    </div>  
                </div>
           </Container>
        </div>
    )
}
