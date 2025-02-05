let timer = document.getElementsByClassName('timer')[0];
let quizContainer = document.getElementById('container');
let nextButton = document.getElementById('next-button');
let numOfQuestions = document.getElementsByClassName('number-of-questions')[0];
let displayContainer = document.getElementById('display-container');
let scoreContainer = document.querySelector('.score-container');
let restart = document.getElementById('restart');
let userScore = document.getElementById('user-score');
let startScreen = document.querySelector('.start-screen');
let startButton = document.getElementById('start-button');
let leaderboardContainer = document.getElementById('leaderboard');

// Sounds
const correctSound = new Audio('correct.mp3');
const incorrectSound = new Audio('incorrect.mp3');

let questionCount;
let scoreCount = 0;
let count = 10;
let countdown;
let quizArray = [];
let highScore = localStorage.getItem('highScore') || 0;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// Generate Random Colors
const generateRandomValue = (array) =>
  array[Math.floor(Math.random() * array.length)];

const colorGenerator = () => {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += generateRandomValue(letters);
  }
  return color;
};

//  Timer Function
const timerDisplay = () => {
  clearInterval(countdown);
  countdown = setInterval(() => {
    timer.innerHTML = `<span>Time Left: </span> ${count}s`;
    count--;
    if (count < 0) {
      clearInterval(countdown);
      displayNext();
    }
  }, 1000);
};

// Populate Quiz Questions
function populateQuiz() {
  quizArray = [];

  for (let i = 0; i < 5; i++) {
    // Generate 5 random questions
    let correctColor = colorGenerator(); // Generate a random correct color
    let options = new Set([correctColor]);

    // Generate 3 more random colors (ensuring uniqueness)
    while (options.size < 4) {
      options.add(colorGenerator());
    }

    quizArray.push({
      correct: correctColor,
      options: Array.from(options),
    });
  }
}

// Create Quiz UI
function quizCreator() {
  quizContainer.innerHTML = '';
  quizArray.forEach((question, index) => {
    let div = document.createElement('div');
    div.classList.add('container-mid', 'hide');

    div.innerHTML = `
        <div class="question-color" style="background:${
          question.correct
        };"></div>
        <div class="button-container">
          ${question.options
            .map(
              (option) =>
                `<button class="option-div" data-option="${option}" onclick="checker(this)" style="background:${option};"></button>`
            )
            .join('')}
        </div>
      `;

    quizContainer.appendChild(div);
  });
}

//  Display Quiz
const quizDisplay = (questionCount) => {
  let quizCards = document.querySelectorAll('.container-mid');
  quizCards.forEach((card) => card.classList.add('hide'));
  quizCards[questionCount].classList.remove('hide');
};

// Check Answer
function checker(userOption) {
  let userSolution = userOption.getAttribute('data-option');
  let question =
    document.getElementsByClassName('container-mid')[questionCount];
  let options = question.querySelectorAll('.option-div');

  if (userSolution === quizArray[questionCount].correct) {
    userOption.classList.add('correct');
    scoreCount++;
    correctSound.play();
  } else {
    userOption.classList.add('incorrect');
    incorrectSound.play();
    options.forEach((element) => {
      if (
        element.getAttribute('data-option') == quizArray[questionCount].correct
      ) {
        element.classList.add('correct');
      }
    });
  }
  clearInterval(countdown);
  options.forEach((element) => (element.disabled = true));
  nextButton.classList.remove('hide');
}

//  Display Next Question
function displayNext() {
  if (questionCount < quizArray.length - 1) {
    questionCount++;
    numOfQuestions.innerHTML = `${questionCount + 1} of ${
      quizArray.length
    } Question`;
    quizDisplay(questionCount);
    count = 10;
    timerDisplay();
    nextButton.classList.add('hide');
  } else {
    displayContainer.classList.add('hide');
    scoreContainer.classList.remove('hide');
    userScore.innerHTML = `Your score is ${scoreCount} out of ${quizArray.length}`;
    updateHighScore();
  }
}

//  Update High Score & Leaderboard
function updateHighScore() {
  if (scoreCount > highScore) {
    highScore = scoreCount;
    localStorage.setItem('highScore', highScore);
  }
  leaderboard.push(scoreCount);
  leaderboard.sort((a, b) => b - a);
  leaderboard = leaderboard.slice(0, 5);
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  displayLeaderboard();
}

// Display Leaderboard
function displayLeaderboard() {
  leaderboardContainer.innerHTML = '<h3>Leaderboard</h3>';
  leaderboard.forEach((score, index) => {
    leaderboardContainer.innerHTML += `<p>${index + 1}. Score: ${score}</p>`;
  });
}

// Initializing the Game
function initial() {
  nextButton.classList.add('hide');
  quizContainer.innerHTML = '';
  questionCount = 0;
  scoreCount = 0;
  clearInterval(countdown);
  count = 10;
  timerDisplay();
  populateQuiz();
  quizCreator();
  quizDisplay(questionCount);
}

// Restart Button
restart.addEventListener('click', () => {
  quizArray = [];
  initial();
  displayContainer.classList.remove('hide');
  scoreContainer.classList.add('hide');
});

// Start Button
startButton.addEventListener('click', () => {
  startScreen.classList.add('hide');
  displayContainer.classList.remove('hide');
  initial();
});

//Next Button
nextButton.addEventListener('click', displayNext);
