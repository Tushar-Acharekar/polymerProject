
var module1 = angular.module("MODULE1", ["ngRoute", "firebase", "ng-polymer-elements"]);

module1.controller("myCtrl1", function($scope, $location, $firebaseAuth, $firebaseObject, $firebaseArray) {
	$scope.getInput = document.querySelectorAll('paper-input');
	$scope.name; 
	$scope.signupFlagHide = true;
	$scope.flag1 = 0;
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
							dataOnstatechnge();
							var storageRef = firebase.storage();
							var dateRef = storageRef.ref("/images/" + user.uid + "/profileDP/profileDP.png");
							dateRef.getDownloadURL().then(function (url) {
								document.querySelector('paper-avatar').src = url;
								//document.querySelector('paper-card').image = url;
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
		addingData();
	};	
	
	$scope.deleteData= function (id) {
		console.log("id == " + id);
		deleteTimelineData(id);
	};	
	
	
	$scope.cancelData = function () {
		$scope.getInput = document.querySelectorAll('#addNoteButton paper-input');
		for (i = $scope.getInput.length-1; i >= 0 ; i--) {	
			$scope.getInput[i].value = "";
			$scope.getInput[i].invalid = false;
		}
	};	
	
	$scope.favoriteData = function (id) {
			var ref = firebase.database().ref("users/" + $scope.userUID).child("NoteList").child(id);
			ref.once("value")
				.then(function(snapshot) {
					$scope.favoriteDataValue = snapshot.val();
					if($scope.favoriteDataValue.favorite == "favorite-border"){
						snapshot.ref.update({"favorite": "favorite"});
						document.querySelector('paper-toast').show("Added to Favorited");
					  }
					  else{
						 snapshot.ref.update({"favorite": "favorite-border"});
					  }
			  });
	};
	
	
	$scope.openAccount = function (){
		console.log("in avatar....!");
		document.querySelector('#accountInfo').positionTarget = document.querySelector('#avatarDp');
		document.querySelector('#accountInfo').open();
	}
	
/**********************************************************************************************************************************************/
	
	function addingData(){
		$scope.getInput = document.querySelectorAll('#addNoteButton paper-input');
		for (i = $scope.getInput.length-1; i >= 0 ; i--) {	
			if($scope.getInput[i].invalid){
				$scope.getInput[i].validate(true);
				$scope.flag1 = 1;
			}
		}
		
		if ($scope.flag1 == 0) {
			var ref = firebase.database().ref("users/" + $scope.userUID);
			$scope.noteCount = "noteCount_" + Math.round((new Date().getTime() / 1000));
			
			ref.once("value")
				.then(function(snapshot) {
						var person = {  
							"id": $scope.noteCount,
							"title": $scope.noteTitle,
							"note": $scope.noteData,
							"favorite": "favorite-border"
						};

						ref.child("NoteList").child($scope.noteCount).set(person);
						document.querySelector('paper-dialog #cancelData').click();
								$scope.messages1 = $firebaseArray(ref.child("NoteList")); 
								$scope.messages1.$loaded(
									function(data) {console.log($scope.messages1);},
									function(error) {console.error("Error occurs in data loading..!:", error);}
								);
						document.querySelector('paper-toast').show("Note created successfully....!");
			  });
		}		
		else{
			$scope.flag1 = 0;
		}		
	}
	
	function dataOnstatechnge(){
		var ref = firebase.database().ref("users/" + $scope.userUID);
		$scope.messages1 = $firebaseObject(ref.child("NoteList")); 
		$scope.messages1.$loaded(
			function(data) {console.log($scope.messages1);},
			function(error) {console.error("Error occurs in data loading..!:", error);}
		);
	}
	
	function deleteTimelineData(id){
		var ref = firebase.database().ref("users/" + $scope.userUID).child("NoteList").child(id);
		$scope.virtualRef = $firebaseObject(ref);
		$scope.virtualRef.$remove().then(function(ref) {
			document.querySelector('paper-toast').show("Note deleted successfully..!");
		}, function(error) {
			console.log("Error.....", error);
			document.querySelector('paper-toast').show(error);
		});
	}
	
});


 module1.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "src/login1.html",
		controller : "myCtrl1"
    })
	
    .when("/home", {
        templateUrl : "src/viewes/home.html",
		controller : "myCtrl1"
    })	
}); 


