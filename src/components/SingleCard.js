import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import firebase from 'firebase/app'

const useStyles = makeStyles({
    gridContainer: {
        paddingLeft: '20px',
        paddingRight: '20px'
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
            <Grid item xs={2}>
                <Card style={{backgroundColor: "lightblue"}}>
                    <CardContent>
                        <Typography variant="h5" component="h2" align="center">
                            {props.eventName}
                        </Typography>
                        <Typography align="center">
                            {stringDate}
                        </Typography>
                        <Typography align="center">
                            {formatAMPM(timeObject)}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}
