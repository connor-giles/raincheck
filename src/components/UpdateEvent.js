import React, { useState } from 'react';
import { DatePicker, Space } from 'antd';
import 'antd/dist/antd.css';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Checkbox, FormControlLabel, Typography } from '@material-ui/core';
import { TextField, Container, CssBaseline, Avatar, Paper, Box } from '@material-ui/core';
import firebase from 'firebase/app'
import helperFunctions from '../firebase.js'
import { useHistory } from "react-router-dom"
import moment from 'moment';
import UpdateIcon from '@material-ui/icons/Update';
import Image from '../assets/pic2.jpg';


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
      backgroundColor: '#436385'
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
      backgroundColor: '#436385'
    },
    cancelButton: {
      margin: theme.spacing(3, 0, 2),
      maxWidth: '200px',
      marginLeft: '15px',
      backgroundColor: '#436385'
    },
}));

export default function UpdateEvent(props) {
    const classes = useStyles() //handles css stuff

    let temp = new Date(props.location.props.eventDateTime.seconds * 1000 + props.location.props.eventDateTime.nanoseconds/1000000)
    let tempDateTime = moment(temp)

    let oldEventInfo = {
        eventTitle: props.location.props.eventName,
        eventTime: tempDateTime,
        outdoors: props.location.props.outdoors,
        location: props.location.props.location
    }

    const [eventName, setEventName] = useState(oldEventInfo.eventTitle) //handles user event name entry
    const [updatedLocation, setUpdatedLocation] = useState(oldEventInfo.location) //handles user event name entry
    
    
    //states for all parts of date/time info
    const [eventYear, setEventYear] = useState(temp.getFullYear())
    const [eventMonth, setEventMonth] = useState(temp.getMonth() + 1)
    const [eventDay, setEventDay] = useState(temp.getDate())
    const [eventHour, setEventHour] = useState(temp.getHours())
    const [eventMinute, setEventMinute] = useState(temp.getMinutes())
    const [eventSecond, setEventSecond] = useState(temp.getSeconds())
    
    //handles indoors/outdoors
    const [isOutdoors, setIsOutdoors] = useState(oldEventInfo.outdoors)
    const toggle = () => setIsOutdoors(!isOutdoors);

    const history = useHistory()

    function onChange(value, dateString) {
        var dateTimeContent = dateString.split(" ");
        // dateTimeContent[0] -> Date
        // dateTimeContent[1] -> Time
        if (dateTimeContent[0] !== undefined && dateTimeContent[1] !== undefined) {
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
    }
    
    function sendUpdateInfoToDb() {
        const dateToAdd = new Date(eventYear, (eventMonth - 1), eventDay, eventHour, eventMinute, eventSecond)
        const fireStoreDateTime = firebase.firestore.Timestamp.fromDate(dateToAdd);

        let updateInfoPassed = {
            eventTitle: eventName,
            oldEventTitle: oldEventInfo.eventTitle,
            eventOutdoor: isOutdoors,
            dateTimeInfo: fireStoreDateTime, 
            specificUserId: props.location.props.userId, 
            location: updatedLocation
        }
           
        helperFunctions.firestoreFunctions("update_event", updateInfoPassed)
    }
    
    return(
        <div className={classes.fullPage}>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box display="flex" alignItems="center" justifyContent="center">
                <Paper elevation={10} className={classes.paper} square={false} varient='outlined' align='center'>
                    <Avatar className={classes.avatar} align="center">
                        <UpdateIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" align='center'>
                        Update Event
                    </Typography>
                    <form className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Updated Event Name"
                            name="eventName"
                            onChange={(e) => setEventName(e.target.value)}
                            defaultValue={eventName}
                            />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="eventLoc"
                            label="Updated Event Location (City Name)"
                            onChange={(e) => setUpdatedLocation(e.target.value)}
                            defaultValue={updatedLocation}
                        />

                        <div className={classes.datePicker}>
                            <Space direction="vertical" size={12}>
                                <DatePicker showTime onChange={onChange} defaultValue={tempDateTime} style={{ width: 500, height: 50}}/>
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
                                sendUpdateInfoToDb()
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


    )

}
