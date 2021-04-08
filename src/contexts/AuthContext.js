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
    function signup(email, password, hometown) {
        return auth.createUserWithEmailAndPassword(email, password)
        .then(async function(data){

            var userData = {
                data: data,
                userHometown: hometown
            }

            helperFunctions.firestoreFunctions("create_new_user", userData)

            // How to add new subcollection
            // await db.collection('users').doc(data.user.uid).collection("userEvents").add({
            //     name: "picnic",
            //     time: "3 pm",
            //     outdoor: true
            // })
            // await db.collection('users').doc(data.user.uid).collection("userEvents").add({
            //     name: "basketball",
            //     time: "5 pm",
            //     outdoor: false
            // })
            
            // // How to query data
            // const ref = db.collection('users').doc(data.user.uid).collection("userEvents");
            // const snapshot = await ref.where('name', '==', 'basketball').get();
            // snapshot.forEach(doc => {
            //     console.log(doc.id, '=>', doc.data());
            // });
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
