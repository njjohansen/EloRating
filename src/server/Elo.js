var Elo = function(){
	var self = this;
	var K = 32;

	self.applyRating = function(t1, t2, winner){
		var Sa = 0, Sb = 0;
		if( winner == 1)
			Sa = 1;
		if( winner == 2)
			Sb = 1;
		var res = self.computeRating(t1.rating, t2.rating, 1, Sa, Sb);

		t1.rating = res.RaN;
		t2.rating = res.RbN;
	};

	self.computeRating = function(Ra, Rb, NumGames, Sa, Sb){

		var Qa = Math.pow(10, Ra/400);
		var Qb = Math.pow(10, Rb/400);
		var Ea = Qa / (Qa + Qb);
		var Eb = Qb / (Qa + Qb);
		var RaN = Ra + K * (Sa - Ea);
		var RbN = Rb + K * (Sb - Eb);

		return {
			Ra: Ra,
			Rb: Rb,
			RaN: RaN,
			RbN: RbN,
			Ea: Ea,
			Eb: Eb
		};
	};
};
module.exports = Elo;