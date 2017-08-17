
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
			console.log(user.email);
			$location.path( "/home" );
			var ref = firebase.database().ref().child("users").child(user.uid);
			$scope.messages = $firebaseObject(ref); 
			console.log($scope.messages); 
		}else{
			console.log("No user logged...!");
			$location.path( "/" );
		}
	});		
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


