import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAccBoUgEeNIouMa_K3ttZYIeRotePWOwE",
  authDomain: "wandersonmartins-1052e.firebaseapp.com",
  projectId: "wandersonmartins-1052e",
  storageBucket: "wandersonmartins-1052e.firebasestorage.app",
  messagingSenderId: "134457574281",
  appId: "1:134457574281:web:e3d7da510fc906e66b5758",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const firestore = getFirestore(firebaseApp);
