const firebaseConfig = {
    apiKey: "AIzaSyC696N7bKlgK71fvFT1wWEspqQ6qwVbggM",
    authDomain: "skillmatch-bc4d8.firebaseapp.com",
    projectId: "skillmatch-bc4d8",
    storageBucket: "skillmatch-bc4d8.firebasestorage.app",
    messagingSenderId: "449976959952",
    appId: "1:449976959952:web:c8b6c59a2a1343073aefd5"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const signupLink = document.getElementById('signup-link');
const loginLink = document.getElementById('login-link');

// Login and Signup Forms 
signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
});

loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Login 
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            
            window.location.href = 'home.html';
        })
        .catch((error) => {
            alert(error.message);
        });
});

// Signup 
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            return firestore.collection('users').doc(userCredential.user.uid).set({
                name: name,
                email: email,
                skills: [],
                availability: false
            });
        })
        .then(() => {
            alert("Signup successful! Please log in.");
            signupForm.reset(); 
            signupForm.style.display = 'none';
            loginForm.style.display = 'block'; 
        })
        .catch((error) => {
            alert(error.message);
        });
});

// Authentication State Observer
auth.onAuthStateChanged((user) => {
    if (user && window.location.pathname.includes('index.html')) {
       
    }
});

