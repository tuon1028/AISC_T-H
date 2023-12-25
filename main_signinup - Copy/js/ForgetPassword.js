var back = () => {
    window.location.assign("./loginpage.html");
  };
  
  let email = document.getElementById("email");
  let message = document.getElementById("message");
  let reset = () => {
    if(email.value === ""){
      message.innerHTML = "Email Address Required!"
      message.style.color = "red"
      email.focus()
    }
    firebase.auth().sendPasswordResetEmail(email.value)
    .then((res) => {
      // res.sendEmailVerification();
      message.innerHTML = "Yêu cầu đặt lại mật khẩu đã được gửi!"
      message.style.color = "green"
      setTimeout(() => {
        window.location.assign("./email.html");
      }, 4000);
    })
    .catch((error) => {
      var errorMessage = error.message;
      message.innerHTML = errorMessage
      message.style.color = "red"
    });
  }
  
//   let home = () => {
//     window.location.reload();
//   };
  