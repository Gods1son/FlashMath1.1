/*global variables*/
var bestScore = 0;
var nickname ="";
var bestStreak = 0;
/*global variables*/

function testAnim(e,x) {
    $(e).addClass(x + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass(x + ' animated');
    });
  };

function showSplashNew(){
    $("#splash").show();
    $(".progress-bar").animate({"width":"100%"},{
        duration: 1500,
        complete: function(){
            testAnim("#splash", "slideOutLeft faster");
            setTimeout(function(){
                $("#splash").hide();
                $("#mainBody").show();
                //testAnim("#mainBody", "fadeIn faster");
                testAnim("#mainBody", "slideinLeft faster");
                setTimeout(function(){getName()},500)
            },400)
            
        }
    });
}

function onBackKeyDown() {
    // Handle the back button
    window.plugins.appMinimize.minimize();
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
    if(window.location.href.indexOf("nosplash") == -1){
        showSplashNew();
         //getName();
    }else{
        $("#mainBody").show();
        if(localStorage.getItem("nickname") != null){
            nickname = localStorage.getItem("nickname");
            $("#nickname").text(nickname);
        }
       // getName();
        //$(".splashScreen").remove();
    }
    
    //resize button
    //var long = $(".chooseType").eq(2).outerWidth() + 20;
    //$(".chooseType").css("width", long + "px")
    var dark = localStorage.getItem("flashThemeDark");
    if(dark == "true"){
        $("#checkTheme").prop('checked', true);
        switchTheme(true);
    }
    
    //get bestScore
    if(localStorage.getItem("bestScore") == null){
        localStorage.setItem("bestScore", "0");
    }else{
        bestScore = parseInt(localStorage.getItem("bestScore"));
    }
    $("#bestScore").text(bestScore);
    //end of best score
    
      //get bestStreak
    if(localStorage.getItem("bestStreak") == null){
        localStorage.setItem("bestStreak", "0");
    }else{
        bestStreak = parseInt(localStorage.getItem("bestStreak"));
    }
    $("#bestStreak").text(bestStreak);
    //end of bestStreak
    
    $(".chooseType").on("click", function(){
        var data = $(this).attr("data-type");
        window.location.href = "index.html?type=" + data;
    })
    
})

function getName(){
    //get nickname
    if(localStorage.getItem("nickname") == null){
        $('#collectUserName').click();
    }else{
        nickname = localStorage.getItem("nickname");
        $("#nickname").text(nickname);
    }
    //end of get nickname
}

function showSplash(){
     var number = 4;
    var maxWidth = 150;
    var top = 4;
    var zindex = 0;
    question = [];
    var signs = ["+","-","*","/"];
    var count = 0;
    var blueColor = ["#000022","#191938","#32324e","#f40000","#c10000","#58C9C9","#000022","#191938","#32324e","#f40000","#c10000","#0000220"];
    for(var i = number; i > 0; i--){
        zindex = i;
        var card = $("<div class='flipCard'></div");
        var width = ($(window).width() - (5.2 * number)) / number;
        var showWidth = 21; //(width/$(window).width()) * 100;
        var font = width/2 > 60 ? 60 : width/2;
        //var width = ($(window).width() * 0.90) / number;

        //var width = 90 / number;
        var topDim = (top * i) - 4;
        //var width = (maxWidth - (i * 10)) + 10;
        
        var span = $("<span class='cardSpan'></span");
        $(span).text(signs[count]);
        count++;
        $(card).append(span);
        
        //$(card).css({"width": width + "px", "margin-left": margin + "px", "top": top + "px", "z-index" : zindex});
        $(card).css({"top": topDim + "px", "z-index" : zindex, "width" : showWidth + "%", "font-size" : font + "px", "background-color" : blueColor[i]});
        $(".logoHolder").append(card);
    }
    showCards();
}

//var seconds = parseInt($("#seconds").val());
var secondsopener = 1000;
function showCards(){
    
    //$(".cardHolder").css("margin-left", "");
    
    var seconds = parseInt($("#seconds").val());
    for(var i = $(".flipCard").length; i > 0; i--){
        var w = $(".flipCard").eq(0).css("width");
        w = parseInt(w.replace("px",""));
        w += 5;
        w *= i;
        //$(".card").eq(i).css("left", w + "px");
        $(".flipCard").eq(i).animate({left: w + "px"},secondsopener);
    }
    
    $(".cardHolder").addClass("open");
   
    //adjust parent height
    var h = $(".flipCard").eq(0).css("height");
    h = parseInt(h.replace("px",""));
    h+= 50;
    //$(".cardHolder").css("height", h + "px");
    
    //adjust parent height
    setTimeout(function(){
        $(".splashScreen").remove();
        getName();
    }, secondsopener + 1000);
    //$("#showCards").attr("disabled","disabled");
    //$("#showCards").addClass("disabled");
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
        $("#myNickName").focus();
    }
}