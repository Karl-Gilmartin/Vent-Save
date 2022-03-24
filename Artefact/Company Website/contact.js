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
// alert("Initialised Firebase")

function saveData() {
// alert('trying to send data')
  var nameVar =document.getElementById('nameInput').value;
  var emailVar = document.getElementById('emailInput').value;
  var msgVar = document.getElementById('messageInput').value;
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if(emailVar.match(mailformat))
{
    var myDB = firebase.database().ref('Form');
    // alert("node created");
      // Creates a patient node
      var addRecord = myDB.child('Messages').push();
      record = {
        'Name' : nameVar,
        'Email' : emailVar,
        'Message': msgVar
      }
      addRecord.set(record);
    
      document.getElementById('nameInput').value = "";
      document.getElementById('emailInput').value = "";
      document.getElementById('messageInput').value = "";
    
      Swal.fire(
        'Your form has been fowered to Vent & Save',
        'It may take a few days for a response',
        'success'
      )
}
else {
    Swal.fire(
        'You have entered an invalid email address!',
        'Please try again',
        'warning'
    )
}

  // Creates a node
  
}



var firstname = document.getElementById("first_name").value;
var secondname = document.getElementById("second_name").value;
var addRecord = myDB.child("contact_form").push();
record = {
    "firstname" : firstname,
    "secondname": secondname
}
addRecord.set(record);
alert("data added")

function sendData(){
  firebase.database().ref("/First_Name").sendData({
    
  })
  alert("name sent");
}

