import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase.js'
import helperFunctions from '../firebase.js'

const AuthContext = React.createContext()



export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    //creates a user based on their username and passsword to store into firebase
    function signup(email, password, hometown, firstname) {
        return auth.createUserWithEmailAndPassword(email, password)
        .then(async function(data){

            var userData = {
                userEmail: email,
                data: data,
                userHometown: hometown,
                firstName: firstname
            }

            await helperFunctions.firestoreFunctions("create_new_user", userData)
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
