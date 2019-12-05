(function($,sr){

  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
      var timeout;

      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null; 
          };

          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);

          timeout = setTimeout(delayed, threshold || 100); 
      };
  }
    // smartresize 
    jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');

/*global variables*/
var maxCardAllowed = 10;
var minCardAllowed = 2;
var question = [];
var finalAnswer = 0;
//var blueColor = ["#58C9C9","#BCF3F3","#84E0E0","#36AFAF","#1A9595","#58C9C9","#BCF3F3","#84E0E0","#36AFAF","#1A9595","#84E0E0"];//
var blueColor = ["#000022","#191938","#32324e","#f40000","#c10000","#2e9b9b","#000022","#191938","#32324e","#f40000","#c10000","#0000220"];
var bestScore = 0;
var shownBestScore = false;
var shownBestStreak = false;
var nickname = "";
var congratsMessages = ["Yaaay", "Excellent", "Correct", "Nice", "Outstanding", "Smart", "Brilliant"];
var streakCount = 0;
var bestStreak = 0;
var minStreak = 5;
var closeTheCards;
var awards = [5, 10, 20, 50, 100, 150, 200];
var sound = 0;
var otherAwards = [0,0,0];
var overallStreak = 0;
/*global variables*/

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[key] = value;
    });
    return vars;
  }

function onBackKeyDown() {
    // Handle the back button
    window.location.href = "home.html?nosplash";
}

function switchTheme(dark){
    localStorage.setItem("flashThemeDark", dark);
        if(dark == 1){
            $("body, .modal-content, .optionsHolder").css({
                "background":"#100c0c",
                "color":"white"
            })
            $(".playButton, .clearQuestion, .instruct").addClass("white");
            
            $(".settingsPage").css("background","black");
            $(".scoreLabel, #number, .record, .settings").addClass("white");
        }else{
            $("body, #cardHolderOutside, .settingsPage, .modal-content, .optionsHolder").removeAttr("style");
            $(".playButton, .scoreLabel, #number, .record, .settings, .clearQuestion, .instruct").removeClass("white");
        }
}

$(document).ready(function () {
    document.addEventListener("backbutton", onBackKeyDown, false);
    document.addEventListener("pause", onPause, false);
    var dark = localStorage.getItem("flashThemeDark");
    if(dark == "true"){
        $("#checkTheme").prop('checked', true);
        switchTheme(true);
    }
    //testAnim("body", "slideInRight faster");
    //sound effect
    //var arcUp = $(".arcUp").outerHeight(true);
    //$(".optionsHolder").css("bottom", arcUp + "px");
    $(".sound").on("click",function(){
        $(".sound").toggleClass("fa-volume-up fa-volume-off");
        sound = sound == 0 ? 1 : 0;
        localStorage.setItem("sound", sound);
        if(sound == 0){
        var audio = $('audio').get(2);
        audio.pause();
    }
    })
    
    $('#bestScoreDialog').on('hidden.bs.modal', function () {
        // do something…
        $("#congratsHolderMessage, .congratsPopUp").hide();
        getCards(true);     
    })
    
    $("#checkTheme").on("change", function(){
        var dark = $("#checkTheme").is(":checked");
        switchTheme(dark);
    })
    
    if (localStorage.getItem("sound") == null) {
		localStorage.setItem("sound", sound);
	} else {
		sound = parseInt(localStorage.getItem("sound"));
		if(sound == "1"){
            $(".sound").removeClass("fa-volume-off").addClass("fa-volume-up");
        }else{
            $(".sound").removeClass("fa-volume-up").addClass("fa-volume-off");
        }
	}
    
    //sound effect
    
    //otherAwards
    	
	if (localStorage.getItem("otherAwards") == null) {
		localStorage.setItem("otherAwards", otherAwards);
	} else {
		otherAwards = localStorage.getItem("otherAwards").split(",");
	}
    
    //otherAwards
    
    $("#goToMedals").on("click",function(){
        if(confirm("You will lose your progress if you leave")){
            window.location.href = "medals.html";
        }
    })
    
    $(window).smartresize(function(){  
        // code that takes it easy...
        if($(".cardHolder").hasClass("open")){
             //clear timer
            var myDiv = $( ".flipCard" );
            myDiv.clearQueue();
            myDiv.stop();
            //myDiv.finish();
            clearTimeout(closeTheCards);
            clearInterval(tm);
            showCards();
        }
    });
    
    $('#bestScoreDialog').on('shown.bs.modal', function (e) {
  // do something...
        //clap
        
        if(sound == 1) {
            setTimeout(function(){
                var x = document.getElementById("rightSound");
                x.play();
            },500)
            
        }
    })
    
	//show range
	$("#showCards").on("click", function () {
		if ($(this).hasClass("disabled")) {
			return
		} else {
			showCards();
		}
	})

    var range = document.getElementById('range');

   noUiSlider.create(range, {
    start: [1, 10],
    connect: true,
    range: {
        'min': 1,
        'max': 10
    },
       step:1,
       pips: {
        mode: 'steps',
        stepped: true,
        density: 10
    }
});

    var low = document.getElementById('low'),
    high = document.getElementById('high');

    // When the slider value changes, update the input and span
    range.noUiSlider.on('update', function( values, handle ) {
        if ( handle ) {
            high.innerHTML = parseInt(values[handle]);
        } else {
            low.innerHTML = parseInt(values[handle]);
        }
    });

	//show range
	$("#number, #numb").text(minCardAllowed);

	//get bestScore
	if (localStorage.getItem("bestScore") == null) {
		localStorage.setItem("bestScore", "0");
	} else {
		bestScore = parseInt(localStorage.getItem("bestScore"));
	}
	$("#bestScore").text(bestScore);
	//end of best score

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
	//end of get nickname
	$("#timer").text("0");
})

