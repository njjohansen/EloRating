function ScreenController($rootScope, $scope, $$screenApplication, $$websocketService, $filter){

	$scope.scoreboard = [];
	$scope.floor = Math.floor;
		
	$scope.$on("RATINGUPDATE", function(event, data) {
		teams = $filter('orderBy')(data.teams, 'rating', true);
		var pos = 0;
		var score = -1;
		for (var i = 0; i < teams.length; ++i) {
			if (teams[i].rating != score) { ++pos; score = teams[i].rating; };
			teams[i].index = i;
			teams[i].position = pos;
			teams[i].rating = Math.floor(teams[i].rating);
		}
		$scope.scoreboard = $filter('orderBy')(data.teams, 'name');
	});

	$rootScope.broadcastEvent = function(eventname, args){
		//logDebug("Broadcasting controller event: '{0}'".format(eventname));
		$rootScope.$broadcast(eventname, args);
		$rootScope.$digest();
	};
	
}