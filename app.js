phantom.casperPath = './node_modules/casperjs';
phantom.injectJs('./node_modules/casperjs/bin/bootstrap.js');
 
var fs = require('fs')
var userInfo = [{name:'name', birth:'birth'}]; 
var friendListLength = 0;
var casper = require('casper').create({
	    pageSettings: {
		            loadImages: false,//The script is much faster when this field is set to false
			            loadPlugins: false,
				            userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36'
						        }
});
 
//open Facebook
casper.start().thenOpen("https://facebook.com", function() {
    console.log("Facebook website opened");
    });
   
//로그인
casper.then(function(){
         console.log("해당 id와 pw로 로그인 합니다.");
         this.evaluate(function(){
               document.getElementById("email").value="shdmscjf2@naver.com";
               document.getElementById("pass").value="dl5013dl@@";
               document.getElementById("loginbutton").children[0].click();
         });
});
//친구 탭으로 들어간뒤 친구 홈으로 들어가기 
casper.thenOpen("https://www.facebook.com/profile.php?sk=friends&source_ref=pb_friends_tl",function(){
	console.log("Friend website opend");
	this.evaluate(function(){
		var x = document.getElementById("pagelet_timeline_medley_friends").children[1].children[0].children[1].children[1].children[0].children[0];
	var y = document.getElementById("pagelet_timeline_medley_friends").children[1].children[0].children[1];
		friendListLength = y.childNodes.length;
		//console.log(y.childNodes.length);
		//console.log(y.children[1]);
		x.click();
	});
});
// 친구 정보 클릭
casper.then(function(){
	this.evaluate(function(){
		var x = document.getElementById("timeline_top_section").children[0].children[2].children[0].children[1].children[1].children[0].children[0].children[1];
		x.click();
	});
});
// 친구 정보 파싱
casper.then(function(){
	var info = this.evaluate(function(){
		var y = document.getElementById("pagelet_timeline_medley_about").children[1].children[0].children[0].children[0].children[0].children[1].children[0].children[0].children[1].children[0].children[1].children[0].children[1].children[0].children[1];

		var name = document.getElementById("fb-timeline-cover-name")
		console.log(y.innerHTML);
		console.log(name.innerHTML);
		var info = {};
		info.name = name.innerHTML;
		info.birth = y.innerHTML;
		return info;
	});
	userInfo.push(info);
	console.log(JSON.stringify(info));
});
casper.thenEvaluate(function(userInfo){
	console.log(JSON.stringify(userInfo));
},userInfo);

//친구 모두 보기
//casper.then(function(){
//	console.log("모든 친구리스트를 봅니다.");
//	this.evaluate(function(){
//		var a = document.getElementById("u_0_4");
//		console.log(a.className);
//	});
//});
//                                                  
//스크린샷 찍고 페이지 저장하기
casper.then(function(){
       console.log("3초 후에 AfterLogin.png 으로 저장됩니다.");
       this.wait(3000, function(){
// After 6 seconds, this callback will be called, and then we will capture:
	       this.capture('AfterLogin.png');
               fs.write("./hello.html", this.getHTML(), "w")
       });
});
//이미지 주소 받아오기
casper.then(function(){

	var images = this.evaluate(function(){
                 var facebookImages = document.getElementsByTagName('img');
                 var allSrc = [];
                 for(var i = 0; i < facebookImages.length; i++) {
                         if(facebookImages[i].height >= 100 && facebookImages[i].width >= 100)
                          allSrc.push(facebookImages[i].src);
                  }
        	return JSON.stringify(allSrc);
	 });
         console.log(images);
})

casper.on('remote.message', function(msg) {
	    this.echo('remote message caught: ' + msg);
})

casper.run();
//