function onPause(){
    var audio = $('audio').get(2);
    audio.pause();
}

function saveNickName(){
    var name = $("#myNickName").val().trim();
    if(name != ""){
        localStorage.setItem("nickname", name);
        $('#collectNickName').hide();
        $("#nickname").text(name);
        $('#collectUserName').click();
    }else{
        alert("please choose nickname");
    }
}

function hideSettings(){
    $(".settingsPage").animate({"left":"-105vw"},500)
}

function showSettings(){
    /*$(".settingsPage").slideToggle("slow", function(){
        if($(".settingsPage").is(":visible")){
            $(".settings").text("Close");
        }else{
            $(".settings").text("Settings");
        }
    });*/
    $(".settingsPage").animate({"left":"0px"},500)
}

function testAnim(e,x) {
    $(e).addClass(x + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass(x + ' animated');
    });
  };

function getCards(streak){
    //clear timer
    clearTimeout(closeTheCards);
        //$(".cardHolder").removeClass("open");
    $(".progress-bar").css("width", "0%");
    clearInterval(tm);
    if(sound == 1){
        var audio = $('audio').get(2);
        audio.play();
    }
    $("#timer").text("0");
    
    /*if(tm != null){
        clearInterval(tm);
        $("#timer").text("0");
       }*/
      
    $(".cardHolder").empty();
    $(".instruct").show();
    //$(".cardHolder").animate({left: 0 + "%"},1000);
    var number = parseInt($("#number").text());
    var maxWidth = 150;
    var top = 4;
    var zindex = 0;
    question = [];
    for(var i = 1; i <= number; i++){
        zindex = number - i;
        var card = $("<div class='flipCard'></div");
        var spanSign = $("<span class='cardSignSpan'></span");
        var width = ($("#cardHolderOutside").width() - (2 * number)) / number;
        var showWidth = (width/$("#cardHolderOutside").width()) * 100;
        var font = width/2 > 60 ? 60 : width/2;
        //var width = ($(window).width() * 0.90) / number;

        //var width = 90 / number;
        var topDim = (top * (number - i)) - 4;
        //var width = (maxWidth - (i * 10)) + 10;
        //var margin = (maxWidth-width)/2;
        if(i == 1){
            var randNum = randomNumbers();
            var span = $("<span class='cardSpan'></span");
            $(span).text(randNum);
            question.push(randNum);
            spanSign = null;
        }else{
            var randNum = randomNumbers();
            var randSign = randomSign();
            var span = $("<span class='cardSpan'></span");
            $(spanSign).text(randSign);
            $(card).append(spanSign);
            $(span).text(randNum);
            question.push(randSign);
            question.push(randNum);
            
        }
        
        $(card).append(span);
        
        if(window.innerWidth > window.innerHeight){
            //landscape
            font *= 0.6;
        }
        
        //$(card).css({"width": width + "px", "margin-left": margin + "px", "top": top + "px", "z-index" : zindex});
        $(card).css({"top": topDim + "px", "z-index" : zindex, "width" : showWidth + "%", "font-size" : font + "px", "background-color" : blueColor[i]});
        $(".cardHolder").append(card);
    }
    calculate();
    $(".clearQuestion").text(question.join(" ") + " =");
    $(".clearQuestion").show();
    $(".clearQuestion").css("opacity","1");
}

