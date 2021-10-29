// 모듈
const request = require('request');
const urlencode = require('urlencode');
const fs = require('fs');

// summoner api
var key;
var idname;
var sumUrl = 'https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + urlencode(idname) + '?api_key=' + key;

request(sumUrl, function(error, response, body) {
	let	infoJson = JSON.parse(body);
	let id = infoJson['id'];
	const specUrl = 'https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/' + id + '?api_key=' + key;
	// spectator api
	request(specUrl, function(error, response, body) {
		infoJson = JSON.parse(body);
		
		let blueIndex = 0;
		let redIndex = 0;
		let blueBan = new Array();
		let redBan = new Array();
		let bluePick = new Array();
		let redPick = new Array();
		
		for(let i = 0; i < 10; i++) {
			if(infoJson['bannedChampions'][i]['teamId'] == 100) {
				blueBan[blueIndex] = infoJson['bannedChampions'][i].championId;
				blueIndex++;
			}
			else if(infoJson['bannedChampions'][i]['teamId'] == 200) {
				redBan[redIndex] = infoJson['bannedChampions'][i].championId;
				redIndex++;
			}
		}
		
		blueIndex = 0;
		redIndex = 0;
		for(let i = 0; i < 10; i++) {
			if(infoJson['participants'][i]['teamId'] == 100) {
				var inform = {teamId : 0, spell1Id : 0, spell2Id : 0, championId : 0, summonerName : 'default' };
				inform['teamId'] = infoJson['participants'][i]['teamId'];
				inform['spell1Id'] = infoJson['participants'][i]['spell1Id'];
				inform['spell2Id'] = infoJson['participants'][i]['spell2Id'];
				inform['championId'] = infoJson['participants'][i]['championId'];
				inform['summonerName'] = infoJson['participants'][i]['summonerName'];
				bluePick[blueIndex] = inform;
				blueIndex++;
			}
			else if(infoJson['participants'][i]['teamId'] == 200) {
				var inform = {teamId : 0, spell1Id : 0, spell2Id : 0, championId : 0, summonerName : 'default' };
				inform['teamId'] = infoJson['participants'][i]['teamId'];
				inform['spell1Id'] = infoJson['participants'][i]['spell1Id'];
				inform['spell2Id'] = infoJson['participants'][i]['spell2Id'];
				inform['championId'] = infoJson['participants'][i]['championId'];
				inform['summonerName'] = infoJson['participants'][i]['summonerName'];
				redPick[redIndex] = inform;
				redIndex++;
			}
		}
			
		
		console.log(redBan);
		console.log(blueBan);
		console.log(redPick);
		console.log(bluePick);
	})
})
	
/* 
필요정보 : bannedChampions, championId, teamId, spell1Id, spell2Id

팀을 기준으로 구분하여서 2차원 배열 선언
1차원 --> 블루팀, 레드팀
2차원 --> 각 소환사별 정보
*/

