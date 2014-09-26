// files necessary for unit testing
require("../common");
var Assert = require('assert');
// the modules that should be tested
var NeedsTesting = require('../NeedsTesting');
var RatingRepository = require('../RatingRepository');
var Elo = require('../Elo');

var createTeam = function(name) {
	return {
		name: name,
		rating: 1000,
		wins: 0,
		losses: 0
	};
};
// name of the module that is to be tested
describe("PoC test", function(){
	var _moduleThatNeedsTesting = new NeedsTesting();

	before(function(){
		// run before all tests in this module
	});
	after(function(){
		// run previous to all tests in this module
	});
	beforeEach(function(){
		// run before each "it"-function
	});
	afterEach(function(){
		// run previous to each "it"-function
	});

	// 1 to many "it"-functions
	it("should be possible to run a unit test", function(done){
		Assert.equal(_moduleThatNeedsTesting.returnFalse(), false);
		Assert.equal(_moduleThatNeedsTesting.returnTrue(), true);
		// test logging utility
		logDebug("We should not log messages during a {0} :/".format("unit test"))
		done(); // this can be used for asynchronous methods, or just left out as argument
	});

	it("should be possible to run one more unit test", function(){		
		Assert.equal("1", 1); // I love you, js!
	});	

	it("persisting in redis, write and read the same", function(done){
		var repo = new RatingRepository("test");
		repo.updateRatings({teams:["hej"]}, function(){
			repo.readRatings(function(res){
				Assert.equal("hej", res.teams[0]);
				done();
			});
		});
	});	

	it("should be possible to Elo", function(){		
		var _elo = new Elo();
		var t1 = {rating: 1000};
		var t2 = {rating: 1000};
		for( var i = 0; i < 100; i++){
			_elo.applyRating(t1, t2, 1+Math.round(Math.random()));
			console.log("t1: " + t1.rating + " t2: " + t2.rating);
		}
		
	});	

	it("Lets create some teams", function(done){		
		ratingState = {
			teams: [
				createTeam("Team 1337"),
				createTeam("Team tosser"),
				createTeam("The tokens of fortune"),
				createTeam("Team Albani"),				
				createTeam("Team FTW!"),
				createTeam("Team arabiske nisser"),
				createTeam("Team pilsner"),
				createTeam("Redis Ftw"),
				createTeam("1Team FTW!"),
				createTeam("1Team arabiske nisser"),
				createTeam("1Team pilsner"),
				createTeam("2Team Albani"),
				createTeam("2Team FTW!"),
				createTeam("2Team arabiske nisser"),
				createTeam("2Team pilsner"),
				createTeam("3Team Albani"),
				createTeam("3Team FTW!"),
				createTeam("3Team arabiske nisser"),
				createTeam("3Team pilsner"),
				createTeam("4Team Albani"),				
				createTeam("4Team FTW!"),
				createTeam("4Team arabiske nisser"),
				createTeam("4Team pilsner"),
				createTeam("5Team Albani"),
				createTeam("5Team FTW!"),
				createTeam("5Team arabiske nisser"),
				createTeam("5Team pilsner")
			]
		};
		var repo = new RatingRepository("set1");
		//repo.updateRatings(ratingState, function(){
		done();
		//});

	});	

	it("Lets stir the points", function(done){	
		var _elo = new Elo();
		var repo = new RatingRepository("set2");
		repo.readRatings(function(ratings){
			var len = ratings.teams.length;

			for( var i = 0; i < 100; i++){
				var i1 = Math.floor(Math.random()*len);
				var i2 = Math.floor(Math.random()*len);
				_elo.applyRating(ratings.teams[i1], ratings.teams[i2], 1+Math.round(Math.random()));
			};

			repo.updateRatings(ratings, function(){
				done();
			});

		});
	});


});