const firebaseConfig = {
    apiKey: "AIzaSyC696N7bKlgK71fvFT1wWEspqQ6qwVbggM",
    authDomain: "skillmatch-bc4d8.firebaseapp.com",
    projectId: "skillmatch-bc4d8",
    storageBucket: "skillmatch-bc4d8.firebasestorage.app",
    messagingSenderId: "449976959952",
    appId: "1:449976959952:web:c8b6c59a2a1343073aefd5"
  };

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Elements
const profileImageInput = document.getElementById("profile-image");
const profilePreview = document.getElementById("profile-preview");
const skillInput = document.getElementById("skill-input");
const skillsList = document.getElementById("skills-list");
const addSkillBtn = document.getElementById("add-skill");
const saveProfileBtn = document.getElementById("save-profile");
const fullNameInput = document.getElementById("full-name");
const ExperienceInput = document.getElementById("Experience"); 
const availabilityInput = document.getElementById("availability");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const logoutBtn = document.getElementById("logout-btn");


let skills = [];
let profileImageURL = "";

//Profile Image Upload
profileImageInput.addEventListener("change", function () {
    const file = profileImageInput.files[0];
    if (file) {
        const storageRef = storage.ref("profilePictures/" + file.name);
        const uploadTask = storageRef.put(file);

        uploadTask.on(
            "state_changed",
            function (snapshot) {
                
            },
            function (error) {
                console.error("Upload failed:", error);
            },
            function () {
               
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    profileImageURL = downloadURL;
                    profilePreview.src = downloadURL; // Show uploaded image
                });
            }
        );
    }
});


addSkillBtn.addEventListener("click", function () {
    const skill = skillInput.value.trim();
    if (skill && !skills.includes(skill)) {
        skills.push(skill);
        updateSkillsList();
        skillInput.value = ""; 
    }
});

// Update Skills List UI
function updateSkillsList() {
    skillsList.innerHTML = "";
    skills.forEach((skill, index) => {
        const li = document.createElement("li");
        li.textContent = skill;
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", function () {
            skills.splice(index, 1);
            updateSkillsList();
        });
        li.appendChild(removeBtn);
        skillsList.appendChild(li);
    });
}


saveProfileBtn.addEventListener("click", function (event) {
    event.preventDefault();

    const fullName = fullNameInput.value.trim();
    const Experience = ExperienceInput.value.trim(); 
    const availability = availabilityInput.checked;
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    
    if (!fullName || !email) {
        alert("Full Name and Email are required.");
        return;
    }

    // Get current user ID
    const userId = firebase.auth().currentUser ? firebase.auth().currentUser.uid : null;
    if (!userId) {
        alert("User is not logged in.");
        return;
    }

   
    const userProfile = {
        fullName,
        Experience, 
        skills,
        availability,
        email,
        phone,
        profileImageURL,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    db.collection("profiles").doc(userId).set(userProfile)
        .then(() => {
            alert("Profile saved successfully!");
        })
        .catch((error) => {
            console.error("Error saving profile:", error);
            alert("Error saving profile.");
        });
});


logoutBtn.addEventListener("click", function () {
    firebase.auth().signOut().then(() => {
        window.location.href = "index.html"; 
    }).catch((error) => {
        console.error("Logout error:", error);
    });
});

    
  

