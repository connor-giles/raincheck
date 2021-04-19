import React, { useState, useEffect } from 'react'
import { Card, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext.js'
import { Link, useHistory } from 'react-router-dom'
import helperFunctions from '../firebase.js'
import CalendarCards from './CalendarCards'

const weatherAPI = {
    key: "2a57815a865fa327116a8e960e80aa9e",
    base: "https://api.openweathermap.org/data/2.5/"
}

export default function UserDashboard() {
    
    const[error, setError] = useState('')
    const[homeT, setHomeT] = useState('')
    const [weather, setWeather] = useState({});
    const { currentUser, logout } = useAuth()
    const history = useHistory()

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
    helperFunctions.firestoreFunctions("get_user_hometown", currentUser.uid)
    .then((res) => {
        setHomeT(res.homeTown)
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

    
    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Profile</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <strong>Email: </strong> {currentUser.email}
                    <br></br>
                    <strong>Hometown: </strong> {homeT}
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
        </>
    )
}
