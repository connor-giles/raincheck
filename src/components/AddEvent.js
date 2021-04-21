import React, { useState } from 'react';
import { DatePicker, Space } from 'antd';
import 'antd/dist/antd.css';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Checkbox, FormControlLabel, Typography } from '@material-ui/core';
import { TextField, Container, CssBaseline, Avatar, Paper, Box } from '@material-ui/core';
import firebase from 'firebase/app'
import helperFunctions from '../firebase.js'
import { useHistory } from "react-router-dom"
import TodayIcon from '@material-ui/icons/Today';
import Image from '../assets/pic1.jpg';



const useStyles = makeStyles((theme) => ({
    fullPage: {
        backgroundImage:  `url(${Image})`
    },
    paper: {
      marginTop: theme.spacing(8),
      display: 'block',
      flexDirection: 'column',
      padding: 50,
      height: '45vh',
      width: 600,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: '#3b5785'
    },
    datePicker: {
      marginTop: '20px'
    },
    outdoor: {
      paddingTop: 30
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submitButton: {
      margin: theme.spacing(3, 0, 2),
      maxWidth: '200px',
      marginRight: '15px',
      backgroundColor: '#3b5785'
    },
    cancelButton: {
      margin: theme.spacing(3, 0, 2),
      maxWidth: '200px',
      marginLeft: '15px',
      backgroundColor: '#3b5785'
    },
}));

export default function AddEvent(props) {
    const classes = useStyles() //handles css stuff
    const [eventName, setEventName] = useState('') //handles user event name entry
    const [eventLocation, setEventLocation] = useState('') //handles user event location entry
    
    //states for all parts of date/time info
    const [eventYear, setEventYear] = useState()
    const [eventMonth, setEventMonth] = useState()
    const [eventDay, setEventDay] = useState()
    const [eventHour, setEventHour] = useState()
    const [eventMinute, setEventMinute] = useState()
    const [eventSecond, setEventSecond] = useState()
    
    //handles indoors/outdoors
    const [isOutdoors, setIsOutdoors] = useState(false)
    const toggle = () => setIsOutdoors(!isOutdoors);

    const history = useHistory()

    function onChange(value, dateString) {
        var dateTimeContent = dateString.split(" ");
        // dateTimeContent[0] -> Date
        // dateTimeContent[1] -> Time
        var dateContent = dateTimeContent[0].split("-")
        // dateContent[0] -> Year | dateContent[1] -> Month | dateContent[2] -> Day
        setEventYear(parseInt(dateContent[0]))
        setEventMonth(parseInt(dateContent[1]))
        setEventDay(parseInt(dateContent[2]))
        var timeContent = dateTimeContent[1].split(":")
        // timeContent[0] -> Hours | timeContent[1] -> Minutes | timeContent[2] -> Seconds
        setEventHour(parseInt(timeContent[0]))
        setEventMinute(parseInt(timeContent[1]))
        setEventSecond(parseInt(timeContent[2]))
    }
    
    function sendInfoToDb(){
        const dateToAdd = new Date(eventYear, (eventMonth - 1), eventDay, eventHour, eventMinute, eventSecond)
        const fireStoreDateTime = firebase.firestore.Timestamp.fromDate(dateToAdd);

        var eventInfoPassed = {
            eventTitle: eventName,
            eventOutdoor: isOutdoors,
            passedEventLocation: eventLocation,
            dateTimeInfo: fireStoreDateTime, 
            specificUserId: props.location.props.userId
        }

        helperFunctions.firestoreFunctions("add_new_event", eventInfoPassed)
    }
    
    return(
        <div className={classes.fullPage}>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box display="flex" alignItems="center" justifyContent="center">
                <Paper elevation={10} className={classes.paper} square={false} varient='outlined' align='center'>
                    <Avatar className={classes.avatar} align="center">
                        <TodayIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" align='center'>
                        Add New Event
                    </Typography>
                    <form className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Event Name"
                            name="eventName"
                            onChange={(e) => setEventName(e.target.value)}
                            />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="eventLoc"
                            label="Event Location (City Name)"
                            onChange={(e) => setEventLocation(e.target.value)}
                        />

                        <div className={classes.datePicker}>
                            <Space direction="vertical" size={12}>
                                <DatePicker showTime onChange={onChange} style={{ width: 500, height: 50}}/>
                            </Space>
                        </div>

                        <FormControlLabel className = {classes.outdoor}
                            control={
                                <Checkbox
                                    checked={isOutdoors}
                                    onChange={toggle}
                                    name="indoorOutdoor"
                                    color="primary"
                                />
                            }
                            label="Will your event take place outdoors?"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submitButton}
                            onClick={() => {
                                sendInfoToDb()
                                history.push("/userdashboard")
                            }}>
                            Submit Event Info
                        </Button>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.cancelButton}
                            onClick={() => {
                                history.push("/userdashboard")
                            }}>
                            Cancel
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
        </div>
    );
    
}
