import React, { useState } from 'react'
import { Link } from "react-router-dom"

const weatherAPI = {
    key: "2a57815a865fa327116a8e960e80aa9e",
    base: "https://api.openweathermap.org/data/2.5/"
}

export default function Dashboard() {

    const [apiQuery, setApiQuery] = useState('');
    const [weather, setWeather] = useState({});

    const searchWeather = evt => {
        if(evt.key === "Enter") {
        fetch(`${weatherAPI.base}weather?q=${apiQuery}&units=metric&APPID=${weatherAPI.key}`)
            .then(res => res.json())
            .then(result => {
            setWeather(result);
            setApiQuery('');
            console.log(result)
            });
        }
    }

    const dateBuilder = (d) => {
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        let day = days[d.getDay()];
        let date = d.getDate();
        let month = months[d.getMonth()];
        let year = d.getFullYear();

        return `${day} ${date} ${month} ${year}`
    }



    return (
        <div className="app">
            <main>

            <div className="search-box">
                <input 
                type="text"
                className="search-bar"
                placeholder="Search for a city..."
                onChange={e => setApiQuery(e.target.value)}
                value={apiQuery}
                onKeyPress={searchWeather}
                />
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

            </main>

            <div className="display-3 w-100 text-right fixed-top mt-5 pt-5 pr-5">
                <Link to="/login">Login</Link>
            </div> 

        </div>
    )
}
