var gebruikerController = function ($routeParams, $scope, $window, dbService, statService) {
    statService.setShow(true);
	$scope.ingelogd = false;
	$scope.inlogMessage = "";
	$scope.checkLogin = function () {

	};

	$scope.logout = function () {
		dbService.logout(function(res) {
			inlogMessage = res.message;
		});
	};

    $scope.reg = function() {
        if($scope.createGebruiker.wachtwoord != $scope.createGebruiker.bevestigWachtwoord)
        {
            $scope.IsMatch=true;
            return false;
        }
        $scope.IsMatch=false;

        dbService.createGebruiker.post($scope.createGebruiker ,function (res) {
            $scope.regMsg = true;
            $scope.regMessage = res.message;
        });
	};
};