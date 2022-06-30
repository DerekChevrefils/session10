//images
const images = ["images/1.jpg",
    "images/2.jpg",
    "images/3.jpg",
    "images/4.jpg",
    "images/5.jpg",
    "images/6.jpg"];
const diceImg = document.querySelectorAll("img");
const newDie1 = images[0];
const newDie2 = images[1];

//player dice images
const playerOneDieOne = document.querySelector(".p1-dice1-img");
const playerOneDieTwo = document.querySelector(".p1-dice2-img");
const playerTwoDieOne = document.querySelector(".p2-dice1-img");
const playerTwoDieTwo = document.querySelector(".p2-dice2-img");

//scores
const playerOneRoundScore = document.querySelector(".p1-round-score");
const playerTwoRoundScore = document.querySelector(".p2-round-score");
const playerOneTotalScore = document.querySelector(".p1-total-score");
const playerTwoTotalScore = document.querySelector(".p2-total-score");
const scoreDifference = document.getElementById("score-difference");
let playerOneTotalScoreArray = [];
let playerTwoTotalScoreArray = [];
let p1scoreSum = 0;
let p2scoreSum = 0;

//game functions
const rollDice = document.getElementById("roll-dice");
const newGame = document.getElementById("new-game");
const startGame = document.getElementById("start-game");
let turnCounter = 0;
const rollDelay = 1000;

//popups: instructions & win/lose
const instructions = document.getElementById("instructions");
const pagemask = document.getElementById("pagemask");
const popup = document.getElementById("winner-popup");
const winOrLose = document.getElementById("win-or-lose");
const wonOrLost = document.getElementById("won-or-lost");
const popupButton = document.getElementById("popup-button");
let instructionAnimationFrameHandler = requestAnimationFrame(instructionSlide);
let startingPosition = -100;
let endPosition = 200;
let startingPositionIncrement = 10;

//add pagemask on load
window.addEventListener("load", function(){
    pagemask.style = "display: block;opacity: 1;";
});

//animation for instructions
function instructionSlide(){
    instructions.style="opacity:1;"
    startingPosition += startingPositionIncrement;
    instructions.style.top = "" + startingPosition +"px";
    instructionAnimationFrameHandler = requestAnimationFrame(instructionSlide);
    if (startingPosition == endPosition){
        cancelAnimationFrame(instructionAnimationFrameHandler);
    }
}

//start game button
startGame.addEventListener("click", function(){
    instructions.style.opacity = "0";
    pagemask.style.opacity = "0";
    setTimeout(function(){
        pagemask.style.zIndex = "-1000";
        instructions.style.display = "none";
    }, rollDelay);
});

//die class and prototypes
class Die {
    constructor(sides){
        this.sides = sides;
    };
};

//roll prototype
Die.prototype.roll = function(){
    let rolledDieValue = Math.floor((Math.random()*6));
    let rolledDieImg = "images/" + (rolledDieValue+1) + ".jpg";
    return rolledDieImg;
};

//reset game protoype
Die.prototype.resetGame = function(){
    playerOneDieOne.src = newDie1;
    playerOneDieOne.alt = newDie1;
    playerOneDieTwo.src = newDie2;
    playerOneDieTwo.alt = newDie2;
    playerTwoDieOne.src = newDie1;
    playerTwoDieOne.alt = newDie1
    playerTwoDieTwo.src = newDie2;
    playerTwoDieTwo.alt = newDie2;
};

//new dice objects
let p1die1 = new Die(6);
let p1die2 = new Die(6);
let p2die1 = new Die(6);
let p2die2 = new Die(6);

