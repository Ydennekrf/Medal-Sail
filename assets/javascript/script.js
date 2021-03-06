 
 let questionEl = document.querySelector("#question");
 let questionContainer = document.querySelector(".questioncontainer");
 let answerContainer = document.querySelector(".answercontainer");
 let answersEl = document.querySelector(".answers");
 let answer1 = document.querySelector("#answer1");
 let answer2 = document.querySelector("#answer2");
 let answer3 = document.querySelector("#answer3");
 let answer4 = document.querySelector("#answer4");
 let resetbtn = document.querySelector("#reset");
 let startBtn = document.querySelector("#start");
 let timerEl = document.querySelector("#timer");
 let quizOver = document.querySelector(".quiz-over");

 //correct answer counter
 let score = 0;
 // checks for when the quiz is complete
 let isFinish = false;
 //allows for timer and timeLeft to be accessed gloabally
 let timer;
 let timeLeft= 0;
 //sets what question you are on through the questions array
 let questionIndex = 0;
 let userName = "";
 // stores the conent of the questions answers and which button will be the correct answer
 let questions = [    
    {question: "When was JavaScript first introduced?",
    answers: ["1985", "1995", "2003", "1976"],
    answerIndex: "2"},
    {question: "What method is used to organize an array?",
    answers: [".forEach();", ".push();", ".sort();", ".pop();"],
    answerIndex: "3"},
    {question: "What tag is used to link a javascript file in HTML",
    answers: ["<link>", "<div>", "<head>", "<script>"],
    answerIndex: "4"},
    {question: "Which of the following methods returns a capitalized string?",
    answers: ["toUpperCase()", "stringify()", "toString()", "ALLCAPS()"],
    answerIndex: "1"},
    {question: "Which of the following is the proper syntax for an object array",
    answers: ["let object = ();", "object: {}", "let object = [{}]", "{object = []}"],
    answerIndex: "3"},
    {question: "How do you check the length of an array?",
    answers: ["array.length()", "length.array()", "array = howlong()", "array.long()"],
    answerIndex: "1"}
  ];
//stores the high scores to be accessed
 let highscoreArr = [];
 //pulls from local storage the highscores and renders them on load up
 init = () => {
    getScore();
};
//sets the score object into the highscore array
 scoreBoard = () => {
    let finalScore = (score + timeLeft);
    let scoreObj = {name: userName, score: finalScore};
    highscoreArr.push(scoreObj);
    highscoreArr.sort(sortScores).reverse();
    trimScore(); 
    pushScore();
    highscoreArr.forEach(renderScores);
 };
 // sorts the highscores in the highscore array
 sortScores = (a, b) => {
     return a.score - b.score;
 };
 //renders the high scores in the score box
 renderScores = () => {
     for (let i = 0; i < 4; i++) {
    document.getElementById(i).textContent = `${highscoreArr[i].name} : ${highscoreArr[i].score}`;    
 }
};
 //trims the high score board down to 5 entries
 trimScore = () => {
     if(highscoreArr.length === 6) {
         highscoreArr.pop();
     }
 };
//saves the high score array in local storage
pushScore = () => {
    localStorage.setItem("highscoreArr", JSON.stringify(highscoreArr));
}
//pulls the scores from local storage and runs function renderScores
getScore = () => {
    let savedScore = JSON.parse(localStorage.getItem("highscoreArr"));
    if (savedScore === null){
        highscoreArr = [];
    } else { 
    highscoreArr = savedScore;
    renderScores();
};
}
//starts the game by clicking the start button
startGame = (event) => {
    timeLeft = 30;
    //disables start button to be hit during game play
    startBtn.disabled = true;
    //switches the question area and timer box from hidden to visable
    timerEl.setAttribute("style", "display: block;");
    questionContainer.setAttribute("style", "display: block;");
    event.preventDefault();
    // starts timer counting
    startTimer();
    startQuestions();
};
// renders the questions and answers in the question container
startQuestions = () => {
    if (questionIndex<questions.length) {
        question.textContent = questions[questionIndex].question;
        answer1.textContent = questions[questionIndex].answers[0];
        answer2.textContent = questions[questionIndex].answers[1];
        answer3.textContent = questions[questionIndex].answers[2];
        answer4.textContent = questions[questionIndex].answers[3];
    } else {
        isFinish = true;
    }
}
//starts the timer in the timer box
startTimer = () => {
    timer = setInterval(function() {
        timeLeft--
        timerEl.textContent = "Remaining Time:"+ timeLeft;
        // tests if timer has run out
        if (timeLeft <= 0) {
            //stops timer and game over
            clearInterval(timer);
             gameOver();
        } 
        if (timeLeft >= 0) {
            //tests if quiz is complete
            if (isFinish && timeLeft > 0) {
                //stops timer and begins post quiz
                clearInterval(timer);
                timerEl.setAttribute("style", "display: none;");
                questionContainer.setAttribute("style", "display: none;");
                userName = prompt("enter your initials");
                //push username and score into highscoreOBJ
                quizOver.setAttribute("style", "display: block;");
                quizOver.textContent = "Good Job!  " + userName + "\nyour score was : " + (score + timeLeft);
                //push userName and score into an obj array from here
                
                scoreBoard();
                return;          
                //maybe do my check if high score here.
            }
        }
    }, 1000);
};
// used if user cannot complete questions in alloted time
gameOver = () => {
    timerEl.setAttribute("style", "display: none;");
    questionContainer.setAttribute("style", "display: none;");
    quizOver.setAttribute("style", "display: block;");
    quizOver.textContent = "OUT OF TIME";
    //add push userName + score to score list
    userName = prompt("enter your initials");
    scoreBoard();
    return;
}
//checks the guessed answer against the answer index in the questions obj array
//adjusts time according to the answer being correct or not
//adjusts the score for a correct answer and runs the correct answer function
checkAnswer = (answerIndex) => {
    let animateHelp = `answer${answerIndex}`;
    let selectedAnswer = document.getElementById(animateHelp)
    if (questions[questionIndex].answerIndex === answerIndex){
        questionIndex++;
        timeLeft = timeLeft + 10;
        score++;
        selectedAnswer.classList.toggle('correct')
        //runs the correct answer animation.
    } else {
        // runs incorrect answer animation.
        questionIndex++;
        timeLeft = timeLeft - 10;
        selectedAnswer.classList.toggle('wrong')
    }
    //sets a pause for the animation to complete before next questions
    setTimeout(()=> {
        selectedAnswer.classList.remove('correct');
        selectedAnswer.classList.remove('wrong');
        startQuestions();
    }, "300")
}
//resets the game
resetGame = () => {
    let reset = confirm("Do you want to reset the highscoreboard?");
    if (reset === true) {
        highscoreArr = [];
        localStorage.setItem("highscoreArr", JSON.stringify(highscoreArr));
    }
    location.reload();
}
  //attach event listeners to start button, and answer buttons
  startBtn.addEventListener("click", startGame);
  //resets the game without using the refresh page in browser
  resetbtn.addEventListener("click", resetGame);
  //checks which answer button was clicked and checks if the answer was correct.
  answerContainer.addEventListener("click", function(event){
      let element = event.target;

      if (element.matches(".answers")){
          let answerIndex = element.dataset.index
          checkAnswer(answerIndex);
      }
  })
  init();