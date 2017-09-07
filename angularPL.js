
var module1 = angular.module("MODULE1", ["ngRoute", "firebase", "ng-polymer-elements"]);

module1.controller("myCtrl1", function($scope, $location, $firebaseAuth, $firebaseObject, $firebaseArray) {
	$scope.getInput = document.querySelectorAll('paper-input');
	$scope.name; 
	$scope.signupFlagHide = true;
	var auth = $firebaseAuth();
	
	$scope.functionSignIn = function () {
		if($scope.signupFlagHide === false){
			$scope.signupFlagHide = true;
		}
		else{
			firebaseSignIn($scope.email, $scope.password);
		}	
	};

	$scope.functionSignUp = function () {
		if($scope.signupFlagHide){
			$scope.signupFlagHide = false;
		}
		else if ($scope.name === undefined){
			for (i = $scope.getInput.length-1; i >= 0 ; i--) {	
			if(!$scope.getInput[i].invalid){
				$scope.getInput[i].validate(true);
				}
			}
		}
		else{
					auth.$createUserWithEmailAndPassword($scope.email, $scope.password).then(function(value) {
						var usersRef = firebase.database().ref().child("users");
						var person = {  
								"name": $scope.name,
								"email": value.email					
							};
						usersRef.child(value.uid).set(person);
						/*start code for setting profile dp*/
						var storageRef1 = firebase.storage();
						var evt = document.getElementById("myFile");
						var storageRef = storageRef1.ref("/images/" + value.uid + "/profileDP/profileDP.png");
						var firstFile = evt.files[0]; 
						var uploadTask = storageRef.put(firstFile); 
						/*end code for setting profile dp*/
					}).catch(function(error) {
							var errorCode = error.code;
							var errorMessage = error.message;
							console.log("errorMessage signup:" + errorMessage);
							console.log("errorCode signup:" + errorCode);
							if (error.code === 'auth/invalid-email') {
								document.querySelector('paper-toast').show("Please enter valid email.");
							} 
							else if (error.code === 'auth/weak-password') {
								document.querySelector('paper-toast').show("Password should be at least 6 characters");
							} 		  
							else {
								var temp = error.message;
								document.querySelector('paper-toast').show(temp);
								console.log("errorCode :" + error.code);
							}
				});
		}
	};

	$scope.functionSignOut = function () {
		firebaseSignOut();
	};	
	
	auth.$onAuthStateChanged(function(user) {
		if (user) {
			$location.path( "/home" );
			$scope.userUID = user.uid;
			var ref = firebase.database().ref().child("users").child(user.uid);
			$scope.messages = $firebaseObject(ref);
				$scope.messages.$loaded(
						function(data) {
						console.log($scope.messages); 
						$scope.dpName = $scope.messages.name;
							var storageRef = firebase.storage();
							var dateRef = storageRef.ref("/images/" + user.uid + "/profileDP/profileDP.png");
							dateRef.getDownloadURL().then(function (url) {
								document.querySelector('paper-avatar').src = url;
								document.querySelector('paper-card').image = url;
							});							
						},
						function(error) {
						console.error("Errorrrrrrrrrrrr:", error);
						}
				);
		}else{
			console.log("No user logged...!");
			$location.path( "/" );
		}
	});	
	
	/*************************************************************************************************************************************************/

	$scope.addData = function () {
		$scope.getInput = document.querySelectorAll('#animated paper-input');
		for (i = $scope.getInput.length-1; i >= 0 ; i--) {	
			if($scope.getInput[i].invalid){
				$scope.getInput[i].validate(true);
				$scope.flag1 = 1;
			}
		}
		
		if ($scope.flag1 === 0) {
			var ref = firebase.database().ref("users/" + $scope.userUID);
			var person = {  
					"title": $scope.noteTitle,
					"note": $scope.noteData					
				};
			ref.once("value")
			  .then(function(snapshot) {
				var hasName = snapshot.hasChild("NoteList");
				var noteCount = snapshot.child("NoteList").numChildren();
				ref.child("NoteList").child(noteCount+1).set(person);
				document.querySelector('paper-dialog paper-button').click();
							var refSub = ref.child("NoteList");
							$scope.messages1 = $firebaseArray(refSub); 
								$scope.messages1.$loaded(
								  function(data) { 
									console.log($scope.messages1);
								  },
								  function(error) {
									console.error("Errorrrrrrrrrrrr:", error);
								  }
								);
			  });
		}
		else{
			$scope.flag1 = 0;
		}
	};	
	
	$scope.cancelData = function () {
		$scope.getInput = document.querySelectorAll('#animated paper-input');
		for (i = $scope.getInput.length-1; i >= 0 ; i--) {	
			$scope.getInput[i].value = "";
		}
	};	
/**********************************************************************************************************************************************/
});


 module1.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "login1.html",
		controller : "myCtrl1"
    })
	
    .when("/home", {
        templateUrl : "home.html",
		controller : "myCtrl1"
    })	
}); 