function getCards2(streak){
    //clear timer
    clearTimeout(closeTheCards);
        //$(".cardHolder").removeClass("open");
    $(".progress-bar").css("width", "0%");
    clearInterval(tm);
    if(sound == 1){
        var audio = $('audio').get(2);
        audio.play();
    }
    $("#timer").text("0");
    
    /*if(tm != null){
        clearInterval(tm);
        $("#timer").text("0");
       }*/
      
    $(".cardHolder").empty();
    $(".instruct").show();
    //$(".cardHolder").animate({left: 0 + "%"},1000);
    var number = parseInt($("#number").text());
    var maxWidth = 150;
    var top = 4;
    var zindex = 0;
    question = [];
    for(var i = number; i > 0; i--){
        zindex = i;
        var card = $("<div class='flipCard'></div");
        var spanSign = $("<span class='cardSignSpan'></span");
        var width = ($("#cardHolderOutside").width() - (2 * number)) / number;
        var showWidth = (width/$("#cardHolderOutside").width()) * 100;
        var font = width/2 > 60 ? 60 : width/2;
        //var width = ($(window).width() * 0.90) / number;

        //var width = 90 / number;
        var topDim = (top * i) - 4;
        //var width = (maxWidth - (i * 10)) + 10;
        //var margin = (maxWidth-width)/2;
        if(i == 1){
            var randNum = randomNumbers();
            var span = $("<span class='cardSpan'></span");
            $(span).text(randNum);
            question.push(randNum);
            spanSign = null;
        }else{
            var randNum = randomNumbers();
            var randSign = randomSign();
            var span = $("<span class='cardSpan'></span");
            $(span).text(randNum);
            $(spanSign).text(randSign);
            question.push(randNum);
            question.push(randSign);
        }
        
        $(card).append(span);
        
        if(spanSign != null){
            $(card).append(spanSign);
        }
        
        if(window.innerWidth > window.innerHeight){
            //landscape
            font *= 0.6;
        }
        
        //$(card).css({"width": width + "px", "margin-left": margin + "px", "top": top + "px", "z-index" : zindex});
        $(card).css({"top": topDim + "px", "z-index" : zindex, "width" : showWidth + "%", "font-size" : font + "px", "background-color" : blueColor[i]});
        $(".cardHolder").append(card);
    }
    calculate();
    $(".clearQuestion").text(question.join(" ") + " =");
    $(".clearQuestion").show();
    $(".clearQuestion").css("opacity","1");
}

function cardNumber(sign){
    var number = parseInt($("#number").text());
    if(sign == '-'){
        number -= 1;
        number = number < minCardAllowed ? minCardAllowed : number;
    }
    if(sign == '+'){
        number += 1;
        number = number > maxCardAllowed ? maxCardAllowed : number;
    }
    $("#number, #numb").text(number);
}

