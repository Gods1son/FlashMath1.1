var awards = [5, 10, 20, 50, 100, 150, 200];

var bestStreak = 0;
var otherAwards = [0,0,0];

function onBackKeyDown() {
    // Handle the back button
    window.location.href = "home.html?nosplash";
}

function switchTheme(dark){
    localStorage.setItem("flashThemeDark", dark);
        if(dark == 1){
            /*$("body, .bgHiglight").css({
                "background":"black",
                "color":"white"
            })*/
            $("body").addClass("black");
        }else{
            //$("body, .bgHiglight").removeAttr("style");
            $("body").removeClass("black");
        }
}

$(document).ready(function () {
   document.addEventListener("backbutton", onBackKeyDown, false);
    	//get bestScore
	if (localStorage.getItem("bestScore") == null) {
		localStorage.setItem("bestScore", "0");
	} else {
		bestScore = parseInt(localStorage.getItem("bestScore"));
	}
	$("#bestScore").text(bestScore);
	//end of best score
    
    var dark = localStorage.getItem("flashThemeDark");
    if(dark == "true"){
        $("#checkTheme").prop('checked', true);
        switchTheme(true);
    }
    
    //otherAwards
    	
	if (localStorage.getItem("otherAwards") == null) {
		localStorage.setItem("otherAwards", otherAwards);
	} else {
		otherAwards = localStorage.getItem("otherAwards").split(",");
	}
    
    //otherAwards

	//get bestStreak
	if (localStorage.getItem("bestStreak") == null) {
		localStorage.setItem("bestStreak", "0");
	} else {
		bestStreak = parseInt(localStorage.getItem("bestStreak"));
	}
	$("#bestStreak").text(bestStreak);
	//end of bestStreak

	//get nickname
	if (localStorage.getItem("nickname") == null) {
		//$('#collectUserName').click();
	} else {
		nickname = localStorage.getItem("nickname");
		$("#nickname").text(nickname);
	}
    
	createAwards();

	fillAwards();
})

function createAwards() {
	var html = "<div class='row' style='width:100%;'>";
	for (var i = 0; i < awards.length; i++) {
		var number = awards[i];
		var text = "streak";
		html += "<div class='col-3 award text-center'>";
		html += "<div class='awardNumber'><span class='actNumber'>" + number + "</span>";
		html += "<div class='awardText'>" + text + "</div></div>";
		html += "</div>";
	}
	
	//<i class="fa fa-trophy" style="color: goldenrod;"></i>
	
    
    for(var i = 0; i < otherAwards.length; i++){
        if(i < 2){
            var number = 5 * (i + 1);
             number = i == 0 ? "> 4" : number;
		      var text = "cards";
		      html += "<div class='col-3 award text-center'>";
		      html += "<div class='awardNumber'><span class='actNumber cards'>" + number + "</span>";
		      html += "<div class='awardText'>" + text + "</div></div>";
		      html += "</div>";
        }
            
        if(i == 2){
            html += "<div class='col-3 award text-center'>";
		    html += "<div class='awardNumber'><span class='actNumber cards'></span><div class='awardMixedLabel'>Mixed</div></div>";
		      //html += "<div class='awardText'>" + text + "</div></div>";
		      html += "</div>";
        }
    }
    
    html += "</div>";
    $("#choosegameinner").append(html);
}

function fillAwards() {
	var len = $(".awardNumber").not(".cards").length;
	for (var i = 0; i < len; i++) {
		if (bestStreak >= parseInt($(".awardNumber").eq(i).find(".actNumber").not(".cards").text())) {
			$(".awardNumber").not(".cards").eq(i).append("<div class='awardWin'><i class='fa fa-trophy'></i></div>");
		}
	}
    
    for(var i = 0; i < otherAwards.length; i++){
        if(otherAwards[i] == "1"){
            $(".actNumber.cards").eq(i).parents(".awardNumber").eq(0).append("<div class='awardWin'><i class='fa fa-trophy'></i></div>");
        }
    }
}