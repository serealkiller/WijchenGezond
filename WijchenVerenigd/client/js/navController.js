var navController = function ($routeParams, $scope, $window, dbService) {

	$scope.showLogin = false;
	$scope.isIngelogd;
	var loggedIn;
	$scope.loginMessage = "Inloggen bij WijchenVerenigd";

	dbService.login.get(function(res) {
		if (res.success) {
			$scope.isIngelogd = res.data.username.toUpperCase();
			$scope.showLogin = false;
			loggedIn = res.data;
		} else {
			$scope.isIngelogd = "INLOGGEN";
			loggedIn = false;
		}
	});

	$scope.tryLogin = function (login) {
		dbService.login.post(login, function(res) {
			if (res.success) {
				$scope.isIngelogd = res.data.username.toUpperCase();
				$scope.showLogin = false;
				loggedIn = res.data;
			} else {
				$scope.isIngelogd = "INLOGGEN";
				loggedIn = false;
				$scope.showLogin = true;
				$scope.loginMessage = res.message;
			}
		});
	}

	$scope.changeLogin = function () {
		if (loggedIn) {

		} else {
			$scope.showLogin = !$scope.showLogin;
		}
	}
}