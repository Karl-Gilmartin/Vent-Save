const firebaseConfig = {
    apiKey: "AIzaSyBcLQrxaYSQnhW9o1BQwlMQhb-HPmHYqsI",
    authDomain: "test2-14b94.firebaseapp.com",
    databaseURL: "https://test2-14b94-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "test2-14b94",
    storageBucket: "test2-14b94.appspot.com",
    messagingSenderId: "115024558142",
    appId: "1:115024558142:web:61a78e4c6a34f250cd796f"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  const auth = firebase.auth();
  
  
      auth.onAuthStateChanged(function(user){
      if(user){
        Swal.fire(
            'Redirecting',
            'This may take a moment',
            'success'
          )
        setTimeout(() => {
          window.location.href = "lukes_cc_room_16.html";},2000);
          
      }
      else{
        //   alert("not signed in ")
      }
  })
  
  function  signIn(){
    //   alert("login active")
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  var email = document.getElementById("username_field").value;
  var password  = document.getElementById("password_field").value;
  if(email.match(mailformat))
{

}
else
{
    Swal.fire(
        'You have entered an invalid email address!',
        'Please try again',
        'warning'
    )
}
  

  auth.signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
        Swal.fire(
        'Error: ',
        errorMessage,
        'error'
        )
  
      // ...
    });
}
  
