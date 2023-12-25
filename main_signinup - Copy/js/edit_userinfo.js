// Initialize variables
  const database = firebase.database()
  const auth = firebase.auth
  const user = auth.currentUser;
  
  flatpickr("#birthday")
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, call revert
      revert();
    } else {
      // No user is signed in.
      console.log('User is not logged in');
    }
  });

  function changePassword() {
    let currentPassword = document.getElementById('current_password').value;
    let newPassword = document.getElementById('new_password').value;
    let confirmPassword = document.getElementById('confirm_password').value;
    let user = firebase.auth().currentUser;
    let credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);

    // Check if new password and confirm password are the same
    if (newPassword !== confirmPassword) {
        alert('Xác nhận mật khẩu mới chưa đúng');
        return;
    }

    // Re-authenticate the user
    user.reauthenticateWithCredential(credential).then(() => {
        // User re-authenticated, now we can change the password
        user.updatePassword(newPassword).then(() => {
            alert('Thay đổi mật khẩu thành công');
        }).catch((error) => {
            console.log(error);
        });
    }).catch((error) => {
        console.log('Mật khẩu hiện tại không chính xác');
    });
  }


  function save() {
    // Get HTML elements
    let fullNameElement = document.getElementById('full_name');
    let genderElement = document.getElementById('gender');
    let birthdayElement = document.getElementById('birthday');
    let positionElement = document.getElementById('position');
  
    // Get user input
    let fullName = fullNameElement.value;
    let gender = genderElement.value;
    let birthday = birthdayElement.value;
    let position = positionElement.value;
  
    // Get current user
    let user = firebase.auth().currentUser;
  
    // Update user data in the database
    firebase.database().ref('users/' + user.uid).set({
      full_name: fullName,
      gender: gender,
      birthday: birthday,
      position: position,
      email: user.email // Add this line
    }).then(() => {
      alert('Bạn đã cập nhật thành công');
  }).catch((error) => {
      console.log(error);
  });
}
  
  function revert() 
  {
    // Get current user
    let user = firebase.auth().currentUser;
  
    // Check if user is logged in
    if (user) {
      // Get user data from the database
      database.ref('/users/' + user.uid).once('value').then((snapshot)  => {
        let userData = snapshot.val();
    
        // Get HTML elements
        let fullNameElement = document.getElementById('full_name');
        let genderElement = document.getElementById('gender');
        let birthdayElement = document.getElementById('birthday');
        let positionElement = document.getElementById('position');
        let emailElement = document.getElementById('email'); // Add this line
    
        // Update HTML elements with user data
        fullNameElement.value = userData.full_name;
        genderElement.value = userData.gender;
        birthdayElement.value = userData.birthday;
        positionElement.value = userData.position;
        emailElement.value = user.email; // Add this line
      });
    } else {
      // User is not logged in
      console.log('User is not logged in');
    }
  }
  
  // Call revert function immediately after defining it
  revert();
  
  // Your existing code...
  
  // Add this event listener at the end of your script
  document.addEventListener('DOMContentLoaded', (event) => {
    revert();
  });
