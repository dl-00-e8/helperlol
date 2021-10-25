const request = require('request');
const cheerio = require("cheerio");  // 스크래핑
const iconv = require("iconv-lite"); // 인코딩

var username = "haoyunsenming"; // 입력 받을 값

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
		const blue_users_list = [];
		const red_users_list = [];
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
		if(blue_team.includes(username)) {
			console.log('\n');
			console.log(username,"은 블루팀입니다.");
		}
		else{
			console.log('\n');
			console.log(username,"은 레드팀입니다.");
		}
	}
});
