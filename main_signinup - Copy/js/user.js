// Initialize variables
const auth = firebase.auth()
const database = firebase.database()
const storage = firebase.storage()
const storageRef = storage.ref('images')
// Get current user
const user = auth.currentUser;

firebase.auth().onAuthStateChanged((user) => {
  
if (user) {
  // User is signed in, so we can get their data
  database.ref('/users/' + user.uid).once('value').then((snapshot) => {
    let userData = snapshot.val();

    // Get HTML elements
    let fullNameElement = document.getElementById('full_name');
    let genderElement = document.getElementById('gender');
    let birthdayElement = document.getElementById('birthday');
    let positionElement = document.getElementById('position');
    let profilePictureElement = document.getElementById('profile_picture')
    // Update HTML elements with user data
    fullNameElement.innerText = userData.full_name;
    genderElement.innerText = userData.gender;
    birthdayElement.innerText = userData.birthday;
    positionElement.innerText = userData.position;
    profilePictureElement.src = userData.profile_picture;
  });
} else {
  // No user is signed in.
  console.log('No user is signed in');
}
});

document.getElementById('logout').addEventListener('click', function() {
  auth.signOut().then(() => {
      console.log('User signed out');
      window.location.href = "index.html"; // Redirect the user to the index.html page
  });
});
document.getElementById('edit_profile').addEventListener('click', function() {
    window.location.href = 'edit_userinfo.html';
});

