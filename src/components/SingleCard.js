import React from 'react'

export default function SingleCard({props}) {
    return (
        <div>
            <h1>{props.eventName}</h1>
            <h1>{props.userTime}</h1>
        </div>
    )
}
