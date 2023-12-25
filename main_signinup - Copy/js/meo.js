
// Initialize variables
const db = firebase.firestore();
const storage = firebase.storage();
const storageRef = storage.ref('images');

flatpickr("#birthday")

// Set up our register function
function register () {
    // Get all our input fields
    email = document.getElementById('email').value;
    console.log('Email:', email);

    confirmpassword = document.getElementById('confirmpassword').value;
    console.log('Confirm Password:', confirmpassword);

    password = document.getElementById('password').value;
    console.log('Password:', password);

    birthday = document.getElementById('birthday').value;
    console.log('Birthday:', birthday);

    full_name = document.getElementById('full_name').value;
    console.log('Full Name:', full_name);

    gender = document.getElementById('gender').value;
    console.log('Gender:', gender);

    position = document.getElementById('position').value;
    console.log('Position:', position);

    route_trainning = document.getElementById('route_trainning').value;
    console.log('Route Training:', route_trainning);

    career_path = document.getElementById('career_path').value;
    console.log('Career Path:', career_path);

    let specialization = document.querySelectorAll('input[name="specialization"]:checked');
    let selectedSpecialization = [];
    for (let i = 0; i < specialization.length; i++) {
        selectedSpecialization.push(specialization[i].value);
    }
    console.log("Specialization:", selectedSpecialization);
    
    let method = document.querySelectorAll('input[name="method"]:checked');
    let selectedMethod = [];
    for (let i = 0; i < method.length; i++) {
        selectedMethod.push(method[i].value);
    }
    console.log("Method:", selectedMethod);

    let gender_customer = document.querySelectorAll('input[name="gender_customer"]:checked');
    let selectedgender_customer = [];
    for (let i = 0; i < gender_customer.length; i++) {
      selectedMethod.push(gender_customer[i].value);
  }
    console.log('Gender Customer:', selectedgender_customer);

    age_customer = document.getElementById('age_customer').value;
    console.log('Age Customer:', age_customer);

    
    if (password !== confirmpassword) {
      alert('Xác nhận mật khẩu mới chưa đúng');
      return;                         }

    if (validate_email(email) == false ) {
      alert('Nhập đúng định dạng email')
      return    }
      if (validate_password(password) == false  || validate_password(confirmpassword) == false) {
        alert('Vui lòng nhập mật khẩu nhiều hơn 6 ký tự')
        return    }
        
    if (validate_field(gender_customer) == false || validate_field(age_customer) == false || validate_field(route_trainning) == false || validate_field(career_path) == false || validate_field(method) == false ||validate_field(full_name) == false || validate_field(gender) == false || validate_field(position) == false) {
      alert('Vui lòng nhập các thông tin còn thiếu')
      return   }
  
  // Move on with Auth
  auth.createUserWithEmailAndPassword(email, password)
  .then(function() {
      // Declare user variable
      var expert = auth.currentExpert
      var file = document.getElementById('profile_picture').files[0];
    
      // If no file is selected, use a default image
      if (!file) {
        file = '3177440.png'; // Replace this with the path to your default image
      }
      
      // Create a canvas and initialize Cropper.js
      var canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400;
      var context = canvas.getContext('2d');
      var img = new Image();
      img.onload = function() {
        context.drawImage(img, 0, 0, 400, 400);
        canvas.toBlob(function(blob) {
          // Create the file metadata
          var metadata = {
            contentType: 'image/jpeg'
          };
    
          // Upload file and metadata to the object 'images/mountains.jpg'
          var uploadTask = storageRef.child('profile_pictures/' + user.uid + '.jpg').put(blob, metadata);
    
          // Listen for state changes, errors, and completion of the upload.
          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function(snapshot) {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
            }, 
            function(error) {
              // Handle unsuccessful uploads
            }, 
            function() {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                console.log('File available at', downloadURL);
  
              // Add this user to Firebase Database
              var database_ref = firebase.firestore();
  
              // Create Expert data
              var expert_data = {
                email : email,
                full_name : full_name,
                gender : gender,
                birthday : birthday,
                position : position,
                route_trainning : route_trainning,
                career_path : career_path,
                method : method,
                gender_customer : gender_customer,
                age_customer : age_customer,
                last_login : Date.now(),
                profile_picture : downloadURL  // Add the download URL of the image to the user data
              };
  
              // Push to Firebase Database
              database_ref.collection('experts').doc(expert.uid).set(expert_data)
  
              // Done
              alert('User Created!!');
            });
          });
      }, 'image/jpeg');
    };
    img.src = URL.createObjectURL(file);
  })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code
      var error_message = error.message
  
      alert(error_message)
    })
  }
  
  // Validate Functions
  function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email) == true) {
      // Email is good
      return true
    } else {
      // Email is not good
      return false
    }
  }
  
  function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    if (password < 6) {
      return false
    } else {
      return true
    }
  }
  
  function validate_field(field) {
    if (field == null) {
      return false
    }
  
    if (field.length <= 0) {
      return false
    } else {
      return true
    }
  }
  