angular.module('deviceModule',['ngRoute','IoC','ui.bootstrap']).config( function($routeProvider){
	$routeProvider.
		when('/', {controller:DeviceController}).
		otherwise({redirectTo:'/'});
});