{/* <script src="https://unpkg.com/boxicons@2.1.1/dist/boxicons.js"></script> */}
let btn = document.querySelector("#menu_btn");
let sidebar = document.querySelector(".sidebar");
// alert("JavaScript is working")

btn.onclick = function(){
    sidebar.classList.toggle("active")
    sidebar.reset()
    // setTimeout(hideElement,2000)
}


let myInput = document.getElementById("password_field");
var username = document.getElementById("username_field");
// alert("JavaScript  is Working");



function getData() {
    // alert(myInput);
    var passw = /Pass1234/;

    var userN = "JoeSmith";

    if (myInput.value.match(passw) && username.value.match(userN)) {
      // worked with "" also worked with == "JoeSmith"

      alert("You have successfully logged in"); //alerts pops up when you have logged in

      location.replace("bunratty_cc_room_16.html"); // takes you to profile page after successful login
    } else {
      // if login failed alert 'incorrect please try again'
      alert("Incorrect, please try again");
    }

    document.getElementById("username_field").value = "";

    document.getElementById("password_field").value = "";
  }

function hideElement(){
    sidebar.active.classList.toggle("sidebar")
}

var slideIndex = 0;
showSlides();
function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides fade");
  for(i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if(slideIndex > slides.length) {
    slideIndex = 1
  }
  slides[slideIndex - 1].style.display = "block";
  setTimeout(showSlides, 5000); // Change image every 2 seconds
}


const firebaseConfig = {
    apiKey: "AIzaSyBcLQrxaYSQnhW9o1BQwlMQhb-HPmHYqsI",
    authDomain: "test2-14b94.firebaseapp.com",
    databaseURL: "https://test2-14b94-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "test2-14b94",
    storageBucket: "test2-14b94.appspot.com",
    messagingSenderId: "115024558142",
    appId: "1:115024558142:web:61a78e4c6a34f250cd796f"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  // var myDB = firebase.database().ref("Class");
  alert("Initialised Firebase")
  
  function saveData() {
  alert('trying to send data')
    var nameVar =document.getElementById('nameInput').value;
    var emailVar = document.getElementById('emailInput').value;
    var msgVar = document.getElementById('messageInput').value;
  
    // Creates a node
    var myDB = firebase.database().ref('Class');
  alert("node created");
    // Creates a patient node
    var addRecord = myDB.child('students').push();
    record = {
      'Name' : nameVar,
      'Email'       : emailVar,
      'Message': msgVar
    }
    addRecord.set(record);
  
    document.getElementById('nameInput').value = "";
    document.getElementById('emailInput').value = "";
    document.getElementById('messageInput').value = "";
  
    alert('Data added');
  }

