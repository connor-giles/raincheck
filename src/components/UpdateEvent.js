import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { DatePicker, Space } from 'antd';
import 'antd/dist/antd.css';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Checkbox, FormControlLabel } from '@material-ui/core';
import firebase from 'firebase/app'
import helperFunctions from '../firebase.js'
import { useHistory } from "react-router-dom"
import moment from 'moment';


const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '10%',
    },
    title: {
        marginBottom: '6%'
    }
})

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
    
    function sendUpdateInfoToDb() {
        console.log("Year: " + eventYear)
        console.log("Month: " + eventMonth)
        console.log("Day: " + eventDay)
        console.log("Hour: " + eventHour)
        console.log("Minute: " + eventMinute)
        console.log("Second: " + eventSecond)
        const dateToAdd = new Date(eventYear, (eventMonth - 1), eventDay, eventHour, eventMinute, eventSecond)

        console.log("DATE BEING SENT TO DB: " + dateToAdd)
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
        <div className={classes.container}>

        <h1 className={classes.title}>Update Event Title Below</h1>
        <form noValidate autoComplete="off">
            <TextField onChange={(e) => setEventName(e.target.value)} id="filled-basic" defaultValue={eventName} label="Enter Updated Name" variant="filled" color="secondary"/>
        </form>


        <h1 className={classes.title}>Update Event Infomation Below</h1>
        <div>
            <Space direction="vertical" size={12}>
                <DatePicker defaultValue={tempDateTime} showTime onChange={onChange} />
            </Space>
        </div>

        <h1 className={classes.title}>Update Event Location</h1>
        <form noValidate autoComplete="off">
            <TextField onChange={(e) => setUpdatedLocation(e.target.value)} id="filled-basic" defaultValue={updatedLocation} label="Enter Updated Location" variant="filled" color="secondary"/>
        </form>
        <FormControlLabel
            control={
                <Checkbox
                    checked={isOutdoors}
                    onChange={toggle}
                    name="indoorOutdoor"
                    color="primary"
                />
            }
            label="Outdoors"
        />

        <Button variant="outlined" color="primary"
        onClick={() => {
            sendUpdateInfoToDb()
            history.push("/userdashboard")
        }}>
            Submit Updated Info
        </Button>

        <Button variant="outlined" color="primary" onClick={() => {history.push("/userdashboard") }}>
            Cancel
        </Button>

        <br></br>
        <br></br>
        <br></br>
        <h1 className={classes.title} color="red">*** Be Sure to Refresh User Dashboard to See Updated Event ***</h1>

        </div>
    )

}
