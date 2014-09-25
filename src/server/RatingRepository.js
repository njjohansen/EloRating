redis = require("redis")
uuid = require('node-uuid')

Logger = require('./Logger')
GameState = require("./GameState")

class GameRepository 
	constructor: (tableName)->
		@tableName = tableName
		
	redisMemory = redis.createClient()
	#redisMemory.on("error", (err)->
	#	Logger.error("GameRepository, redisError: #{err}")
	#)
	
	create : (gameName, mapName, callback)->
		gameState = new GameState(uuid.v1())
		gameData = gameState.gameData
		gameData.gameName = gameName
		gameData.mapName = mapName
		@update(gameState, callback)
		@
	
	read : (gameId, callback)->
		redisMemory.hget(@tableName, gameId, (err, gameStateJson)->
			gameState = null
			try
				gameState = JSON.parse(gameStateJson)
				gameState.action = null if gameState? # always reset animation action when extracting
			catch ex
				Logger.error("failed to parse game data (#{ex}): '#{gameStateJson}'")
				throw ex
			
			callback(gameState)
		)
		@
	
	#beware, this is performance heavy
	readAllKeys : (callback)->
		redisMemory.hkeys(@tableName, (err, data)->
			callback(data)
			#logDebug(JSON.stringify(data))
		)
		@
	
	#beware, this is performance heavy
	readAll : (callback)->
		redisMemory.hgetall(@tableName, (err, data)->
			games = []
			for gameId of data
				games.push(JSON.parse(data[gameId]))
			callback(games)
		)
		@
	
	update : (gameState, callback)->
		if(!gameState.gameData || !gameState.gameData.gameId)
			throw new Exception("gameId must be defined!")

		# redisMemory.sadd("games", gameState.gameDate.gameId)	# currently not nescesary
		redisMemory.hset(@tableName, gameState.gameData.gameId, JSON.stringify(gameState), (err, reply)->
			callback(gameState) if callback?
		)
		@
		
	delete : (gameId, callback)->
		redisMemory.hdel(@tableName, gameId, (err)->
			callback() if callback?
		)
		@
	
	clear : (callback)->
		redisMemory.del(@tableName, (err, reply)->
			callback() if callback?
		)
	@


module.exports = GameRepository