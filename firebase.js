import firebase from 'firebase/app'; 
import 'firebase/auth';

// Your Firebase Config object based on google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyBha6mMtoCvncZRSF8gRN9A8IEUQn9q01U",
  authDomain: "expense-tracker-9e7fe.firebaseapp.com", // projectId.firebaseapp.com
  projectId: "expense-tracker-9e7fe", // from google-services.json
  storageBucket: "expense-tracker-9e7fe.appspot.com", // from google-services.json
  messagingSenderId: "421563005646", // project_number from google-services.json
  appId: "1:421563005646:android:00e4dc18e6555951562e9f", // mobilesdk_app_id
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
