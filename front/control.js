var myApp = angular.module('myApp', []);

myApp.controller('myCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {
	$scope.x = {
		name: "",
		phno: "",
		email: ""
	};

	Id = undefined;

	$http.get('/contact').then(function(res){
		$scope.arr = res.data;
		console.log("Data received.");
	},function(err){
		console.log("I am sorry");
	});
	$("#Alert").css("display","none");
	$("#msgClose").click(function(){
		$("#Alert").css("display","none");
	});

	$scope.del_id = function(id){
		Id = id;
		//console.log(Id);
	}

	inputValidate = function(Msg=""){
		var Err="";
		if(/(^[A-Z])([A-Za-z]+)(\s[A-Za-z0-9]+)*$/.test($scope.x.name) == false)
			Err += "<strong>Name:</strong> Atleast the first name should have a capital letter at the beginning, followed by one or more small letters. The rest can have alphanumeric characters, as well as whitespaces.<br/>";
		if(/^[0-9]{10}$/.test($scope.x.phno) == false)
			Err += "<strong>Phone Number:</strong> Invalid phone number - should have exactly 10 digits.<br/>";
		if(/(^[A-Za-z0-9_\.]+)@([a-z0-9]+(\.[a-z]+)?$)/.test($scope.x.email) == false)
			Err += "<strong>Email:</strong> Invalid email. Note that in the email username, only _ and . special characters are allowed.<br/>";
		$("#Alert").removeClass().css("display","block");
		if(Err == ""){
			Err = "<strong>"+Msg+"</strong>";
			document.getElementById("Message").innerHTML = Err;
			$("#Alert").addClass("alert").addClass("alert-dismissable").addClass("alert-success");
			return true;
		}
		else{
			$("#Alert").addClass("alert").addClass("alert-dismissable").addClass("alert-danger");
			document.getElementById("Message").innerHTML = Err;
			return false;
		}
	}

	$scope.addContact = function(){
		//Checking the inputs here
		if(inputValidate("Record Successfully Created.") == false) return;
		temp = {
			name: $scope.x.name,
			phno: $scope.x.phno,
			email: $scope.x.email
		};
		console.log(temp);
		$http.post('/newCont',temp).then(function(res){
			$scope.arr = res.data;
			$scope.x = {
				name: "",
				phno: "",
				email: "",
				_id: undefined
			};
			console.log("Data received.");
		},function(err){
			console.log("I am sorry");
		});
	}

	$scope.remContact = function(){
		var id = Id;
		console.log("The id to be deleted is: "+id);
		$http.delete('/delCont/' + id).then(function(res){
			$scope.arr = res.data;
			console.log("Data received.");
		},function(err){
			console.log("I am sorry");
		});
		Id = undefined;
	}

	$scope.edit = function(id){
		console.log("The id to be edited is: "+id);
		$http.get('/edCont/' + id).then(function(res){
			$scope.x = res.data;
			console.log("Data received.");
		},function(err){
			console.log("I am sorry");
		});
	}

	$scope.update = function(){
		//Checking the inputs here
		if(inputValidate("Record Successfully Updated.") == false) return;
		console.log("Record with id: "+$scope.x._id+" sent for updation.");
		$http.put('/upCont/' + $scope.x._id, $scope.x).then(function(res){
			$scope.arr = res.data;
			console.log("Data received.");
		},function(err){
			console.log("I am sorry");
		});
		$scope.x = {
			name: "",
			phno: "",
			email: "",
			_id: undefined
		};
	}
}]);

myApp.directive("repEnded",function(){
	return{
		restrict: "A",
		link: function(scope,elem,attrs){
			if(scope.$last){
				scope.$emit('LastElementDone');
			}
		}
	};
});

myApp.directive("repEdit",function(){
	return{
		restrict: "A",
		link: function(scope,elem,attrs){
			scope.$on('LastElementDone', function(LastElementDoneEvent){
				//console.log('good to go');
				$("button#btnUpdate").prop("disabled",true);
				$("button#btnEdit").click(function(){
					$("button#btnUpdate").prop("disabled",false);
					$("button#btnEdit").prop("disabled",true);
				});
				$("button#btnUpdate").click(function(){
					$("button#btnEdit").prop("disabled",false);
					$("button#btnUpdate").prop("disabled",true);
				});
				$("button#btnAdd").click(function(){
					if($("button#btnUpdate").prop("disabled") == false){
						$("button#btnEdit").prop("disabled",false);
						$("button#btnUpdate").prop("disabled",true);
					}
				});
			});
		}
	};
});