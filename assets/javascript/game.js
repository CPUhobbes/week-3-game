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

//filenames without extensions
var correctGuessVideo = ["hit1", "hit2"];
var wrongGuessVideo =  ["miss1","miss2"];
var winVideo = "win";
var loseVideo = "lose";
var titleScreenVideo = "titleScreen";
var startVideo = "start";
var audioList = ["topgun1", "topgun2","topgun3","topgun4"];

//Game Mechanics
var start=true;
var word ="";
var dictionary = ["STABILIZER", "TURBINE", "COCKPIT", "MISSILE", "TOMCAT", "MAVERICK", "GOOSE", "ICEMAN", 
				  "VOLLEYBALL", "MOTORCYCLE", "HELICOPTER", "CARRIER", "BANDIT", "BOGEY"];
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
		randomAudio = Math.ceil(Math.random()*4)-1;
		changeAudio(randomAudio);

});
function sound(selection){
	soundEnabled = selection;
	if (soundEnabled){
		playAudio();
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
//Checks to see if video is finished
function myHandler(e) {  
	if(enableStillScreen){
    	changeVideo(titleScreenVideo);
    	if(soundEnabled){
    		playAudio();
		}
	}
    enableStillScreen = false;
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
	var audio = document.getElementById("audio1");
	var audioSource = document.getElementById('videosrc');
	audio.src=audioDir+audioList[audioFile]+audioExt;

}


/*
 *Game Mechanics
 */   

document.onkeyup = function(event){
	var keyPress = String.fromCharCode(event.keyCode).toUpperCase();
	if (keyPress && start) {
		start=false;
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
					pauseAudio();
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
					pauseAudio();
					changeVideo("miss"+Math.ceil(Math.random()*2));
				}


			}
		}
	}

}


function startGame(){

	var audio = document.getElementById("audio1");
	audio.pause();
	changeVideo("start");
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
		pauseAudio();
		changeVideo("win");
		document.getElementById("playAgain").className = "btn btn-default btn-success resetGame";
		document.getElementById("playAgain").innerHTML ="You Won! Play Again?";

	}
	else{
		loses+=1;
		pauseAudio();
		changeVideo("lose");
		document.getElementById("playAgain").className = "btn btn-default btn-danger resetGame";
		document.getElementById("playAgain").innerHTML ="You Lost! Play Again?";
		for(var i=0;i<word.length;++i){

			document.getElementById("letterID_"+i).innerHTML=word[i];
		}



	}
	document.getElementById("score").innerHTML="Wins: "+wins+"<br />Losses: "+loses;
	document.getElementById("playAgain").style.visibility="visible";
	endGame = true;
}
