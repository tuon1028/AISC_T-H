// Initialize variables
const auth = firebase.auth()
const database = firebase.database()
const storage = firebase.storage()
const storageRef = storage.ref('images')
// Get current user
const expert = auth.currentExpert;

firebase.auth().onAuthStateChanged((expert) => {
  if (expert) {
    // User is signed in, so we can get their data
    database.ref('/experts/' + expert.uid).once('value').then((snapshot) => {
      let userData = snapshot.val();
      // Get HTML elements
      let fullNameElements1 = document.getElementsByClassName('hin-ng4');
      let fullNameElements2 = document.getElementsByClassName('hin-ng2');
      let fullNameElements3 = document.getElementsByClassName('hin-ng3');

      // Update HTML elements with user data
      for (let elem of fullNameElements1) {
        elem.innerText = userData.full_name;
      }
      for (let elem of fullNameElements2) {
        elem.innerText = userData.full_name;
      }
      for (let elem of fullNameElements3) {
        elem.innerText = userData.full_name;
      }
      // Get HTML elements
      let genderElements1 = document.getElementsByClassName('nam');
      let genderElements2 = document.getElementsByClassName('nam1');


      // Update HTML elements with user data
      for (let elem of genderElements1) {
        elem.innerText = userData.gender;
      }
      for (let elem of genderElements2) {
        elem.innerText = userData.gender;
      }
      
      // Get HTML elements
      let birthdayElements1 = document.getElementsByClassName('div');
      let birthdayElements2 = document.getElementsByClassName('div1');


      // Update HTML elements with user data
      for (let elem of birthdayElements1) {
        elem.innerText = userData.birthday;
      }
      for (let elem of birthdayElements2) {
        elem.innerText = userData.birthday;
      }
      // Get HTML elements
      let positionElements1 = document.getElementsByClassName('tp-hcm');
      let positionElements2 = document.getElementsByClassName('tp-hcm1');


      // Update HTML elements with user data
      for (let elem of positionElements1) {
        elem.innerText = userData.position;
      }
      for (let elem of positionElements2) {
        elem.innerText = userData.position;
      }
      
      // Get HTML elements
      let emailElements1 = document.getElementsByClassName('hiengmailcom1');
      let emailElements2 = document.getElementsByClassName('hiengmailcom');


      // Update HTML elements with user data
      for (let elem of emailElements1) {
        elem.innerText = userData.email;
      }
      for (let elem of emailElements2) {
        elem.innerText = userData.email;
      }

      // Get the 'specialization' object from the user data
        let specializationData = userData.specialization;

        // Get the existing HTML element where you want to display the IDs
        let existingElement = document.getElementById('specialization'); // replace 'yourExistingElementId' with the actual ID

        // Initialize an array to store the IDs
        let trueFieldIds = [];

        // Loop through the fields in the 'specialization' object
        for (let field in specializationData) {
          // If the field's value is true, add the field's ID to the array
          if (specializationData[field] === true) {
            trueFieldIds.push(field);
          }
        }

      // Update the existing HTML element with the IDs
        existingElement.innerText = trueFieldIds.join(', '); // This will display the IDs separated by commas


      // Get HTML elements
      let route_trainningElement = document.getElementById('route_trainning');
      let career_pathElement = document.getElementById('career_path');



      // Get the URL of the profile picture from the user data
      let profilePictureUrl = userData.profile_picture;

      // Get the HTML elements where you want to display the profile picture
      let profilePictureElement1 = document.getElementById('buttonsettings'); // replace with the actual ID
      let profilePictureElement2 = document.getElementById('profile_picture'); // replace with the actual ID
      let profilePictureElement3 = document.getElementById('profile-child'); // replace with the actual ID
      // ... add more as needed

      // Update the 'src' attribute of the HTML elements with the profile picture URL
      profilePictureElement1.src = profilePictureUrl;
      profilePictureElement2.src = profilePictureUrl;
      profilePictureElement3.src = profilePictureUrl;
      // ... add more as needed

      // Update HTML elements with user data
      route_trainningElement.innerText = userData.route_trainning;
      career_pathElement.innerText = userData.career_path;
  
  
    }).catch((error) => {
      console.error(error);
});
  } else {
    // No user is signed in.
    console.log('No user is signed in');
  }
});

let titleInput = document.querySelector('.frame-child5');
let contentInput = document.querySelector('.frame-child6');
let currentExpert = "";
let url = "";
let fileType = "";
let uid;
let alluser = [];


firebase.auth().onAuthStateChanged((expert) => {
  currentExpert = expert;
});

function uploadimg(event) {
  fileType = event.target.files[0].type;
  var uploadfile = firebase
    .storage()
    .ref()
    .child(`postFiles/${event.target.files[0].name}`)
    .put(event.target.files[0]);
  uploadfile.on(
    "state_changed",
    (snapshot) => {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      var uploadpercentage = Math.round(progress);
      console.log(uploadpercentage);
      document.getElementById('progressdiv').style.display = 'block';
      document.getElementById('progressbar').style.width = uploadpercentage + '%';
      document.getElementById('progressbar').setAttribute('aria-valuenow', uploadpercentage);
    },
    (error) => { },
    () => {
      uploadfile.snapshot.ref.getDownloadURL().then((downloadURL) => {
        url = downloadURL;
        document.getElementById('progressdiv').style.display = 'none';
      });
    }
  );
}



var d = new Date().toLocaleDateString();

function createpost() {
  if (currentExpert && (titleInput.value !== "" || contentInput.value !== "" || url !== "")) {
    firebase
      .firestore()
      .collection("posts")
      .add({
        title: titleInput.value,
        content: contentInput.value,
        uid: currentExpert.uid,
        url: url,
        filetype: fileType,
        like: [],
        dislikes: [],
        comments: [],
        Date: `${d}`
      })
      .then((res) => {
        firebase
          .firestore()
          .collection("posts/")
          .doc(res.id)
          .update({
            id: res.id
          })
          .then(() => {
            console.log("Post created successfully!");
            // Reset the input fields
            titleInput.value = "";
            contentInput.value = "";
            url = "";
          });
      });
  }
}

