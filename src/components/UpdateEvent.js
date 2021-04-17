import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { DatePicker, Space } from 'antd';
import 'antd/dist/antd.css';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Checkbox, FormControlLabel } from '@material-ui/core';
import firebase from 'firebase/app'
import helperFunctions from '../firebase.js'
import { useHistory } from "react-router-dom"


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

export default function AddEvent(props) {
    const classes = useStyles() //handles css stuff

    let updateInfoPassed = {
        eventTitle: props.location.props.eventName,
        specificUserId: props.location.props.userId
    }

    let oldEventInfo = {
        eventTitle: props.location.props.eventName,
        eventTime: props.location.props.eventDateTime,
        outdoors: props.location.props.outdoors
    }

    console.log(oldEventInfo)

    const [eventName, setEventName] = useState(oldEventInfo.eventTitle) //handles user event name entry
    
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

    //console.log(eventName)

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
    
    function sendUpdateInfoToDb(){
        
    }
    
    return(
        <div className={classes.container}>

        <h1 className={classes.title}>Add Event Title Below</h1>
        <form noValidate autoComplete="off">
            <TextField onChange={(e) => setEventName(e.target.value)} id="filled-basic" defaultValue={eventName} label="Enter Event Name" variant="filled" color="secondary"/>
        </form>


        <h1 className={classes.title}>Update Event Infomation Below</h1>
        <div>
            <Space direction="vertical" size={12}>
                <DatePicker showTime onChange={onChange} />
            </Space>
        </div>

        <h1 className={classes.title}>Event Location</h1>
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
            //history.push("/userdashboard")
        }}>
            Submit Updated Info
        </Button>

        </div>
    )

}
