import React, {useRef, useState } from 'react'
import { Card, Form, Button, Container, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext.js'
import { Link, useHistory } from "react-router-dom"

export default function Signup() {

    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const homeTownRef = useRef()
    const { signup } = useAuth()
    const[error, setError] = useState('')
    const[loading, setLoading] = useState(false)
    const history = useHistory()

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
            await signup(emailRef.current.value, passwordRef.current.value, homeTownRef.current.value)
            history.push('/userdashboard')
        } catch {
            setError('Failed to create an account')
        }

        setLoading(false)
    }

    return (
        <>
           <Container className="d-flex align-items center justify-content-center pt-5" style={{ minHeight: "100vh "}}>
                <div className="w-100" style={{ maxWidth: "400px" }}>
                    <Card>
                        <Card.Body>
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
                                    <Button disabled={loading} className="w-100"type="submit">
                                        Sign Up
                                    </Button>
                                </Form>
                        </Card.Body>
                    </Card>
                    <div className="w-100 text-center mt-2">
                            Already have an account? <Link to="/login">Log In</Link>
                    </div> 
                </div>
           </Container>
        </>
    )
}
