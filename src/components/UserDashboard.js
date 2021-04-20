import React, { useState, useEffect } from 'react'
import { Card, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext.js'
import { Link, useHistory } from 'react-router-dom'
import helperFunctions from '../firebase.js'
import CalendarCards from './CalendarCards'
import emailjs from 'emailjs-com'

//test firebase imports
import firebase from 'firebase/app'
const db = firebase.firestore()

const weatherAPI = {
    key: "2a57815a865fa327116a8e960e80aa9e",
    base: "https://api.openweathermap.org/data/2.5/"
}

export default function UserDashboard() {
    
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
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Profile</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <strong>Email: </strong> {currentUser.email}
                    <br></br>
                    <strong>Hometown: </strong> {homeT}
                    <br></br>
                    <strong>First Name: </strong> {firstName}
                    <Link to="/update-profile" className="btn btn-primary w-100 mt-3">Edit Profile</Link>
                </Card.Body>
            </Card>

            <h1 className="text-center mb-4">Upcoming Events</h1>
            <CalendarCards id={currentUser.uid}/>
            <div className="w-100 text-center mt-3">
                <Link to={{
                    pathname:"/add-event", 
                    props:{
                        userId: currentUser.uid
                    }
                }} >Add New Event</Link>
            </div>

            {(typeof weather.main != "undefined") ? (
                <div>
                <div className="location-box">
                    <div className="location">{weather.name}, {weather.sys.country} </div>
                    <div className="date">{dateBuilder(new Date())}</div>
                </div>

                <div className="weather-box">
                    <div className="temp">{Math.round(weather.main.temp * 9 / 5 + 32)}°F</div>
                    <div className="weather">{weather.weather[0].main}</div>
                </div>
                </div>
            ) : ('')}

            {/* Logout button */}
            <div className="w-100 text-center mt-2">
                <Button variant="link" onClick={handleLogout}>Log Out</Button>
            </div>


            {/* email button */}
            {/* <div className="w-100 text-center mt-2">
                <Button variant="link" onClick={}>Send Email</Button>
            </div> */}
        </>
    )
}
