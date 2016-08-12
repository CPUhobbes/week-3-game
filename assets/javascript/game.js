/*
 *Global Variables
 */
var soundEnabled = false;
var enableStillScreen = false;
var	videoDir = "assets/video/";
var videoExt = ".mp4";
var noAudioTag = "_noaudio";
var audioDir = "assets/audio/";
var audioExt = ".mp3";
var acceptKeyPress = false;
var videoPlaying = false;

//filenames without extensions
var correctGuessVideo = ["hit1", "hit2", "hit3"];
var wrongGuessVideo =  ["miss1","miss2", "miss3"];
var winVideo = "win";
var loseVideo = "lose";
var titleScreenVideo = "titleScreen";
var startVideo = "start";
var audioList = ["topgun1", "topgun2","topgun3","topgun4"];

//Game Mechanics variables
var start=true;
var word ="";
var dictionary = ["STABILIZER", "TURBINE", "COCKPIT", "MISSILE", "TOMCAT", "MAVERICK", "GOOSE", "ICEMAN", 
				  "VOLLEYBALL", "MOTORCYCLE", "HELICOPTER", "CARRIER", "BANDIT", "BOGEY", "CHARLIE", "SIDEWINDER"];
var numGuesses;
var correctGuesses;
var guessArray;
var wins = 0;
var loses = 0;
var endGame;

/*
 *Load sound button and video on start
 */
$(document).ready(function(){

		//modal sound menu
		$("#myModal").modal('show');

		//video ends, show title still screen
		$("#Video1").on('ended',myHandler);

		randomAudio = Math.ceil(Math.random()*4)-1;  //random song selection
		changeAudio(randomAudio);

		animateJet();

});

//Play sound if option is selected
function sound(selection){
	soundEnabled = selection;
	acceptKeyPress = true;
	if (soundEnabled){
		playAudio();
	} 

}

/*
 *Video and Audio Controls
 *
 * Did not use JQuery for video/audio controls as there may be performance issues
 */

function changeVideo(videoFile){
	enableStillScreen = true;
	var video = document.getElementById("Video1");  
	if(soundEnabled){
		
		$("#videosrc").attr("src", videoDir+videoFile+videoExt);
	}
	else {
		$("#videosrc").attr("src", videoDir+videoFile+noAudioTag+videoExt);
	}
	try {
		video.pause();
		video.load();
		setTimeout(function() {video.play();}, 400); //Allows video to load and play without getting .play() errors
	}
	catch(e){
		console.log(e);
	}

}

//Checks to see if video is finished
function myHandler(e) {  
	if(enableStillScreen){
    	changeVideo(titleScreenVideo);
    	if(soundEnabled){
    		playAudio();
		}
	}
    enableStillScreen = false;
    videoPlaying = false;
}

function pauseAudio(){
	var audio = document.getElementById("audio1");
	audio.pause();
}
function playAudio(){
	var audio = document.getElementById("audio1");
	audio.play();
}
function changeAudio(audioFile){
	$("#audio1").attr("src", audioDir+audioList[audioFile]+audioExt);

}


/*
 *Game Mechanics
 */   

document.onkeyup = function(event){
	
	//Waits for sound selection before allowing key presses
	if(acceptKeyPress){ 
		var keyPress = String.fromCharCode(event.keyCode).toUpperCase();

		//verifies that the game hasn't been started previously
		if (keyPress && start) { 
			start=false;
			startGame();
		}
		else{

			/*
			 *	verifies that only 1 char has been pressed, matches regex (only letters beccause that is how 
			 	hangman should be played), letter hasn't been guessed, and the game isn't over
			 *
			 */
			if(keyPress.length === 1 && keyPress.match(/[a-z]/i)&& alreadyGuessed(keyPress) && !endGame){
				$("#lettersGuessed").append(" "+keyPress);
				guessArray.push(keyPress);		//add guessed letter to array so letter will not be guessed again
				
				//check to see if letter is in word
				if(word.indexOf(keyPress) > -1){ 
					for(var i=0;i<word.length;++i){ 
						if(word.charAt(i) == keyPress){
							$("#letterID_"+i).html(keyPress);
							correctGuesses+=1;
						}
					}
					
					if(correctGuesses == word.length){
						endgame(true);
					}
					else{
						pauseAudio();
						changeVideo("hit"+Math.ceil(Math.random()*correctGuessVideo.length)); 	//random correct video
					}
				}
				
				else{
					//Reduce number of guesses and check to see if end of game
					numGuesses-=1;
					$("#guessesRemaining").html(numGuesses);
					if(numGuesses == 0){
						endgame(false);
					}
					else{
						pauseAudio(); 
						changeVideo("miss"+Math.ceil(Math.random()*wrongGuessVideo.length)); // random miss video
					}
				}
			}
		}
	}
}

