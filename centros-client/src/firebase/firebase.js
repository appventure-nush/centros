import {initializeApp} from "firebase/app";
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAz3q1nX9gfNeKBnU0MmWWY8SH2rKG3jCQ",
    authDomain: "centros-417e4.firebaseapp.com",
    projectId: "centros-417e4",
    storageBucket: "centros-417e4.appspot.com",
    messagingSenderId: "460576686538",
    appId: "1:460576686538:web:2bec34e6f76cf23729cf33"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app)

export async function saveFile(file, path, metadata) {
    const fileRef = ref(storage, path)
    return await uploadBytes(fileRef, file, metadata);
}

export async function getLink(path) {
    return await getDownloadURL(ref(storage, path))
}