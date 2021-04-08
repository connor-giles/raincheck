import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles({
    gridContainer: {
        paddingLeft: '20px',
        paddingRight: '20px'
    }
})

export default function SingleCard({props}) {
    const classes = useStyles()
    return (
        <Grid container spacing={3} className={classes.gridContainer} justify={'center'}>
            <Grid item xs={2}>
                <Card style={{backgroundColor: "lightblue"}}>
                    <CardContent>
                        <Typography variant="h5" component="h2" align="center">
                            {props.eventName}
                        </Typography>
                        <Typography align="center">
                            {props.userTime}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}
