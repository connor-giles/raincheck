import React, {useRef, useState } from 'react'
import { Card, Form, Button, Container, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext.js'
import { Link } from "react-router-dom"
import { makeStyles } from '@material-ui/core/styles';
import Image from '../assets/pic3resize.jpg';
import { Box, Avatar } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

const useStyles = makeStyles((theme) => ({
    fullPage: {
        backgroundImage:  `url(${Image})`
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: '#3b5480',
    },
}));

export default function ForgotPassword() {

    const emailRef = useRef()
    const { resetPassword } = useAuth()
    const[error, setError] = useState('')
    const[message, setMessage] = useState('')
    const[loading, setLoading] = useState(false)
    const classes = useStyles() //handles css stuff

    //asynchronous functions that handles the submission of the user's account
    async function handleSubmit(e) {
        e.preventDefault()

        //attempts to create the user
        try {
            setMessage('')
            setError('')
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage('Check your inbox for further instructions')
        } catch {
            setError('Failed to reset password')
        }

        setLoading(false)
    }

    return (
        <div className={classes.fullPage}>
           <Container className="d-flex align-items center justify-content-center pt-5" style={{ minHeight: "100vh "}}>
                <div className="w-100" style={{ maxWidth: "400px" }}>
                    <Card>
                        <Card.Body>
                            <Box display="flex" alignItems="center" justifyContent="center">
                                <Avatar className={classes.avatar} align="center">
                                    <HelpOutlineIcon />
                                </Avatar>
                            </Box>
                            <h2 className="text-center mb-4">Password Reset</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {message && <Alert variant="success">{message}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                    <Form.Group id="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" ref={emailRef} required />
                                    </Form.Group>
                                    <Button disabled={loading} style={{backgroundColor: '#3b5480'}} className="w-100"type="submit">
                                        Reset Password
                                    </Button>
                                </Form>
                                <div className="w-100 text-center mt-3">
                                    <Link to="/login" style={{color: '#3b5480'}}>Return to Login</Link>
                                </div>
                        </Card.Body>
                    </Card>
                    <div className="w-100 text-center mt-2">
                            Dont have an account? <Link to="/signup" style={{color: '#3b5480'}}>Sign Up</Link>
                    </div> 
                </div>
           </Container>
        </div>
    )
}