function randomNumbers(){
    //var rand = Math.floor(Math.random() * 11);
    var min = parseInt($("#low").text());
    var max = parseInt($("#high").text()) + 1;
    var rand = Math.floor(Math.random() * (max - min) + min);
    return rand;
}

function randomSign(){
    //var searchParams = new URLSearchParams(window.location.search);
    var type = getUrlVars()["type"]; //searchParams.get('type');
    var signs = ["+", "-", "*"];
    var rand = 0;
    if(type == "1"){
        rand = 0;
    } else if(type == "2"){
        rand = 1;
    } else if(type == "3"){
        rand = 2;
    } else if(type == "4"){
        rand = Math.floor(Math.random() * 2);
    }else{
        rand = Math.floor(Math.random() * 2);
    }
        
    return signs[rand];
}

function calculate(){
    var total = 0;
    for(var i = 0; i < question.length; i++){
        if(i % 2 != 0 && i - 1 == 0){
            var before = question[i - 1];
            var aft = (i + 1 ) > question.length ? question.length : (i + 1);
            var after = question[aft];
            total = maths(before, question[i], after);
        }else if(i % 2 != 0 && i - 1 > 0){
            var before = total;
            var aft = (i + 1 ) > question.length ? question.length : (i + 1);
            var after = question[aft];
            total = maths(total, question[i], after);
        }
    }
    createAnswers(total);
}

function maths(first, sign, second){
    var res = 0;
    if(sign == "+"){
        res = first + second;
    }else if(sign == "-"){
        res = first - second;
    }else if(sign == "*"){
        res = first * second;
    }else if(sign == "\*"){
        //res = first \ second;
    }
    return res;
}

