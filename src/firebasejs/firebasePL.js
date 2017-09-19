  var config = {
    apiKey: "AIzaSyCS2aFGvqBAvh5jWrxztKaE0YhtxI7ewx8",
    authDomain: "tushardb-87fc8.firebaseapp.com",
    databaseURL: "https://tushardb-87fc8.firebaseio.com",
    projectId: "tushardb-87fc8",
    storageBucket: "tushardb-87fc8.appspot.com",
    messagingSenderId: "501594027611"
  };
  firebase.initializeApp(config);
  
   function firebaseSignIn(email, password) { 
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          if (error.code === 'auth/wrong-password') {
						document.querySelector('paper-toast').show("Wrong password.");
          } 
          else if (error.code === 'auth/user-not-found') {
						document.querySelector('paper-toast').show("User not found, Please SignUP.");
          } 	
          else if (error.code === 'auth/invalid-email') {
						document.querySelector('paper-toast').show("Please enter valid username and password.");
          }					
		  else {
						console.log("errorCode :" + error.code);
				    var temp = error.code;
						document.querySelector('paper-toast').show(temp);
          }
        });
      }
	  
	  
/* This is code to signUp the user	  
	function firebaseSignUp(){
		  var email = document.getElementById('email').value;
		  var password = document.getElementById('password').value;
		  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(value) {
			console.log("this is new user......" + value.email);
			var playersRef = firebase.database().ref("players/");
			playersRef.set({
			   Tushar: {
				  number: 2,
				  age: 20
			   }
			});
			  }).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log("errorMessage signup:" + errorMessage);
			console.log("errorCode signup:" + errorCode);
			if (error.code === 'auth/invalid-email') {
				document.querySelector('paper-toast').show("Please enter valid email.");
			} 
			else if (error.code === 'auth/weak-password') {
				document.querySelector('paper-toast').show('Password should be at least 6 characters');
			} 		  
			else {
				console.log("errorCode :" + error.code);
				var temp = error.code;
				document.querySelector('paper-toast').show(temp);
			}
		});
	}*/


function uploadFile() {
	
}
	
/* This is code to signUp the user*/	
	function firebaseSignOut() {
		if (firebase.auth().currentUser) {
			firebase.auth().signOut();
		}
	}