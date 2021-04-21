import React, { useState, useEffect } from 'react'
import { Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext.js'
import { Link, useHistory } from 'react-router-dom'
import emailjs from 'emailjs-com'
import { makeStyles } from '@material-ui/core/styles';
import { Button, Checkbox, FormControlLabel, Grid, Typography, Toolbar, AppBar, CardMedia } from '@material-ui/core';
import { TextField, Container, CssBaseline, Avatar, Paper, Box, Card, CardActions, CardContent } from '@material-ui/core';
import helperFunctions from '../firebase.js'
import CalendarCards from './CalendarCards'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Image from '../assets/pic2.jpg';


const weatherAPI = {
    key: "2a57815a865fa327116a8e960e80aa9e",
    base: "https://api.openweathermap.org/data/2.5/"
}

const useStyles = makeStyles((theme) => ({
    fullPage: {
        backgroundImage:  `url(${Image})`,
        backgroundSize: 'cover',
    },
    fullGridContainer: {
        marginTop: '80px'
    },
    logoutButton: {
        maxWidth: '200px',
        marginTop: '100px',
        backgroundColor: '#3b5480',
        marginBottom: '320px'
    },
    weatherBox: {
        margin: 'auto',
    },
    profileBox: {
        margin: 'auto'
    },
    eventsBox: {
        margin: 'auto',
    },
    editProfileButtonText: {
        maxWidth: '200px',
        marginTop: '6px',
        backgroundColor: '#3b5480',
        color: '#ffffff'
    },
    editProfileButton: {
        justifyContent: 'center'
    },
    profileContent: {
        marginLeft: '175px',
        marginTop: '20px',
    },
    paper: {
        display: 'block',
        padding: '65px',
        height: '600px',
        width: '600px',
        margin: 'auto',
        backgroundColor: '#99c0e6',
    },
    infoGrids: {
        marginTop: '100px',
    },
    root: {
        fontWeight: 600,
        flexGrow: 1,
    },
    navBar: {
        fontWeight: 600,
        backgroundColor: '#3b5480',
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16
    },
    title: {
        fontWeight: 600,
          flexGrow: 1,
          color: '#fff'
    },
    profileTitle: {
        fontWeight: 600,
        flexGrow: 1,
        color: '#222',
        align: 'center'
    },
    welcomeTag: {
        fontWeight: 200,
        color: '#fff',
        fontSize: '18px',
        marginTop: '3px',
        marginLeft: '8px'
    },
    userInfo: {
        width: '600px',
        height: '600px',
        margin: 'auto',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
}));

export default function UserDashboard() {

    const classes = useStyles() //handles css stuff
    const[error, setError] = useState('')
    const[homeT, setHomeT] = useState('')
    const[firstName, setFirstName] = useState('Raincheck User')
    const [weather, setWeather] = useState({});
    const { currentUser, logout } = useAuth()
    const history = useHistory()

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

    //Handles main function of app, which is checking weather with calendar to send email notifications
    function sendEmail(passedInParams) {

        let templateParams = {
            usersName: firstName,
            eventName: passedInParams.eventName,
            eventTime: passedInParams.eventTime,
            eventDay: passedInParams.eventDay,
            eventLocation: passedInParams.eventLocation,
            weatherIssue: passedInParams.weatherIssue,
            teamName : 'The Raincheck Team',
            email: currentUser.email,
        }

        emailjs.send('service_9cc3g3w', 'template_bysh0kp', templateParams, 'user_gRwkODYoHmZeIXphrdLjY')
        .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        }, function(error) {
        console.log('FAILED...', error);
        });
    }

    //builds the date info for the user dashboard
    const dateBuilder = (d) => {
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        let day = days[d.getDay()];
        let date = d.getDate();
        let month = months[d.getMonth()];
        let year = d.getFullYear();

        return `${day} ${date} ${month} ${year}`
    }

    async function handleLogout() {
        setError('')

        try {
          await logout()
          history.push('/')
        } catch {
            setError('Failed to log out')
        }

    }

    //gets the users hometown from the database and displays it on their profile
    helperFunctions.firestoreFunctions("get_user_info", currentUser.uid)
    .then((res) => {
        setHomeT(res.homeTown)
        setFirstName(res.firstName)
    })

    //gets weather based on the users hometown and displays it on profile
    useEffect(() => {
        fetch(`${weatherAPI.base}weather?q=${homeT}&units=metric&APPID=${weatherAPI.key}`)
        .then(res => res.json())
        .then(result => {
        setWeather(result);
        //console.log(result) //ensures getting correct user weather info
        })
    }, [homeT]);

    // used to check events in db every 10 mins
    // useEffect(() => {
    // const interval = setInterval(() => {
    //     //code to run everytime the interval hits
    //     //gets events from db
    //     async function getEvents() {
    //         var eventArray = []
    //         //get all users events
    //         return db.collection('users').doc(currentUser.uid).collection('userEvents').get()
    //         .then(querySnapshot => {
    //             //if there are no events for the user
    //             if(querySnapshot.empty) {
    //                 console.log('No matching documents.')
    //                 return eventArray
    //             } else {
    //                 querySnapshot.forEach(doc => {
    //                     if (!doc.data().hasBeenChecked && doc.data().isOutdoors) {
    //                         var eventStartTime = new Date(doc.data().eventDateTime.seconds * 1000 + doc.data().eventDateTime.nanoseconds/1000000)
    //                         var currentDateTime = new Date() //current time
    //                         var diffHours = Math.abs(eventStartTime - currentDateTime) / 36e5 //calculates how many hours until event start
    //                         //console.log("Difference in hours: " + diffHours)
    //                         if (diffHours < 2) {
    //                             eventArray.push(doc.data())
    //                         }
    //                     }
    //                 });
    //                 return eventArray
    //             }
    //         });
    //     }
    //     //this function call will contain all events that start in 2 hours or less to be handled
    //     getEvents().then(result => {

            
            
    //         //if there are events in less than 2 hours
    //         if (result.length > 0) {
                
                
    //             //examine each event coming up
    //             result.forEach(event => {
    //                 let needToSendEmail = false
    //                 let weatherIssue = ''
                    
    //                 // //gets weather info
    //                 fetch(`${weatherAPI.base}weather?q=${event.location}&units=metric&APPID=${weatherAPI.key}`)
    //                 .then(res => res.json())
    //                 .then(weatherResult => {
                        
    //                     //console.log(weatherResult)
                        
    //                     if (weatherResult.weather[0].main === "Snow") {
    //                         needToSendEmail = true
    //                         weatherIssue = "Potential Snowfall"
    //                     } else if (weatherResult.weather[0].main === "Rain") {
    //                         needToSendEmail = true
    //                         weatherIssue = "Potential Rainfall"
    //                     } else if (Math.round(weatherResult.main.temp * 9 / 5 + 32) > 90) {
    //                         needToSendEmail = true
    //                         weatherIssue = "Extreme Heat"
    //                     } else {
    //                         //do something else? nothing?
    //                     }
                        
    //                     if (needToSendEmail) {

    //                         //month names for building strings
    //                         const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    //                         const dayNames= ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    //                         //handles date creation)
    //                         let jsDateObj = new Date(event.eventDateTime.seconds * 1000 + event.eventDateTime.nanoseconds/1000000)
    //                         var dayNameInfo = dayNames[jsDateObj.getDay()]
    //                         var monthInfo = monthNames[jsDateObj.getMonth()]
    //                         var dayNumInfo = jsDateObj.getDate()
    //                         var stringDate = dayNameInfo + " " + monthInfo + " " + dayNumInfo

    //                         var emailParams = {
    //                             eventName: event.eventName,
    //                             eventTime: formatAMPM(jsDateObj),
    //                             eventDay: stringDate,
    //                             eventLocation: event.location,
    //                             weatherIssue: weatherIssue
    //                         }
                            
    //                         sendEmail(emailParams)
    //                     }

    //                     //determines event no longer needs to be checked with the next db check
    //                     let hasCheckedInfo = {
    //                         eventTitle: event.eventName,
    //                         specificUserId: currentUser.uid, 
    //                         hasBeenChecked: true
    //                     }
                           
    //                     helperFunctions.firestoreFunctions("update_check", hasCheckedInfo)

    //                 });
    //             })
    //         }
    //     })
    // }, 600000);
    // return () => clearInterval(interval);
    // }, []);

    
    return (
        <div className={classes.fullPage}>
            <div className={classes.root}>
                <AppBar className={classes.navBar} position="static">
                    <Toolbar>
                        <Typography variant='h4' className={classes.title}>
                            User Profile
                        </Typography>
                        <AccountCircleIcon fontSize="large" />
                        <Typography variant='h4' className={classes.welcomeTag}>
                            Greetings {firstName} 
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}

            <Grid container className={classes.fullGridContainer}>
                <Grid item xs={4} className={classes.profileBox}> 
                    <Typography variant='h3' className="text-center mb-4">
                        Profile Information
                    </Typography>
                    <Card className={classes.userInfo}>
                        <CardMedia
                            className={classes.cardMedia}
                            image='https://bit.ly/3sF0DQO'
                            title="Image title"
                        />
                        <CardContent className={classes.profileContent}>
                            <Typography gutterBottom variant="h5" component="h2">
                                E-Mail: {currentUser.email}
                            </Typography>
                            <Typography gutterBottom variant="h5" component="h2">
                                Hometown: {homeT}
                            </Typography>
                            <Typography gutterBottom variant="h5" component="h2">
                                First Name: {firstName}
                            </Typography>
                        </CardContent>
                        <CardActions className={classes.editProfileButton}>
                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                className={classes.editProfileButtonText}
                                href="/update-profile">
                                Edit Profile
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={4} className={classes.eventsBox}>
                    <Typography variant='h3' className="text-center mb-4">
                        Upcoming Events
                    </Typography>
                    <CalendarCards id={currentUser.uid}/>
                    <div className="w-100 text-center mt-3">
                        <Link to={{
                            pathname:"/add-event", 
                            props:{
                                userId: currentUser.uid
                            }
                        }} >Add New Event</Link>
                    </div>
                </Grid>
                <Grid item xs={4} className={classes.weatherBox}>
                    <Typography variant='h3' className="text-center mb-4">
                        Hometown Weather
                    </Typography>
                    <Paper elevation={2} className={classes.paper} square={false} varient='outlined' align='center'>
                        {(typeof weather.main != "undefined") ? (
                            <div>
                            <div className="profile-location-box">
                                <div className="location" >{weather.name}, {weather.sys.country} </div>
                                <div className="date">{dateBuilder(new Date())}</div>
                            </div>

                            <div className="profile-weather-box">
                                <div className="temp">{Math.round(weather.main.temp * 9 / 5 + 32)}°F</div>
                                <div className="weather">{weather.weather[0].main}</div>
                            </div>
                            </div>
                        ) : ('')}
                    </Paper>
                </Grid>
            </Grid>

            {/* Logout button */}
            <div className="w-100 text-center mt-2">
                {/* <Button variant="link" onClick={handleLogout}>Log Out</Button> */}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.logoutButton}
                    onClick={() => {
                        handleLogout()
                    }}>
                    Log Out
                </Button>
            </div>
        </div>
    )
}
