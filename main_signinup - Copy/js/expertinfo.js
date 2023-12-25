// Initialize variables
  var db = firebase.firestore();
  var storage = firebase.storage();
  var storageRef = storage.ref();
  // Get the register button
function register() {
    // Get form values
 
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var confirmpassword = document.getElementById('confirmpassword').value;
    var fullName = document.getElementById('full_name').value;
    var gender = document.getElementById('gender').value;
    var religious = document.getElementById('religious').value;
    var birthday = document.getElementById('birthday').value;
    var position = document.getElementById('position').value;
    var profilePicture = document.getElementById('profile_picture').files[0]; // This is a File object
    var route_trainning = document.getElementById('route_trainning').value;
    var career_path = document.getElementById('career_path').value;
    var specialization = {
        couple: document.getElementById('couple').checked,
        marriage_family: document.getElementById('marriage_family').checked,
        children_teens: document.getElementById('children_teens').checked,
        school_issues: document.getElementById('school_issues').checked,
        addiction: document.getElementById('addiction').checked,
        divorce: document.getElementById('divorce').checked,
        eating_disorder: document.getElementById('eating_disorder').checked,
        pstd: document.getElementById('pstd').checked,
        org_trainning: document.getElementById('org_training').checked,
        psych_eval: document.getElementById('psych_eval').checked,
        depression: document.getElementById('depression').checked,
      };
    var method = {
        cognitive_therapy: document.getElementById('cognitive_therapy').checked,
        behavioral_therapy: document.getElementById('behavioral_therapy').checked,
        cbt: document.getElementById('cbt').checked,
        dbt: document.getElementById('dbt').checked,
        act: document.getElementById('act').checked,
        contact_therapy: document.getElementById('contact_therapy').checked,
        human_centered: document.getElementById('human_centered').checked,
      };
    var gender_customer = {
        male: document.getElementById('male').checked,
        female: document.getElementById('female').checked,
        other: document.getElementById('other').checked,
      };
    var age_customer = document.getElementById('age_customer').value;
  
    var formData = {
        email: email,
        password: password,
        fullName: fullName,
        gender: gender,
        religious: religious,
        position: position,
        birthday: birthday,
        route_trainning: route_trainning,
        career_path: career_path,
        specialization: specialization,
        method: method,
        gender_customer: gender_customer,
        age_customer: age_customer,
        profile_picture: profile_picture,
      };
    
    // Validate form data
    checkIfEmailExists(formData.email).then(function(emailExists) {
        if (emailExists) {
            alert("Email đã được sử dụng. Vui lòng chọn một email khác.");
        } else {
            // Code to create new account goes here
    if (password !== confirmpassword) {
        alert('Xác nhận mật khẩu mới chưa đúng');
        return;
    }
    if (!validate_email(email)) {
        alert('Nhập đúng định dạng email');
        return;
    }
    if (!validate_password(password) || !validate_password(confirmpassword)) {
        alert('Vui lòng nhập mật khẩu nhiều hơn 6 ký tự');
        return;
    }
    if (!validate_field(gender_customer) || !validate_field(age_customer) || !validate_field(route_trainning) || !validate_field(career_path) || !validate_field(method) || !validate_field(fullName) || !validate_field(gender)) {
        alert('Vui lòng nhập các thông tin còn thiếu');
        return;
    }
    function dataURItoBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], {type: mimeString});
        }

    function resizeImage(file, maxWidth, maxHeight, callback) {
        var img = new Image();
        img.onload = function() {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
    
            var width = img.width;
            var height = img.height;
    
            // calculate the width and height, constraining the proportions
            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round(height * maxWidth / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round(width * maxHeight / height);
                    height = maxHeight;
                }
            }
    
            canvas.width = width;
            canvas.height = height;
    
            // draw the image
            ctx.drawImage(img, 0, 0, width, height);
    
            // call the callback with the data
            callback(canvas.toDataURL());
        };
        img.src = URL.createObjectURL(file);
    } // This closes the resizeImage function
    
    // usage
    var file = document.getElementById('profile_picture').files[0];
    resizeImage(file, 400, 400, function(dataUrl) {
        // 'dataUrl' is the resized image as a data URL
        // you can set it as the src of an img element, upload it, etc.
    
        var profilePictureRef = storageRef.child('expert_image/' + formData.email + '.jpg');
    
        // Convert the Data URL to a Blob which can be uploaded to Firebase
        var blob = dataURItoBlob(dataUrl);
    
        // Upload the file to Firebase Storage
        var uploadTask = profilePictureRef.put(blob);
    
        uploadTask.on('state_changed', function(snapshot) {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }, function(error) {
            // Handle unsuccessful uploads
            console.log('Upload failed:', error);
        }, function() {
            // Handle successful uploads on complete
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                console.log('File available at', downloadURL);
            
                // Add the URL to the form data
                formData.profile_picture = downloadURL;
            
                // Save the data to Firestore
                db.collection("expert_register").add(formData)
                .then(function(docRef) {
                    console.log("Document written with ID: ", docRef.id);
                    alert("Thông tin của bạn đã được ghi nhận!");
                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                });
            });
            
        });
    });
}
});
}


    
  // Validate Functions
  function validate_email(email) {
      expression = /^[^@]+@\w+(\.\w+)+\w$/
      if (expression.test(email) == true) {
          // Email is good
          return true;
      } else {
          // Email is not good
          return false;
      }
  }
  
  function validate_password(password) {
      // Firebase only accepts lengths greater than 6
      if (password < 6) {
          return false;
      } else {
          return true;
      }
  }
  
  function validate_field(field) {
      if (field == null) {
          return false;
      }
  
      if (field.length <= 0) {
          return false;
      } else {
          return true; 
      } 
   }
   function checkIfEmailExists(email) {
    return db.collection('expert_register').where('email', '==', email).get()
    .then(snapshot => !snapshot.empty);
}


