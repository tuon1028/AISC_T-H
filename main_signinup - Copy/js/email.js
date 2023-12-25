let email = document.getElementById("emailid");
let message = document.getElementById("message");

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log(user);
    if (user.emailVerified) {
      window.location.assign("/html/user.html");
    } else {
      email.innerHTML = user.email;
    }
  } else {
    window.location.assign("/html/login.html");
  }
});

let resend = () => {
  let user = firebase.auth().currentUser;
  if (user) {
    user.sendEmailVerification()
      .then(() => {
        message.innerHTML = "A verification link has been sent to your email account";
        message.style.color = "green";
        message.style.marginBottom = "15px";
      })
      .catch((error) => {
        console.error(error);
      });
  }
};

let reloud = () => {
  location.reload();
};

