import React from 'react'
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from "react-router-dom"
import Box from '@material-ui/core/Box';
import helperFunctions from '../firebase.js'

const useStyles = makeStyles((theme) => ({
    icon: {
      marginRight: theme.spacing(2),
    },
    heroContent: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
      marginTop: theme.spacing(4),
    },
    cardGrid: {
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8),
    },
    card: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    cardMedia: {
      paddingTop: '56.25%', // 16:9
    },
    cardContent: {
      flexGrow: 1,
    },
    footer: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(6),
    },
  }));

export default function DeleteEvent(props) {
    console.log(props.location.props.eventName)

    const classes = useStyles();
    const history = useHistory()

    //deletes event given from db
    function deleteEventFromDb(){
    
        var deleteInfoPassed = {
            eventTitle: props.location.props.eventName,
            specificUserId: props.location.props.userId
        }

        helperFunctions.firestoreFunctions("delete_event", deleteInfoPassed)
    }

    return (
        <React.Fragment>
        <CssBaseline />
        <main>
            {/* Hero unit */}
            <div className={classes.heroContent}>
            <Container maxWidth="sm">
                <Typography component="h1" variant="h3" align="center" color="secondary" gutterBottom>
                Delete "{props.location.props.eventName}"?
                </Typography>
                <Typography variant="h5" align="center" color="textSecondary" paragraph>
                Are you sure that you would like to delete your "{props.location.props.eventName}" event?
                Once deleted, you cannot get the event back and must recreate it in your calendar.
                </Typography>
                <Typography variant="overline" align="center" color="primary" paragraph>
                    <Box fontStyle="italic" m={1}>
                        ********
                    </Box>
                    <Box fontStyle="italic" m={1}>
                        If event is deleted, be sure to refresh user dashboard to view your updated calendar.
                    </Box>
                    <Box fontStyle="italic" m={1}>
                        ********
                    </Box>
                </Typography>
                <div className={classes.heroButtons}> 
                <Grid container spacing={2} justify="center">
                    <Grid item>
                    <Button variant="contained" color="secondary" onClick={() => 
                        {
                            deleteEventFromDb()
                            history.push("/userdashboard")
                        }}>
                        Delete
                    </Button>
                    </Grid>
                    <Grid item>
                    <Button variant="outlined" color="primary" onClick={() => {history.push("/userdashboard") }}>
                        Cancel
                    </Button>
                    </Grid>
                </Grid>
                </div>
            </Container>
            </div>
        </main>
        </React.Fragment>
    );
}
