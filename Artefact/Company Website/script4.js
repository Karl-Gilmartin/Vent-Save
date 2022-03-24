// {/* <script src="https://unpkg.com/boxicons@2.1.1/dist/boxicons.js"></script> */}
// let btn = document.querySelector("#menu_btn");
// let sidebar = document.querySelector(".sidebar");
// // alert("JavaScript is working")

// btn.onclick = function(){
//     sidebar.classList.toggle("active")
//     sidebar.reset()
//     // setTimeout(hideElement,2000)
// }

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

// alert("Initialised Firebase")
const auth = firebase.auth();



function fanOn(){
  Swal.fire({
    title: 'Fan On',
    text: 'Fan will turn on shortly',
    imageUrl: '/Resources/Logo_black.png'
  });
setTimeout(() => {
  firebase.database().ref("/").set({
    Fan_Status:"On"
});},2000);
}

function fanOff(){
  Swal.fire({
    title: 'Fan has been disabeled',
    text: 'Fan will turn of soon',
    imageUrl: '/Resources/Logo_black.png'
  });
setTimeout(() => {
  firebase.database().ref("/").set({
    Fan_Status:"Off"
});},2000);}

function fanOverride(){
  Swal.fire({
    title: 'Override Activated',
    text: 'Auto mode will is dis-active',
    imageUrl: '/Resources/Logo_black.png'
  });
setTimeout(() => {
  firebase.database().ref("/").set({
    Fan_Status:"Override"
});},2000);
    


}

// function logOut(){
//   firebase.auth().signOut();
//   alert("redirecting")
//   window.location.href = "login_sample.html";
// }
function logOut(){
  // alert("logout active");
  firebase.auth().signOut();
  Swal.fire(
      'Logging Out',
      'This may take a moment',
      'warning'
  );
  setTimeout(() => {
      window.location.href = "login.html";},2000);
}
