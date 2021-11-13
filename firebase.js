// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// expo doesn't support firebase v9 yet
// we instead use firebase@8.2.3
import firebase from 'firebase';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcyN96SIznchdstM6WPHanTz4LcTSPBes",
  authDomain: "rn-parq-comp313.firebaseapp.com",
  projectId: "rn-parq-comp313",
  storageBucket: "rn-parq-comp313.appspot.com",
  messagingSenderId: "82167954376",
  appId: "1:82167954376:web:9bcc96bcd629d4a5bcdefd",
};

// Initialize Firebase
!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = firebase.firestore();

export { firebase, db }


export async function getBookedSpots(spotsRetreived) {

  var spotsList ;
  var snapshot = await 
    db.collection(`bookedSpots`)
    .where("owner_uid", "==", `${await firebase.auth().currentUser.uid}`)
    .get()
  spotsList = [];
  snapshot.forEach((doc) => {
    const spotItem = doc.data();
    spotItem.id = doc.id;
    //console.log(spotItem);
    spotsList.push({
      end: doc.data().end,
      location: doc.data().location,
      name: doc.data().name,
      owner_uid: doc.data().owner_uid,
      parkingLotId: doc.data().parkingLotId,
      parkingSpotId: doc.data().parkingLotId,
      start: doc.data().start,
    });
  });
  
  spotsRetreived(spotsList);
}



export function convertDateTime(time) {
  if (typeof time !== "undefined") {
    const fireBaseTime = new Date(
    time.seconds * 1000 + time.nanoseconds / 1000000,
    );
    const date = fireBaseTime.toDateString();
    const atTime = fireBaseTime.toLocaleTimeString();

   // console.log(date, atTime);
    return `${date}, ${atTime}`
  }
}

