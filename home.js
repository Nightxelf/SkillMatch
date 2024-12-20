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
  
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const skillsList = document.getElementById("skills-list");
  
  function displayProfiles(profiles) {
    skillsList.innerHTML = ""; 
    if (profiles.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No profiles found for this skill.";
      skillsList.appendChild(li);
      return;
    }
    profiles.forEach((profile) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <h3>${profile.fullName}</h3>
        <p><strong>Skills:</strong> ${profile.skills.join(", ")}</p>
        <p><strong>Email:</strong> ${profile.email}</p>
        <p><strong>Phone:</strong> ${profile.phone}</p>
      `;
      skillsList.appendChild(li);
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
  