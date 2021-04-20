import React, {useState, useEffect } from 'react'
import helperFunctions from '../firebase.js'
import SingleCard from './SingleCard'

export default function CalendarCards(id) {
    const [eventIDs, setEventIDs] = useState({})
    
    useEffect(() =>{
        helperFunctions.firestoreFunctions("get_all_events", id.id).then((res) => {
            setEventIDs(res)
        })
    },[id.id])

    
    

    if(Object.keys(eventIDs).length !== 0){ 
        return (
            <>
                {eventIDs.docs.map((doc) => {
                    var props = {
                        eventName: doc.data().eventName,
                        userTime: doc.data().eventDateTime,
                        outdoors: doc.data().isOutdoors,
                        userId: id.id,
                        location: doc.data().location
                    }
                    return(
                        <SingleCard props={props}/>
                    )
                })}
            </>
        )
    } // END IF

    return (
        <div> Loading... </div>
    )
}
