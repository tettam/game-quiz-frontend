import { requestGetQuestion } from "../script/request.js";


//Inicial Data
const level = ['facil', 'medio', 'dificil'];
let currentQuestion = 0;
let totalPoints = 0;
let timer;
let seconds = 31;


//Functions
async function showQuestion() {
  const updateLevel = verifyCurrentQuestion();
  const levelNow = await requestGetQuestion(level[updateLevel]);
  console.log(updateLevel);
  const dataResult = levelNow.data.result;


  if (dataResult) {
    const dataResultQuestion = dataResult.question.question;
    const dataResultAnswers = dataResult.question.answers;

    const responsesContainer = document.querySelector('.responses');
    const questionElement = document.querySelector('.question');


    responsesContainer.textContent = '';
    questionElement.textContent = dataResultQuestion;

    for (let index = 0; index < dataResultAnswers.length; index++) {
      const optionText = dataResultAnswers[index];
      const responseElement = document.createElement('div');
      responseElement.classList.add('response');
      responseElement.setAttribute('data-op', `${index+1}`);
      responseElement.innerHTML = 
      `
        <p class="answer">${optionText.answer}</p>
      `;
      responsesContainer.appendChild(responseElement);
    }

    const responseElements = document.querySelectorAll('.response');
    responseElements.forEach(item => {
      item.addEventListener('click', (e) => {
        responseEventClick(item, dataResultAnswers);
      });
    })

  } else {
    modalStatusMsg( 'Parabéns! Você acertou os três nívels');
  }
}

function verifyCurrentQuestion() {
  if(currentQuestion <= 3) {
    return 0;
  } else if(currentQuestion <= 7) {
    return 1;
  } else if(currentQuestion <= 9) {
    return 2;
  }
}

async function responseEventClick(item, listAnswers) {
  let clickedOption = parseInt(item.dataset.op);
  const verifyQuestion = listAnswers[clickedOption - 1].isCorrect;
  const confirm = await confirmAnswer();
  if(confirm) {
    if(verifyQuestion === true) {
      nextQuestion();
      playSound('correct');
      calculatorPoints();
      timerPlaySound(false);
      timerQuestion('stop');
      timerQuestion('start');
    } else {
      playSound('error');
      timerQuestion('stop');
      timerPlaySound(false);
      modalStatusMsg('Você errou a resposta')
      finalScore();
    }
  } else {
    console.log('cancelado');
  }
}

const sounds = {
  correct: new Audio('../assets/audio/correct-answer.mp3'),
  error: new Audio('../assets/audio/error-answer.mp3'),
  time: new Audio('../assets/audio/time-answer.mp3')
}

function playSound(response) {
  switch (response) {
    case 'correct':
      sounds.correct.play();
      break;
    case 'error':
      sounds.error.play();
      break;
    case 'time':
      timerPlaySound(true);
      break;

    default:
      console.error('Som não encontrado!');
      break;
  }
}

function timerPlaySound(active) {
  if(active) {
    sounds.time.currentTime = 3;
    sounds.time.play();

  } else {
    sounds.time.pause();
  }
}

function modalStatusMsg(msg) {
  const status = document.querySelector('.status');
  const newLevel = verifyCurrentQuestion();
  status.textContent = `${msg} de nível ${level[newLevel]}`;
}

function confirmAnswer() {
  const showModal = document.querySelector('.focus-modal');
  const confirmButton = document.querySelector('.btn-confirm');
  const cancelButton = document.querySelector('.btn-cancel');
  showModal.classList.add('focus-modal-true');

  return new Promise((resolve) => {
    confirmButton.addEventListener('click', () => {
      showModal.classList.remove('focus-modal-true');
      resolve(true);
    })
  
    cancelButton.addEventListener('click', () => {
      showModal.classList.remove('focus-modal-true');
      resolve(false);
    })
  })
}

function finalScore() {
  const score = document.querySelector('.score');
  const modalScore = document.querySelector('.focus-modal-points');
  const btnContinue = document.querySelector('.btn-continue');
  score.textContent = totalPoints;
  modalScore.style.display = 'flex';

  btnContinue.addEventListener('click', () => {
    currentQuestion = 0;
    showOptionQuestion();
    resetQuestion();
    startTimer();
    modalScore.style.display = 'none';
  })
}

function nextQuestion() {
  currentQuestion++;

  if(currentQuestion < 10) {
    showOptionQuestion();
  } else {
    playSound('correct');
    timerPlaySound(false);
    stopTimer();
    modalStatusMsg('Fim de quiz');
    finalScore();
  }
  showQuestion();
}

function showOptionQuestion() {
  const whatsAnswer = document.querySelector('.whats-answer');
  whatsAnswer.textContent = `Questão ${currentQuestion+1}/10`
}

function resetQuestion() {
  totalPoints = 0;
  currentQuestion = 0;
  updatePoints()
  showQuestion();
}

function calculatorPoints() {
  //score per level
  const EASY_SCORE = 1;
  const MEDDLE_SCORE = 5;
  const DIFFICULT_SCORE = 10;

  let pointsRandom = 0;

  if(currentQuestion <= 3) {
    pointsRandom = Math.floor(Math.random() * 5 + EASY_SCORE) * 100;

  } else if(currentQuestion <= 7) {
    pointsRandom = Math.floor(Math.random() * 6 + MEDDLE_SCORE) * 100; 
    
  } else if(currentQuestion <= 9) {
    pointsRandom = Math.floor(Math.random() * 6 + DIFFICULT_SCORE) * 100;
  }

  totalPoints += pointsRandom;
  updatePoints();
}

function updatePoints() {
  const points = document.querySelector('.total-points');
  points.textContent = totalPoints;
}

function questionDatabase(response) {
  const quiz = document.querySelector('.question-database');
  response ? quiz.classList.add('show-modal-quiz') : quiz.classList.remove('show-modal-quiz');
}

// Start Game and Active Sounds
document.addEventListener('DOMContentLoaded', () => {
  const msgStart = document.querySelector('.msg-start');
  const yesMsg = document.querySelector('.msg-yes');
  questionDatabase(true)
  msgStart.classList.add('focus-modal-true');

  yesMsg.addEventListener('click', () => {
    msgStart.classList.remove('focus-modal-true');
    questionDatabase(false);
    showQuestion();
    timerQuestion('start')
  })
})

//Timer
function timerQuestion(action) {
  if(action == 'start') {
    startTimer();
  } else {
    stopTimer();
  }
}

function startTimer() {
  const showTimer = document.querySelector('.timer');

  stopTimer();
  timer = setInterval(() => {
    seconds--;
    showTimer.textContent = formatTimer(seconds);
    if(seconds == 10) {
      timerPlaySound(true);
    }

    if(seconds <= 0) {
      playSound('error');
      timerPlaySound(false);
      modalStatusMsg('Tempo esgotado na questão')
      finalScore();
      stopTimer();
    }
  }, 1000);
}

function stopTimer() {
  seconds = 31;
  clearInterval(timer);
}

function formatTimer(seconds) {
  return seconds < 10 ? `00:0${seconds}` : `00:${seconds}`;
}