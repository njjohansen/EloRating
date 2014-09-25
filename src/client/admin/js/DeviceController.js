function DeviceController($rootScope, $scope, $$deviceApplication, $$websocketService){

	$scope.teams = [];
	$scope.winner = "";
	$scope.loser = "";
	
	$scope.sendResult = function() {
		if (!$scope.winner.length || !$scope.loser.length) {
			alert("Du skal udfylde både vinder taber.");
			return;
		}
		if ($scope.teams.indexOf($scope.winner) < 0) {
			if (!confirm("Vil du oprette et nyt team til vinderen: {0}?".format($scope.winner))) {
				return;
			}
		}
		if ($scope.teams.indexOf($scope.loser) < 0) {
			if (!confirm("Vil du oprette et nyt team til taberen: {0}?".format($scope.loser))) {
				return;
			}
		}
		logInfo("{0} has won over {1}".format($scope.winner, $scope.loser));
		$$websocketService.matchup($scope.winner, $scope.loser, 1);
		$scope.winner = "";
		$scope.loser = "";
	}

	$scope.$on("RATINGUPDATE", function(event, data) {
		var teams = [];
		for (var i = 0; i < data.teams.length; ++i) {
			teams.push(data.teams[i].name);
		}
		$scope.teams = teams;
	});
	
	$rootScope.broadcastEvent = function(eventname, args){
		//logDebug("Broadcasting controller event: '{0}'".format(eventname));
		$rootScope.$broadcast(eventname, args);
		$rootScope.$digest();
	}
}