var redis = require("redis")

var RatingRepository = function(tableName){
	var self = this;
	
	var redisMemory = redis.createClient();
	//#redisMemory.on("error", (err)->
	//#	Logger.error("GameRepository, redisError: #{err}")
	//#)
	
	self.read = function(callback)->
		redisMemory.hget(tableName, "ratings", function(err, gameStateJson){
			var state = null;
			try{
				state = JSON.parse(gameStateJson)
			}
			catch(ex)
			{
				Logger.error("failed to parse game data (#{ex}): '#{gameStateJson}'")
				throw ex
			}
			
			callback(state);
		})
		return self;
	
	
	self.update = function(state, callback){
		if(!gameState.gameData || !gameState.gameData.gameId)
			throw new Exception("gameId must be defined!")

		// redisMemory.sadd("games", gameState.gameDate.gameId)	# currently not nescesary
		redisMemory.hset(@tableName, gameState.gameData.gameId, JSON.stringify(gameState), (err, reply)->
			callback(gameState) if callback?
		)
	}
		
		
	return self;
}

module.exports = RatingRepository