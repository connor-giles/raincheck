import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const app = firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
})

export const auth = app.auth()
export const db = firebase.firestore()
// export default app

const helperFunctions = {
    firestoreFunctions: async function (nameOfFunction, data) {

        var userInfo = {
            homeTown: data.userHometown
        }
        
        switch(nameOfFunction){
            //adds user to the db and updates their hometown based on what they input
            case "create_new_user":
                await db.collection('users').doc(data.data.user.uid).set(userInfo)
                break;

            case "get_user_hometown_from_profile":
                const doc = await db.collection('users').doc(data).get()
                return doc.data()
                
            default:
                console.log("Function not found")
                break;
        }
                
    }
}
        
export default helperFunctions