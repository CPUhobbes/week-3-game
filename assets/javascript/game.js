/*
 *Global Variables
 */

var soundEnabled = false;
var enableStillScreen = false;
var	videoDir = "assets/video/";
var videoExt = ".mp4";
var noAudioTag = "_noaudio";

//filenames without extensions
var correctGuessVideo = ["hit1", "hit2"];
var wrongGuessVideo =  ["miss1","miss2"];
var winVideo = "win";
var loseVideo = "lose";
var titleScreenVideo = "titleScreen";
var startVideo = "start";

//Game Mechanics
var start=true;
var word ="";
var dictionary = ["STABILIZER", "TURBINE", "COCKPIT", "MISSILE", "TOMCAT", "MAVERICK", "GOOSE", "ICEMAN", "VOLLEYBALL", "MOTORCYCLE", "HELICOPTER", "CARRIER"];
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
		$("#myModal").modal('show');
		document.getElementById('Video1').addEventListener('ended',myHandler,false);

		//Set startup video here so if video changes above no need to edit html
		document.getElementById('videosrc').src=videoDir+titleScreenVideo+videoExt;
		document.getElementById("Video1").load();
});
function sound(selection){
	this.soundEnabled = selection;
	if (soundEnabled){
		var audio = document.getElementById("audio1");
		audio.play();
	} 

}

/*
 *Video and Audio Controls
 */

function changeVideo(videoFile){
	enableStillScreen = true;
	var video = document.getElementById("Video1");
	var source = document.getElementById('videosrc');
	if(soundEnabled){
		source.src=videoDir+videoFile+videoExt;
	}
	else {
		source.src=videoDir+videoFile+noAudioTag+videoExt;
	}
	video.load();
	video.play();

}


    function myHandler(e) {
    	if(enableStillScreen){
        	changeVideo(titleScreenVideo);
        	if(soundEnabled){
        		var audio = document.getElementById("audio1");
				audio.play();
			}
    	}
        enableStillScreen = false;

    }


/*
 *Game Mechanics
 */   

document.onkeyup = function(event){
	var keyPress = String.fromCharCode(event.keyCode).toUpperCase();
	if (keyPress && start) {
		start=false;
		var audio = document.getElementById("audio1");
		audio.pause();
		changeVideo("start");
		startGame();
	}
	else{
		if(keyPress.length === 1 && keyPress.match(/[a-z]/i)&& alreadyGuessed(keyPress) && !endGame){
			document.getElementById("lettersGuessed").innerHTML+=" "+keyPress;
			guessArray.push(keyPress);
			

			if(word.indexOf(keyPress) > -1){
				for(var i=0;i<word.length;++i){
					if(word.charAt(i) == keyPress){
						document.getElementById("letterID_"+i).innerHTML=keyPress;
						correctGuesses+=1;
					}
				}
				
				if(correctGuesses == word.length){
					endgame(true);
				}
				else{
					var audio = document.getElementById("audio1");
					audio.pause();
					changeVideo("hit"+Math.ceil(Math.random()*2));
				}
			}
			

			else{
				numGuesses-=1;
				document.getElementById("guessesRemaining").innerHTML="Number of Guesses Remaining: "+numGuesses;
				if(numGuesses == 0){
					endgame(false);
				}
				else{
					var audio = document.getElementById("audio1");
					audio.pause();
					changeVideo("miss"+Math.ceil(Math.random()*2));
				}


			}
		}
	}

}


function startGame(){
	randomWordNum = Math.ceil(Math.random()*dictionary.length);
	word = dictionary[randomWordNum-1];
	numGuesses = 7;
	correctGuesses=0;
	guessArray = new Array();
	document.getElementById("letterBox").innerHTML=generateWordBox(word.length);
	document.getElementById("guessesRemaining").innerHTML="Number of Guesses Remaining: "+numGuesses;
	document.getElementById("score").innerHTML="Wins: "+wins+"<br />Losses: "+loses;
	document.getElementById("lettersGuessed").innerHTML="Letters Already Guessed: ";
	document.getElementById("playAgain").style.visibility="hidden";
	endGame = false;
}
function generateWordBox(numTimes){
	var output= "";
	for(var i = 0; i< numTimes; ++i){
		output+="<div class =\"letter\" id=\""+"letterID_"+i+"\">&nbsp;</div><div class=\"letterSpacer\"></div>";

	}
	return output;

}

function alreadyGuessed(letterCheck){
	if(guessArray.indexOf(letterCheck)>-1)
		return false;
	else
		return true;


}

function endgame(win){
	if(win){
		wins+=1;
		var audio = document.getElementById("audio1");
		audio.pause();
		changeVideo("win");

	}
	else{
		loses+=1;
		var audio = document.getElementById("audio1");
		audio.pause();
		changeVideo("lose");

	}
	document.getElementById("score").innerHTML="Wins: "+wins+"<br />Losses: "+loses;
	document.getElementById("playAgain").style.visibility="visible";
	endGame = true;
}
