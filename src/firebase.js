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

        //holds info for adding hometowns upon account creation
        var userInfo = {
            homeTown: data.userHometown,
            firstName: data.firstName
        }

        //holds info for adding events
        var eventInfo = {
            eventDateTime: data.dateTimeInfo,
            location: data.passedEventLocation,
            eventName: data.eventTitle,
            isOutdoors: data.eventOutdoor
        }

        let updateInfo = {
            eventName: data.eventTitle,
            eventDateTime: data.dateTimeInfo, 
            isOutdoors: data.eventOutdoor,
            location: data.location
        }
        
        switch(nameOfFunction){
            //adds user to the db and updates their hometown based on what they input
            case "create_new_user":
                await db.collection('users').doc(data.data.user.uid).set(userInfo)
                break;

            //searches the db based on the user and returns the user info (ht and fn) to display on the profile page
            case "get_user_info":
                const htdoc = await db.collection('users').doc(data).get()
                return htdoc.data()

            //gives user ability to change town to pull weather info from
            case "update_hometown":
                const updateDoc = db.collection('users').doc(data.user)
                await updateDoc.update({homeTown: data.homeTownUpdate});
                break;

            //gives user ability to update first name on updateProfile page
            case "update_firstname":
                const updateFirstName = db.collection('users').doc(data.user)
                await updateFirstName.update({firstName: data.firstNameUpdate});
                break;

            //searches db for users events to display on profile
            case "get_all_events":
                return await db.collection('users').doc(data).collection('userEvents').get() //gets all db info for that user
                    
            //creates new event in the db for the user
            case "add_new_event":
                await db.collection('users').doc(data.specificUserId).collection('userEvents').add(eventInfo)
                break;

            // //allows user to delete an event
            case "delete_event":
                const toBeDeleted = db.collection('users').doc(data.specificUserId).collection('userEvents').where("eventName", "==", data.eventTitle)
                toBeDeleted.get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                      doc.ref.delete();
                    });
                  });
                break;

            //allows user to update info about a certain event
            case "update_event":
                await db.collection('users').doc(data.specificUserId).collection('userEvents').where("eventName", "==", data.oldEventTitle).limit(1).get()
                .then((query) => {  
                    const docUpdate = query.docs[0];
                    console.log(docUpdate.data())
                    docUpdate.ref.update(
                        {
                            eventName: updateInfo.eventName,
                            eventDateTime: updateInfo.eventDateTime,
                            isOutdoors: updateInfo.isOutdoors,
                            location: updateInfo.location
                        });
                });
                break;

            default:
                console.log("Function not found")
                break;
        }
                
    }
}
        
export default helperFunctions