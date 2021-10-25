// 모듈
const request = require('request');
const urlencode = require('urlencode');

// summoner api
var idname = "vlrhsgody";
var key = "RGAPI-fc4f40c5-467a-49ee-a95e-f2e611e2c9e5";
var idUrl = "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + urlencode(idname) + "?api_key=" + key;

request(idUrl, function(error, response, body) {
	var info_json = JSON.parse(body);
	var keys = Object.keys(info_json);
	var puuid = info_json.puuid;
	
	// matchId api
	var matchUrl = "https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid  + "/ids?start=0&count=1&api_key=" + key;
	
	request(matchUrl, function(error, response, body) {
	info_json = JSON.parse(body);
	var matchId = info_json[0];

		//match Timeline api
		var matchInformUrl = "https://asia.api.riotgames.com/lol/match/v5/matches/" + matchId + "?api_key=" + key;
		
		request(matchInformUrl, function(error, response, body) {
			info_json = JSON.parse(body);
			keys = Object.keys(info_json.info);
			console.log(info_json.info.participants);
		});
	});
});