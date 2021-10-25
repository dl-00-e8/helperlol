const request = require('request');
const urlencode = require('urlencode');

var key = "RGAPI-45600ed8-0a22-4175-a773-8dfbcf1b6a7b";
var idname = "Gen G Quid";
var url = "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + urlencode(idname) + "?api_key=" + key;

request(url, function(error, response, body) {
	var info_json = JSON.parse(body);
	var key = Object.keys(info_json);
	var result = "id : " + info_json['id'] + "\n" + "name : " + info_json['name'] + "\n" + "profileIconId : " + info_json['profileIconId'] + "\n" + "revisionDate : " + info_json['revisionDate'] + "\n" + "summonerLevel : " + info_json['summonerLevel'];
	console.log(info_json);
});