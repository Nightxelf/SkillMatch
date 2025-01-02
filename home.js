const firebaseConfig = {
  apiKey: "AIzaSyC696N7bKlgK71fvFT1wWEspqQ6qwVbggM",
  authDomain: "skillmatch-bc4d8.firebaseapp.com",
  projectId: "skillmatch-bc4d8",
  storageBucket: "skillmatch-bc4d8.firebasestorage.app",
  messagingSenderId: "449976959952",
  appId: "1:449976959952:web:c8b6c59a2a1343073aefd5",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const skillsList = document.getElementById("skills-list");
const profileDetails = document.getElementById("profile-details");

function displayProfiles(profiles) {
  skillsList.innerHTML = ""; // Clear previous results
  if (profiles.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No profiles found for this skill.";
    skillsList.appendChild(li);
    return;
  }

  profiles.forEach((profile) => {
    const li = document.createElement("li");
    li.className = "profile-item";

    li.innerHTML = `
      <div class="profile-summary" data-id="${profile.id}">
        <img src="${profile.profilePic || 'images/default-profile.png'}" alt="${profile.fullName}'s Picture" class="profile-pic" />
        <div class="profile-info">
          <h3>${profile.fullName}</h3>
          <p><strong>Skills:</strong> ${profile.skills.join(", ")}</p>
        </div>
      </div>
    `;

    // Add click event to open full profile
    li.querySelector(".profile-summary").addEventListener("click", () => {
      showFullProfile(profile);
    });

    skillsList.appendChild(li);
  });
}

// Function to show full profile details
function showFullProfile(profile) {
  profileDetails.innerHTML = `
    <h2>${profile.fullName}</h2>
    <img src="${profile.profilePic || 'images/profile.png'}" alt="${profile.fullName}'s Picture" class="profile-pic-large" />
    <p><strong>Skills:</strong> ${profile.skills.join(", ")}</p>
    <p><strong>Email:</strong> ${profile.email}</p>
    <p><strong>Phone:</strong> ${profile.phone}</p>
    <button id="close-profile-btn" class="close-btn">Close</button>
  `;

  profileDetails.style.display = "block";

  
  document.getElementById("close-profile-btn").addEventListener("click", () => {
    profileDetails.style.display = "none"; 
  });
}

// Search Profiles
function searchProfiles() {
  const searchQuery = searchInput.value.trim().toLowerCase();
  db.collection("profiles")
    .get()
    .then((querySnapshot) => {
      const filteredProfiles = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id; 
        if (data.skills.some((skill) => skill.toLowerCase().includes(searchQuery))) {
          filteredProfiles.push(data);
        }
      });
      displayProfiles(filteredProfiles);
    })
    .catch((error) => {
      console.error("Error fetching profiles:", error);
    });
}

searchBtn.addEventListener("click", searchProfiles);
