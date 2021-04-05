import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase.js'
import { db } from '../firebase.js'

const AuthContext = React.createContext()



export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    //creates a user based on their username and passsword to store into firebase
    function signup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password)
        .then(async function(data){
            //console.log('uid', data.user.uid)
            //db.collection('users').doc(data.user.uid)
            //var temp = await db.collection('testRainCheck').doc('G2zBTSQ2BBnCxoSOLMcB').get()
            //console.log(temp.data())

            var userData = {
                homeTown: "Gainesville",
                events: "Picnic at 3"
            }

            await db.collection('users').doc(data.user.uid).set(userData)
        })
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password)
    }

    function logout() {
        return auth.signOut()
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    function updateEmail(email) {
        return currentUser.updateEmail(email)
    }
    
    function updatePassword(password) {
        return currentUser.updatePassword(password)
    }


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })

        return unsubscribe
    }, [])


    const value = {
        currentUser,
        login,
        signup,
        logout,
        resetPassword,
        updateEmail,
        updatePassword
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
