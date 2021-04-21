import React, {useRef, useState } from 'react'
import { Card, Form, Button, Container, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext.js'
import { Link, useHistory } from "react-router-dom"
import helperFunctions from '../firebase.js'
import { makeStyles } from '@material-ui/core/styles';
import Image from '../assets/pic3resize.jpg';
import { Box, Avatar } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
    fullPage: {
        backgroundImage:  `url(${Image})`
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: '#3b5480',
    },
}));

export default function UpdateProfile() {

    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const firstNameRef = useRef()
    const hometownRef = useRef()
    const { currentUser, updateEmail, updatePassword } = useAuth()
    const[error, setError] = useState('')
    const[loading, setLoading] = useState(false)
    const history = useHistory()
    const classes = useStyles() //handles css stuff

    //functions that handles the updat of the user's account
    function handleSubmit(e) {
        e.preventDefault()

        //checks to ensure the passwords match
        if(passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match')
        }

        //handles all promises before displaying any errors
        const promises = []

        //set loading to true and error to blank
        setLoading(true)
        setError("")

        //checks if the email was updated
        if(emailRef.current.value !== currentUser.email) {
            promises.push(updateEmail(emailRef.current.value))
        }

        //if a password was entered
        if(passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value))
        }

        //if a hometown was entered
        if(hometownRef.current.value) {
            var updateData = {
                user: currentUser.uid,
                homeTownUpdate: hometownRef.current.value
            }

            helperFunctions.firestoreFunctions("update_hometown", updateData)
        }

        //if a hometown was entered
        if(firstNameRef.current.value) {
            var firstNameUpdateData = {
                user: currentUser.uid,
                firstNameUpdate: firstNameRef.current.value
            }

            helperFunctions.firestoreFunctions("update_firstname", firstNameUpdateData)
        }

        Promise.all(promises).then(() => {
            history.push('/userdashboard')
        }).catch(() => {
            setError('Failed to update account')
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className={classes.fullPage}>
           <Container className="d-flex align-items center justify-content-center pt-5" style={{ minHeight: "100vh "}}>
                <div className="w-100" style={{ maxWidth: "400px" }}>
                    <Card>
                        <Card.Body>
                            <Box display="flex" alignItems="center" justifyContent="center">
                                <Avatar className={classes.avatar} align="center">
                                    <EditIcon />
                                </Avatar>
                            </Box>
                            <h2 className="text-center mb-4">Update Profile</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                    <Form.Group id="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" ref={emailRef} required defaultValue={currentUser.email} />
                                    </Form.Group>
                                    <Form.Group id="hometown">
                                        <Form.Label>Hometown Update</Form.Label>
                                        <Form.Control type="hometown" ref={hometownRef} placeholder="Leave blank to keep the same"/>
                                    </Form.Group>
                                    <Form.Group id="firstname">
                                        <Form.Label>First Name Update</Form.Label>
                                        <Form.Control type="firstname" ref={firstNameRef} placeholder="Leave blank to keep the same"/>
                                    </Form.Group>
                                    <Form.Group id="password">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" ref={passwordRef} placeholder="Leave blank to keep the same"/>
                                    </Form.Group>
                                    <Form.Group id="password-confirm">
                                        <Form.Label>Password Confirmation</Form.Label>
                                        <Form.Control type="password" ref={passwordConfirmRef} placeholder="Leave blank to keep the same"/>
                                    </Form.Group>
                                    <Button disabled={loading} style={{backgroundColor: '#3b5480'}} className="w-100"type="submit">
                                        Update
                                    </Button>
                                </Form>
                        </Card.Body>
                    </Card>
                    <div className="w-100 text-center mt-2">
                             <Link to="/userdashboard" style={{color: '#3b5480'}}>Cancel</Link>
                    </div> 
                </div>
           </Container>
        </div>
    )
}
