var navController = function ($routeParams, $scope, $window, dbService, $location, loginService, actService) {
	$scope.showLogin = false;
	$scope.isIngelogd;
	var loggedIn = false;
	$scope.loginMessage = "Inloggen bij WijchenVerenigd";

	$scope.$on('loginUpdated', function() {
		$scope.showLogin = loginService.showLogin;
	});

	dbService.login.get(function(res) {
		if (res.success) {
			$scope.isIngelogd = res.data.username.toUpperCase();
			$scope.showLogin = false;
			loggedIn = res.data;
			loginService.setLoggedIn(true);
			$scope.checked = true;
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
				loginService.setLoggedIn(true);
				$scope.checked = true;
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
			$location.path("/gebruikers/" + loggedIn._id);
		} else {
			$scope.showLogin = !$scope.showLogin;
		}
	}

	$scope.actMaken = function () {
		if (loggedIn) {
			$location.path("/activiteit");
		} else {
			$scope.showLogin = true;
		}
	}
	$scope.viewFeeds = function () {
		if (loggedIn) {
			$location.path("/feed");
		} else {
			$scope.showLogin = true;
		}
	}

	$scope.register = function () {
		$scope.showLogin = false;
		$location.path("/register");
	}
}