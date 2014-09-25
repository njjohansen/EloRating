var redis = require("redis")

var RatingRepository = function(tableName){
	var self = this;
	
	var redisMemory = redis.createClient();
	//#redisMemory.on("error", (err)->
	//#	Logger.error("GameRepository, redisError: #{err}")
	//#)
	
	self.readRatings = function(callback){
		redisMemory.hget(tableName, "ratings", function(err, stateJSON){
			var state = null;
			try{
				state = JSON.parse(stateJSON);
			}
			catch(ex)
			{
				//Logger.error("failed to parse game data (#{ex}): '#{gameStateJson}'");
				throw ex;
			}
			
			callback(state);
		});
		return self;
	};	
	
	self.updateRatings = function(state, callback){
		// redisMemory.sadd("games", gameState.gameDate.gameId)	# currently not nescesary
		redisMemory.hset(tableName, "ratings", JSON.stringify(state), function(err, reply){
			callback(gameState) if callback?
		});
	};
		
		
	return self;
};

module.exports = RatingRepository;