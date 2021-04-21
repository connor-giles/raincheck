import React, {useRef, useState } from 'react'
import { Card, Form, Button, Container, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext.js'
import { Link, useHistory } from "react-router-dom"
import { Avatar, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
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


export default function Signup() {

    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const homeTownRef = useRef()
    const firstNameRef = useRef()
    const { signup } = useAuth()
    const[error, setError] = useState('')
    const[loading, setLoading] = useState(false)
    const history = useHistory()
    const classes = useStyles() //handles css stuff

    //asynchronous functions that handles the submission of the user's account
    async function handleSubmit(e) {
        e.preventDefault()

        //checks to ensure the passwords match
        if(passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match')
        }

        //attempts to create the user
        try {
            setError('')
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value, homeTownRef.current.value, firstNameRef.current.value)
            history.push('/userdashboard')
        } catch {
            setError('Failed to create an account')
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
                                    <PersonAddIcon />
                                </Avatar>
                            </Box>
                            <h2 className="text-center mb-4">Sign Up</h2>
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
                                    <Form.Group id="password-confirm">
                                        <Form.Label>Password Confirmation</Form.Label>
                                        <Form.Control type="password" ref={passwordConfirmRef} required />
                                    </Form.Group>
                                    <Form.Group id="hometown">
                                        <Form.Label>Hometown</Form.Label>
                                        <Form.Control type="hometown" ref={homeTownRef} required />
                                    </Form.Group>
                                    <Form.Group id="first-name">
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control type="firstname" ref={firstNameRef} required />
                                    </Form.Group>
                                    <Button disabled={loading} style={{backgroundColor: '#3b5480', outlineColor: '#3b5480'}} className="w-100" type="submit">
                                        Sign Up
                                    </Button>
                                </Form>
                        </Card.Body>
                    </Card>
                    <div className="w-100 text-center mt-2">
                            Already have an account? <Link to="/login" style={{color: '#3b5480'}}>Log In</Link>
                    </div>
                    <div className="w-100 text-center mt-2">
                            Return to Dashboard? <Link to="/" style={{color: '#3b5480'}}>Dashboard</Link>
                    </div>   
                </div>
           </Container>
        </div>
    )
}
