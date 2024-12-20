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
            const userId = userCredential.user.uid;

            firestore.collection('users').doc(userId).get()
                .then((doc) => {
                    if (doc.exists) {
                        // Redirect to home if the profile exists
                        window.location.href = 'home.html';
                    } else {
                        // Redirect to profile creation if no profile exists
                        window.location.href = 'profile.html';
                    }
                })
                .catch((error) => {
                    console.error("Error fetching profile:", error);
                });
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
            const userId = userCredential.user.uid;
            window.location.href = 'profile.html';
        })
        .catch((error) => {
            alert(error.message);
        });
});

auth.onAuthStateChanged((user) => {
    if (user && window.location.pathname.includes('index.html')) {
        firestore.collection('users').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    window.location.href = 'home.html';
                } else {
                    window.location.href = 'home.html';
                }
            });
    }
});
