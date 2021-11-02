// 웹 크롤링의 기본
//https://codingbroker.tistory.com/124
//https://security-log.tistory.com/20


//초안입니다.
const request = require('request');
const cheerio = require("cheerio");  // 스크래핑
const iconv = require("iconv-lite"); // 인코딩
const readline = require("readline");
/*
const rl = readline.createInterface({
	input: process.stdin,
	outut: process.stdout,
});
*/
var username = "pcpcca"; // 소환사명 입력 받을꺼

const options = {
	method: "GET",
	uri : "https://www.op.gg/summoner/spectator/userName=" + encodeURI(username),
	headers : {
		'Accept-Language' : 'ko_KR,en;q=0.8',
		'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
	},
	encoding : null
};

request(options, function(error, response, body){
	if(error){
		console.error(error);
		return;
	}
	// 에러안뜨고 정상일 때
	if(response.statusCode === 200) {
		console.log("response ok");
		// iconv.extendNodeEncodings();
		// var strContents = new Buffer(body);
		// console.log(strContents.toString('utf8'));
		const bodyDecoded = iconv.decode(body, 'utf-8');
		//console.log(bodyDecoded);
		const $ = cheerio.load(bodyDecoded);
		
		// 블루팀, 레드팀 유저이름 넣을 리스트
		const blue_users_list = ['.Team-100'];
		const red_users_list = ['.Team-200'];
		var final_users_team = [];
		var another_users_team = [];
		//var result = "";
		
		//블루팀 유저이름 크롤링 // 팀 구분을 위한 용도
		const blue_team = $(".Team-100 > tbody > tr > #live_summoner > a").toArray();
		const red_team = $(".Team-200 > tbody > tr > #live_summoner > a").toArray();
		//console.log(blue_team);
		
		// 블루팀 유저 추출 및 리스트 넣기
		blue_team.forEach((a) => {
			const live_blue_users_name = $(a).text().trim();
			//console.log(live_blue_users_name);
			blue_users_list.push(live_blue_users_name);
		}); //console.log(blue_users_list); ['a', 'b',...]
		//console.log("blue team : ", blue_users_list);
		
		//블루팀 출력
		console.log("[ 블루팀 리스트 ]")
		for(var i in blue_users_list) {
			console.log(blue_users_list[i]);
		}
		console.log('\n');
		
		// 레드팀 유저 추출 및 리스트 넣기
		red_team.forEach((a) => {
			const live_red_users_name = $(a).text().trim();
			red_users_list.push(live_red_users_name);
		});
		//console.log("red team : ", red_users_list);
		
		//레드팀 출력
		console.log("[ 레드팀 리스트 ]")
		for(var i in red_users_list) {
			console.log(red_users_list[i]);
		}
		
		// 유저가 블루팀인지, 레드팀인지 구분하기
		if(blue_users_list.includes(username)) {
			console.log('\n');
			console.log(username,"은 블루팀입니다.");
			final_users_team = blue_users_list;
			another_users_team = red_users_list;
		}
		else if(red_users_list.includes(username)){
			console.log('\n');
			console.log(username,"은 레드팀입니다.");
			final_users_team = red_users_list;
			another_users_team = blue_users_list;
		}
		else {
			console.log('\n');
			console.log(username,"은 없는 소환사명이거나, 게임중이 아닙니다.");
			throw "stop"; // 소환사 게임이 끝남.
		}
		//console.log(final_users_team[0]); 1픽부터 index는 1
		
		// 입력한 소환사가 해당 팀에서 몇번째 픽인지 찾기
		for(var i in final_users_team){
			if(final_users_team[i] === username) {
				var summoner_index = i; // 입력한 소환사의 해당 팀의 인덱스
			}
		}
		//console.log(summoner_index);
		console.log('\n');
		//입력한 소환사의 챔피언 찾기->api에서 제공해주지만 아직 불가라서 작성
		//소환사의 챔피언을 추출한다!
		const summoner_champs = $(`${final_users_team[0]} > tbody > tr:nth-of-type(${summoner_index}) > .ChampionImage > a`);
		//console.log(summoner_champs.attr("href").split('/')[2]);
		
		//상대 라인의 픽 
		const another_summoner_champs = $(`${another_users_team[0]} > tbody > tr:nth-of-type(${summoner_index}) > .ChampionImage > a`);
		
		// 입력한 소환사의 챔피언 (api로 할 예정)
		const summoner_champ = summoner_champs.attr("href").split('/')[2];
		console.log("우리팀 소환사의 챔피언 : ", summoner_champ);
		
		// 소환사의 상대 챔피언 (api로 할 예정)
		const another_summoner_champ = another_summoner_champs.attr("href").split('/')[2];
		console.log("상대팀 소환사의 챔피언 : ", another_summoner_champ);
		
		// 소환사의 숙련도에 따른 챔피언 승률 및 판수 + kda 출력
		// 너무 어려웡
		
		
		// 챔피언 전체 승률 -> 크롤링해서 들고와야함.
		// https://www.op.gg/champion/ryze/statistics/adc/matchup
		//                            챔프             라인

		var Line = {'탑':'top', '정글':'jungle', '미드':'mid', '원딜':'adc', '서폿':'support'};
		//console.log(Line['탑']);
		console.log("라인 선택 ㄱㄱ (탑, 정글, 미드, 원딜, 서폿)");
		
		const rl = readline.createInterface({
		input: process.stdin,
		outut: process.stdout,
		});
		
		rl.question('where line??', (answer) => {
			var winrate_url2 = `https://www.op.gg/champion/${summoner_champ}/statistics/${Line[answer]}/matchup?targetChampionId=`;
			//console.log(winrate_url);
			const options2 = {
				method: "GET",
				uri : winrate_url2,
				headers : {
					'Accept-Language' : 'ko_KR,en;q=0.8',
					'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
				},
				encoding : null
			};
			
			request(options2, function(error, response, body){
				if(error){
					console.error(error);
					return;
				}
				if(response.statusCode === 200){
					console.log("response2 ok");
					const bodyDecoded = iconv.decode(body, 'utf-8');
					//nsole.log(bodyDecoded);
					if(bodyDecoded.includes("오류가 발생했습니다.")){
						console.log('\n챔피언의 데이터가 없습니다.');
						return;
					}
					const $ = cheerio.load(bodyDecoded);
					console.log(summoner_champ + "  VS  " + another_summoner_champ);
					//https://www.op.gg/champion/lulu/statistics/support/matchup?targetChampionId=
					//이 url만 챔피언의 id만 존재함. 시팔
					const available_enemy_name_lists = [];
					const available_enemy_id_lists = [];
					const available_enemy_lists = $("div.champion-matchup-champion-list__item").toArray();
					//console.log(available_enemy_list);
					available_enemy_lists.forEach((div) => {
						const available_enemy_names = $(div).attr("data-champion-key");
						const available_enemy_ids = $(div).attr("data-champion-id");
						available_enemy_name_lists.push(available_enemy_names);
						available_enemy_id_lists.push(available_enemy_ids);
					});
					//console.log(available_enemy_name_lists);
					//console.log(available_enemy_id_lists);
					
					// 적 챔피언의 확률을 들고올 수 있습니다, 라인별로 데이터가 충분한 리스트에 대해서만 추출가능
					// 챔피언 자체 라인전 승률 가져오기
					if(available_enemy_name_lists.includes(another_summoner_champ)){
						//console.log("승률 계산 챔프 가능");
						//request 해서 url 작업 들어가야함.
						for(var i in available_enemy_name_lists){
							if(available_enemy_name_lists[i] == another_summoner_champ){
								console.log(another_summoner_champ, "의 id : ", available_enemy_id_lists[i]);// -> 챔프 아이디 추출 (api 로 할 예정)
								var winrate_url3 = `https://www.op.gg/champion/${summoner_champ}/statistics/${Line[answer]}/matchup?targetChampionId=${available_enemy_id_lists[i]}`;
								console.log(winrate_url3);
								const options3 = {
									method: "GET",
									uri : winrate_url3,
									headers : {
										'Accept-Language' : 'ko_KR,en;q=0.8',
										'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
									},
									encoding : null
								};
								
								request(options3, function(error, response, body){
									if(error){
										console.error(error);
										return;
									}
									if(response.statusCode === 200) {
										console.log("response3 ok;")
										const bodyDecoded = iconv.decode(body, 'utf-8');
										const $ = cheerio.load(bodyDecoded);
										const champion_winrate_list = [];
										const champion_winrates = $("div.champion-matchup-champion__winrate").toArray();
										//console.log(champion_winrates);
										champion_winrates.forEach((div) => {
											const winrates = $(div).text();
											champion_winrate_list.push(winrates);
										});
										//console.log(champion_winrate_list); [0] : 소환사 챔피언 승률 [1] : 상대 소환사 챔피언 승률
										console.log(summoner_champ,"의 승률 : ",champion_winrate_list[0]);
										console.log(another_summoner_champ,"의 승률 : ",champion_winrate_list[1]);
									}
								});
							}
						}
					}
					else{
						console.log("통계적으로 부족합니다!");
					}
				}
			});
			rl.close();
		});
		
		// 소환사들의 챔피언 승리 승률
		
		
		
	}
});
