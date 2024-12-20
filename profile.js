const firebaseConfig = {
    apiKey: "AIzaSyC696N7bKlgK71fvFT1wWEspqQ6qwVbggM",
    authDomain: "skillmatch-bc4d8.firebaseapp.com",
    projectId: "skillmatch-bc4d8",
    storageBucket: "skillmatch-bc4d8.appspot.com", 
    messagingSenderId: "449976959952",
    appId: "1:449976959952:web:c8b6c59a2a1343073aefd5"
  };
  
  
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const firestore = firebase.firestore();
  const storage = firebase.storage();
  
 
  const profileImageInput = document.getElementById("profile-image");
  const profilePreview = document.getElementById("profile-preview");
  const fullNameInput = document.getElementById("full-name");
  const ExperienceInput = document.getElementById("Experience");
  const skillInput = document.getElementById("skill-input");
  const skillsList = document.getElementById("skills-list");
  const addSkillBtn = document.getElementById("add-skill");
  const saveProfileBtn = document.getElementById("save-profile");
  const availabilityInput = document.getElementById("availability");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  
 
  let profileImageURL = "images/default-profile.png"; // Default profile image
  let skills = [];
  
  
  auth.onAuthStateChanged((user) => {
    if (user) {
      const userId = user.uid;
  
      firestore.collection('profiles').doc(userId).get()
        .then((doc) => {
          if (doc.exists) {
            const profile = doc.data();
  
            fullNameInput.value = profile.fullName || '';
            ExperienceInput.value = profile.Experience || '';
            emailInput.value = profile.email || '';
            phoneInput.value = profile.phone || '';
            availabilityInput.checked = profile.availability || false;
            skills = profile.skills || [];
            profileImageURL = profile.profileImageURL || "images/default-profile.png";
            profilePreview.src = profileImageURL;
            updateSkillsList();
          }
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    } else {
      window.location.href = "index.html";
    }
  });
  
   /*profileImageInput.addEventListener("change", (event) => {
    const file = profileImageInput.files[0];
  
    if (file) {
      const storageRef = storage.ref(`profilePicture`);
      const uploadTask = storageRef.put(file);
  
      uploadTask.on(
        "state_changed",
        null, // Optional progress callback
        (error) => {
          console.error("Image upload failed:", error);
        },
        () => {
          // Get the uploaded image URL
          uploadTask.snapshot.ref.getDownloadURL()
            .then((url) => {
              profileImageURL = url;
              profilePreview.src = profileImageURL; // Update preview
            })
            .catch((error) => {
              console.error("Error getting image URL:", error);
            });
        }
      );
    }
  });*/
  
  
  addSkillBtn.addEventListener("click", () => {
    const skill = skillInput.value.trim();
  
    if (skill && !skills.includes(skill)) {
      skills.push(skill);
      updateSkillsList();
      skillInput.value = "";
    }
  });
  
  
  function updateSkillsList() {
    skillsList.innerHTML = ""; 
    skills.forEach((skill, index) => {
      const li = document.createElement("li");
      li.textContent = skill;
  
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => {
        skills.splice(index, 1);
        updateSkillsList();
      });
  
      li.appendChild(removeBtn);
      skillsList.appendChild(li);
    });
  }
  
  saveProfileBtn.addEventListener("click", (event) => {
    event.preventDefault();
  
    const userId = auth.currentUser.uid;
    const fullName = fullNameInput.value.trim();
    const Experience = ExperienceInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const availability = availabilityInput.checked;
  
    if (!fullName || !email) {
      alert("Full Name and Email are required.");
      return;
    }
  
    const userProfile = {
      fullName,
      Experience,
      email,
      phone,
      availability,
      skills,
      profileImageURL,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
  
    firestore.collection("profiles").doc(userId).set(userProfile, { merge: true })
      .then(() => {
        alert("Profile saved successfully!");
        window.location.href = "home.html"; 
      })
      .catch((error) => {
        console.error("Error saving profile:", error);
      });
  });
  