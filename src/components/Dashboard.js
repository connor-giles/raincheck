import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CloudIcon from '@material-ui/icons/Cloud';

const weatherAPI = {
    key: "2a57815a865fa327116a8e960e80aa9e",
    base: "https://api.openweathermap.org/data/2.5/"
}

const useStyles = makeStyles((theme) => ({
    root: {
    fontWeight: 600,
      flexGrow: 1,
    },
    navBar: {
        fontWeight: 600,
        backgroundColor: '#212d5b',
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16
      },
    menuButton: {
      fontWeight: 600,
      marginRight: theme.spacing(2),
    },
    title: {
    fontWeight: 600,
      flexGrow: 1,
      color: '#fff'
    },
    button: {
        fontWeight: 600
    }
  }));

  const styles = {
    largeIcon: {
      width: 20,
      height: 20
    }
  };

export default function Dashboard() {
    const classes = useStyles();

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

            <div className={classes.root}>
                <AppBar className={classes.navBar} position="static">
                    <Toolbar>
                    <Typography variant='h4' className={classes.title}>
                        RainCheck <CloudIcon className="svg_icons" />
                    </Typography>
                    <Button  color='inherit' href='/login'>Log-in</Button>
                    <Button color='inherit' href='/signup'>Sign Up</Button>
                    </Toolbar>
                </AppBar>
            </div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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

            
        </div>
    )
}
