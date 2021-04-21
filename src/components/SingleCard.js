import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
//import firebase from 'firebase/app'
import { Link } from 'react-router-dom'

const useStyles = makeStyles({
    gridContainer: {
        paddingLeft: '20px',
        paddingRight: '20px'
    },
    eventFont: {
        color : '#ffffff'
    },
    eventFontTitle: {
        color : '#ffffff',
        fontStyle:'italic'
    }
})

export default function SingleCard({props}) {
    const classes = useStyles()

    //month names for building strings
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames= ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    //handles date creation
    const timeObject = new Date(props.userTime.seconds * 1000 + props.userTime.nanoseconds/1000000)
    var dayNameInfo = dayNames[timeObject.getDay()]
    var monthInfo = monthNames[timeObject.getMonth()]
    var dayNumInfo = timeObject.getDate()
    var stringDate = dayNameInfo + " " + monthInfo + " " + dayNumInfo

    //handles time creation
    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    return (
        <Grid container spacing={3} className={classes.gridContainer} justify={'center'}>
            <Grid item xs={6}>
                <Card style={{backgroundColor: "#7591be"}}>
                    <CardContent>
                        <Typography className={classes.eventFontTitle} variant="h5" component="h2" align="center">
                            <b>{props.eventName}</b>
                        </Typography>
                        <Typography className={classes.eventFont} align="center">
                            {stringDate}
                        </Typography>
                        <Typography className={classes.eventFont} align="center">
                            {formatAMPM(timeObject)}
                        </Typography>
                        <Typography className={classes.eventFont} align="center">
                            {props.location}
                        </Typography>
                        <div className="w-100 text-center mt-3">
                            <Link className={classes.eventFont} to={{
                                pathname:"/delete-event", 
                                props:{
                                    userId: props.userId,
                                    eventName: props.eventName
                                }
                            }} >Delete</Link>
                            &nbsp;&nbsp;&nbsp;<b className={classes.eventFont}>|</b>&nbsp;&nbsp;&nbsp;  
                            <Link className={classes.eventFont} to={{
                                pathname:"/update-event", 
                                props:{
                                    userId: props.userId,
                                    eventName: props.eventName,
                                    eventDateTime: props.userTime,
                                    outdoors: props.outdoors,
                                    location: props.location
                                }
                            }} >Update</Link>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}