function createAnswers(value){
    var options = [];
    options.push(value - 4);
    options.push(value - 2);
    options.push(value);
    options.push(value + 4);
    options.push(value + 2);
    var optionShuff = shuffle(options);
    $(".optionsHolder").empty();
    for(var i = 0; i < optionShuff.length; i++){
        var but = $('<a/>', {
        text: optionShuff[i], //set text 1 to 10
        id: 'option_'+i,
        class: 'answers',
        click: function () { findAnswer(this); }
        });

        $(".optionsHolder").append(but);
    }
    //var addTop = Math.floor($("#cardHolderOutside").height()) + 40;
    //$(".congratsHolder").css("margin-top", addTop + "px");
    console.log(value);
    finalAnswer = value;
    showCards();
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

var trial = 0;
var maxScore = 5;
var maxAttainable = 0;

function findAnswer(but){
    $(but).off("click");
	var showNow = true;
	var messages = 0;
	$("#winnerMessage").text("");
    var opt = parseInt($(but).text());
    if(sound == 1){
        var audio = $('audio').get(2);
        audio.pause();
    }
    
    if(opt == finalAnswer){
        checkOtherAwards();
        var x = document.getElementById("rightSound");
        if(sound == 1) {x.play();}
        //alert("right");
        clearTimeout(closeTheCards);
        //$(".cardHolder").removeClass("open");
        $(".progress-bar").css("width", "0%");
        clearInterval(tm);
        
        //random congrats message
        var rand = Math.floor(Math.random() * congratsMessages.length);
        var msg = congratsMessages[rand];
        $("#congratsHolderMessage").text(msg);
        $("#congratsHolderMessage, .congratsPopUp").show();
        //random congrats message
        
        $(".cardHolder").removeClass("open");
        var score = maxScore - trial;
        $("#scoreMessage").text("+" + score);
        var totscore = parseInt($("#score").text()) + score;
        $("#score").text(totscore);
        $("#currScore").text(score);

        //record streak
        streakCount += 1;
        overallStreak += 1;

        //get bonus point
        if (awards.indexOf(overallStreak) > -1) {
        	//wonAward();
        	var totscore = parseInt($("#score").text());
        	totscore += 50;
        	$("#score").text(totscore);
        	/*if (totscore > bestScore) {
        		bestScore = totscore;
        		localStorage.setItem("bestScore", bestScore);
        	}*/
        	maxAttainable += 50;
        	$("#maxScore").text(maxAttainable);
        }

        //creating best score
        if(totscore > bestScore){
            //celebrate new best score
            if(!shownBestScore && ((streakCount >= (minStreak + 1)) || (overallStreak >= (minStreak + 1)))){
            	showNow = false;
            	messages += 1;
            	showModal("Images/bestScore.gif", "<span>New Best Score</span>", messages);
                shownBestScore = true;
            }
            bestScore = totscore;
            localStorage.setItem("bestScore", bestScore);
           }
           
		   maxAttainable += 5;
           $("#bestScore").text(bestScore);
           $("#maxScore").text(maxAttainable);
           trial = 0;
        
        if((streakCount > bestStreak) || (overallStreak > bestStreak)){
            if((!shownBestStreak && streakCount >= minStreak) || (!shownBestStreak && overallStreak >= minStreak)){
            	showNow = false;
            	messages += 1;
            	showModal("Images/streak.gif", "<span>New Best Streak</span>", messages);
                shownBestStreak = true;
               }
            bestStreak = overallStreak > streakCount ? overallStreak : streakCount;
            localStorage.setItem("bestStreak", bestStreak);
            $("#bestStreak").text(bestStreak);
            
			//vibrate award icon
			if (awards.indexOf(bestStreak) > -1) {
				wonAward();
			}
        }
        
        //try growing cards
        if($("#checkGrowing").is(":checked")){
            if((streakCount % 10 == 0) && (streakCount != 0)){
                
                if(number.innerText == "10"){
                    if(streakCount == 10){
                    	showNow = false;
                    	messages += 1;
            	       showModal("Images/streak.gif", "<span>Max card reached</span><br><span>+100 points extra</span>", messages);
                        var totscore = parseInt($("#score").text());
        	            totscore += 100;
        	           $("#score").text(totscore);
                        maxAttainable += 100;
        	           $("#maxScore").text(maxAttainable);
                        if(totscore > bestScore){
                            bestScore = totscore;
                            localStorage.setItem("bestScore", bestScore);
                            messages += 1;
                            showModal("Images/bestScore.gif", "<span>New Best Score</span>", messages);
                        }
                    }
                    
                }else{
            	     	showNow = false;
            	     	messages += 1;
            	showModal("Images/streak.gif", "One more card added.", messages);
                   cardNumber('+');
                   streakCount = 0; 
                }                
            }
        }
       
       $("#streakCount").text(streakCount);
        
        //show congrats and start again
        if(showNow){
            setTimeout(function(){
                $("#congratsHolderMessage, .congratsPopUp").hide();
                getCards(true);
            },500)
        //show congrats and start again
        }
    }else{
        //failed answer
        $(but).animate({"opacity":0}, 500);
        //$(but).off("click");
        trial += 1;
        var x = document.getElementById("wrongSound");
        if(sound == 1) {x.play();}
    }
      }

      function showModal(image, text, messages) {
      	if ($("#bestScoreDialog").is(":visible") || (messages > 1)) {
      		var texts = $("#winnerMessage").html();
      		texts += "<br>" + text;
      		$("#winnerMessage").html(texts);
      	} else {
      		$("#winnerMessage").html(text);
      		$("#winnerImage").attr("src", image);
      		$('#bestScoreDialog').modal('toggle');
		}
	  }

var secondsopener = 1000;
var myopener = 50;
var timer = 0;
var tm = null;

//var seconds = parseInt($("#seconds").val());
function showCards(){
    
    //align flipcards in the middle
    //var holdLeft = ($(window).width() - (5.2 * $(".flipCard").length)) - ($(".flipCard").eq(0).width() * $(".flipCard").length);
    //$(".cardHolder").css("left", holdLeft/2 + "px");
    
    
    var seconds = parseInt($("#seconds").val());
    
    /*for(var i = $(".flipCard").length; i > 0; i--){
        var w = $(".flipCard").eq(0).css("width");
        w = parseInt(w.replace("px", ""));
        //w = (w / $(window).width()) * 100
        //w += (15 / $(window).width());
        w += 5;
        w *= i;
        //$(".card").eq(i).css("left", w + "px");
        $(".flipCard").eq(i).animate({left: w + "px"},myopener);
    }*/
    $(".flipCard").css("left", "0px");
    $(".flipCard").removeClass("absFlipCard");
    $(".clearQuestion").css("opacity","1");
    testAnim(".flipCard", "flipInY");
    $(".cardHolder").addClass("open");
   
    //adjust parent height
    var h = $(".flipCard").eq(0).css("height");
    h = parseInt(h.replace("px",""));
    h+= 50;
    //$(".cardHolder").css("height", h + "px");
    
    //adjust parent height
    //closeTheCards = setTimeout(closeCards, secondsopener + 3000);
    closeTheCards = setTimeout(closeCards, 500);
    //$("#showCards").attr("disabled","disabled");
    $("#showCards").addClass("disabled");
}
var originalTimer;
function closeCards(){
    //if($(".cardHolder").hasClass("open")){
        var seconds = parseInt($("#seconds").val());
        //$(".flipCard").delay((seconds * $(".flipCard").length)).animate({left: "0px"},myopener);
        timer = ((seconds * $(".flipCard").length) / 1000) + 1;
        originalTimer = timer;
        $(".progress-bar").removeClass("bg-danger");
        $("#timer").removeClass("text-danger");
        $(".progress-bar").css("width", "100%");
        tm = setInterval(countDown,1000);
    //}
}


function middle(){
    var par = $(".cardHolder").width();
       var child = $(".flipCard").eq(0).width();
       var mar = (par/2)-(child/2);
        mar = (mar/par) * 100;
       //$(".cardHolder").css("margin-left", mar + "%");
    $(".cardHolder").animate({left: mar + "%"},1000, function(){
    });
}

function countDown(){
    timer--;
   if(timer == 0){
      clearInterval(tm);
      //$("#showCards").attr("disabled", false);
       var pap = (Math.floor($(".cardHolder").eq(0).width()) / 2);
       var child = (Math.floor($(".flipCard").eq(0).width()) / 2);
       var diff = pap - child;
       $(".flipCard").css("left", diff + "px");
       $(".clearQuestion").css("opacity","0");
       $(".flipCard").addClass("absFlipCard");
      $("#showCards").removeClass("disabled");
   }
    $("#timer").text(timer);
    var cent = Math.floor((timer / originalTimer) * 100);
    if(cent < 50){
       $(".progress-bar").addClass("bg-danger");
       $("#timer").addClass("text-danger");
    }
    $(".progress-bar").css("width", cent + "%");
    
   }

   function wonAward() {
   	
	$(".fa-trophy").addClass("shake");
   	setTimeout(function () {
   		$(".fa-trophy").removeClass("shake");
   	}, 1000)
   
   }

function checkOtherAwards(){
    var number = $(".flipCard").length;
    //var searchParams = new URLSearchParams(window.location.search);
    var type = getUrlVars()["type"]; //searchParams.get('type');
    if((number >= 5 && number < 10) && otherAwards[0] == "0"){
        otherAwards[0] = "1";
        localStorage.setItem("otherAwards", otherAwards);
        wonAward();
    }
    if(number == 10 && otherAwards[1] == "0"){
        otherAwards[1] = "1";
        localStorage.setItem("otherAwards", otherAwards);
        wonAward();
    }
    if(type == "4" && otherAwards[2] == "0"){
        otherAwards[2] = "1";
        localStorage.setItem("otherAwards", otherAwards);
        wonAward();
    }
}

function testSlide(){
    anime({
      targets: '.flipCard',
      left: function(el, i) {
            return i * ($(".flipCard").eq(0).width() + 5);
        },
    direction: "alternate",
    duration:1000,
    endDelay: parseInt($("#seconds").val()) * $(".flipCard").length
        /*,
      direction: 'alternate',
      loop: true,
      delay: function(el, i, l) {
        return i * 100;
      },
      endDelay: function(el, i, l) {
        return (l - i) * 100;
      }*/
    });
}