import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    getDoc,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDG9hyxlhvWTfVq2jzWYLaFsA3q0001o40",
    authDomain: "fir-intro-e7590.firebaseapp.com",
    projectId: "fir-intro-e7590",
    storageBucket: "fir-intro-e7590.appspot.com",
    messagingSenderId: "864334246836",
    appId: "1:864334246836:web:70b5d7064b7751db5e78e1"
};

initializeApp(firebaseConfig)

// initialize database connection
const db = getFirestore();
const auth = getAuth();
// get collection ref
const colRef = collection(db,'books')
// queries
const q = query(colRef,orderBy('createdAt'))
// get real time data
const realData = onSnapshot(q, snapshot => {
    let books = [];
    snapshot.docs.forEach(doc => {
        books.push({...doc.data(), id: doc.id})
    })
    console.log(books);
})

// event listener for adding and deleting books
const addBooks = document.querySelector('.add');
addBooks.addEventListener('submit', (e) => {
e.preventDefault();
addDoc(colRef, {
    title : addBooks.title.value,
    author : addBooks.author.value,
    createdAt : serverTimestamp()
}).then (() => {
    addBooks.reset();
})

})
const delBooks = document.querySelector('.delete');
delBooks.addEventListener('submit', (e) => {
e.preventDefault();
const docRef = doc(db,'books',delBooks.id.value);
deleteDoc(docRef)
    .then(() => {
        delBooks.reset();
    })
})

// get single doc
const docRef = doc(db, 'books', 'vSF0AN2MqBdAqdzopj1V')
const singleData = onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id);
})

const updateForm = document.querySelector('.update');
updateForm.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const docRef = doc(db,'books',updateForm.id.value);
    updateDoc(docRef, {
        title : 'updated title',
    }).then(() => {
        updateForm.reset();
    })
})

const signup = document.querySelector('.signup');
signup.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signup.email.value;
    const password = signup.password.value;

    createUserWithEmailAndPassword(auth,email,password)
        .then(cred => {
            console.log(`user created`, cred.user);
            signup.reset();
        })
        .catch(err => {console.log(err);})
})

const logout = document.querySelector('.logout');
logout.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            console.log(`the user has signed out`);
        })
        .catch(err => console.log(err.message))
})

const login = document.querySelector('.login');
login.addEventListener('submit', (e) => {
e.preventDefault();
const email = login.email.value;
const password = login.password.value;
signInWithEmailAndPassword(auth,email,password)
    .then(cred => {
        console.log('the user logged in', cred.user);
    })
    .catch(err => {console.log(err)});
})

const stateChange = onAuthStateChanged(auth, user => {
    console.log('user : ', user);
})

const unsub = document.querySelector('.unsub');
unsub.addEventListener('click', (e) => {
    console.log('unsubscribing...');
    realData()
    singleData()
    stateChange()
})