//Starting conditions for game
function startGame(){	
	var audio = document.getElementById("audio1");
	audio.pause();
	changeVideo("start");
	randomWordNum = Math.ceil(Math.random()*dictionary.length); //random word from dictionary is selected
	word = dictionary[randomWordNum-1];
	numGuesses = 7;
	correctGuesses=0;
	guessArray = new Array();
	$("#lettersGuessed").empty();
	$("#letterBox").html(generateWordBox(word.length));
	$("#guessesRemaining").html(numGuesses);
	writeScore();
	$(".buttonControl").css({"visibility": "hidden"});
	endGame = false;
}

//Generate <div>'s based on number of letters in word
function generateWordBox(numTimes){
	var output= "";
	for(var i = 0; i< numTimes; ++i){
		output+="<div class =\"letter\" id=\""+"letterID_"+i+"\">&nbsp;</div><div class=\"letterSpacer\"></div>";

	}
	return output;
}

//check array to see if letter has been guessed
function alreadyGuessed(letterCheck){
	if(guessArray.indexOf(letterCheck)>-1)
		return false;
	else
		return true;
}

//End game scenerios
function endgame(win){
	if(win){
		wins+=1;
		pauseAudio();
		changeVideo("win");
		$("#playAgain").attr("class", "btn btn-default btn-success buttonControl");
		$("#playAgain").html("You Won! Play Again?");
	}
	else{
		loses+=1;
		pauseAudio();
		changeVideo("lose");
		$("#playAgain").attr("class", "btn btn-default btn-danger buttonControl");
		$("#playAgain").html("You Lost! Play Again?");
		
		//Show word
		for(var i=0;i<word.length;++i){ 

			$("#letterID_"+i).html(word[i]);
		}
	}
	writeScore();
	$(".buttonControl").css({"visibility": "visible"});
	endGame = true;
}

function writeScore(){
	$("#scoreWin").html(wins);
	$("#scoreLose").html(loses);
}

function animateJet(){
	setTimeout(function() {
		$(".jet").css({"display": "initial"});
	    var xPos = $( document ).width();
	    var yPos = $( document ).height();

	   	var jetYPos = yPos*Math.random();

	   	//Prevent Jet image from being off screen during animation (#25 is a spacer from window)
	   	if(jetYPos<$(".jet").height()){
	   		jetYPos = $(".jet").height()+25;
	   	}
	   	else if(jetYPos>yPos-$(".jet").height()){
	   		jetYPos=yPos - $(".jet").height()-25;
	   	}

	   	//Animate Jet left to right
	    if(Math.round(Math.random()) == 1){
	    	//Flip image in direction of travel
	        $(".jet").css({"-moz-transform": "scale(1, 1)", "-webkit-transform": "scale(1, 1)","transform": "scale(1, 1)"});
	        
	        $(".jet").css({top: jetYPos, left: xPos});
	        $( ".jet" ).animate(
	                        {left: "0"-$(".jet").width()},
	                        7000,
	                        animateJet);
		}   
		//Animate Jet Righ to left
		else{
			//Flip image in direction of travel
	        $(".jet").css({"-moz-transform": "scale(-1, 1)", "-webkit-transform": "scale(-1, 1)","transform": "scale(-1, 1)"});

	        $(".jet").css({top: jetYPos, left: 0-$(".jet").width()});
	        $( ".jet" ).animate(
	                        {left: xPos},
	                        7000,
	                        animateJet);
		}
	//Animation Time
	}, 2000);

}