//roll the dice and add scores
rollDice.addEventListener("click", function(event){

    //spin images
    diceImg.forEach(function (die){
        die.classList.add("spin");

        //disable roll button
        rollDice.disabled = true;
    });

    //wait until images finish spinning, then continue
    setTimeout(function(){
        diceImg.forEach(function(die){
        die.classList.remove("spin");
        });

        //enable roll button
        rollDice.disabled = false;

        //roll the dice
        let p1die1Roll = p1die1.roll();
        let p1die2Roll = p1die2.roll();
        let p2die1Roll = p2die1.roll();
        let p2die2Roll = p2die2.roll();

        //change imgs according to dice value
        playerOneDieOne.src = p1die1Roll;
        playerOneDieOne.alt = p1die1Roll;
        playerOneDieTwo.src = p1die2Roll;
        playerOneDieTwo.alt = p1die2Roll;
        playerTwoDieOne.src = p2die1Roll;
        playerTwoDieOne.alt  =p2die1Roll;
        playerTwoDieTwo.src = p2die2Roll;
        playerTwoDieTwo.alt = p2die2Roll;

        //select only numbers for dice value
        let p1dice1Value = p1die1Roll.replace(/[^0-9]/g,'');
        let p1dice2Value = p1die2Roll.replace(/[^0-9]/g,'');
        let p2dice1Value = p2die1Roll.replace(/[^0-9]/g,'');
        let p2dice2Value = p2die2Roll.replace(/[^0-9]/g,'');

        //add round score
        p1roundScore = parseFloat(p1dice1Value) + parseFloat(p1dice2Value);
        p2roundScore = parseFloat(p2dice1Value) + parseFloat(p2dice2Value);

        //Rules

        //Player One
        if(p1dice1Value == p1dice2Value){
            p1roundScore = (parseFloat(p1dice1Value) + parseFloat(p1dice2Value))*2;
        };
        if(p1dice1Value == 1 || p1dice2Value == 1 ){
            p1roundScore = 0;
        };
        //Player Two
        if(p2dice1Value == p2dice2Value){
            p2roundScore = (parseFloat(p2dice1Value) + parseFloat(p2dice2Value))*2;
        };
        if(p2dice1Value == 1 || p2dice2Value == 1 ){
            p2roundScore = 0;
        };

        //display roll value
        playerOneRoundScore.innerHTML = `Your roll is: ` + p1roundScore;
        playerTwoRoundScore.innerHTML = `Your roll is: ` + p2roundScore;

        //add roll value to total score
        playerOneTotalScoreArray.push(p1roundScore);
        playerTwoTotalScoreArray.push(p2roundScore);

        for(let i = 0; i < playerOneTotalScoreArray.length; i++){
            p1scoreSum += playerOneTotalScoreArray[i];
        };

        for(let i = 0; i < playerTwoTotalScoreArray.length; i++){
            p2scoreSum += playerTwoTotalScoreArray[i];
        };
        
        //display total score
        playerOneTotalScore.innerHTML = `Total Score: ${p1scoreSum}`;
        playerTwoTotalScore.innerHTML = `Total Score: ${p2scoreSum}`;

        //limit play to three rounds max
        turnCounter++;

        if(turnCounter == 3){
            rollDice.disabled = true;
            pagemask.style = "opacity: 1;";
        };

        //winner popup, calculate score difference
        if(turnCounter == 3 && p1scoreSum > p2scoreSum ){
            popup.style = "opacity: 1;";
            winOrLose.style = "color:green;";
            winOrLose.innerHTML = "WINNER!";
            wonOrLost.innerHTML = "won";
            scoreDifference.innerHTML = p1scoreSum - p2scoreSum;
        };

        //loser popup, calculate score difference
        if(turnCounter == 3 && p1scoreSum < p2scoreSum ){
            popup.style = "opacity: 1;background-image:none;background-color:white;";
            winOrLose.style = "color:red;";
            winOrLose.innerHTML = "YOU LOST!";
            wonOrLost.innerHTML = "lost";
            scoreDifference.innerHTML = p2scoreSum - p1scoreSum;
        };
    }, rollDelay);
});

//reset the game
function newGameReset(){
    p1scoreSum = 0;
    p2scoreSum = 0;
    p1roundScore = 0;
    p2roundScore = 0;
    turnCounter = 0;
    p1die1.resetGame();
    p1die2.resetGame();
    p2die1.resetGame();
    p2die2.resetGame();
    playerOneTotalScoreArray = [];
    playerTwoTotalScoreArray = [];
    playerOneTotalScore.innerHTML = `Total Score: ${p1scoreSum}`;
    playerTwoTotalScore.innerHTML = `Total Score: ${p2scoreSum}`;
    playerOneRoundScore.innerHTML = `Roll the Dice!`;
    playerTwoRoundScore.innerHTML = `Roll the Dice!`;
    rollDice.disabled = false;
    pagemask.style.zIndex = "-1000";
};

//hide popup and reset the game
[newGame, popupButton, startGame].forEach(item => {
    item.addEventListener("click", function(event){
    pagemask.style.opacity = "0";
    popup.style.opacity = "0";
    newGameReset();
    });
});




