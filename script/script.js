//Inicial Data
const level = ['facil', 'medio', 'dificil'];
let currentQuestion = 0;
let totalPoints = 0;


//Functions
function showQuestion() {
  const levelNow = data[level[currentQuestion]];

  if (levelNow) {
    const responsesContainer = document.querySelector('.responses');
    const questionElement = document.querySelector('.question');

    const randowQuestion = getRandomQuestion(levelNow);
    const dataOptions = levelNow[randowQuestion];

    responsesContainer.textContent = '';
    questionElement.textContent = dataOptions.question;

    for (let index = 0; index < dataOptions.options.length; index++) {
      const optionText = dataOptions.options[index];
      const responseElement = document.createElement('div');
      responseElement.classList.add('response');
      responseElement.setAttribute('data-op', `${index+1}`);
      responseElement.innerHTML = 
      `
        <div class="option">${index+1}</div>
        <p class="answer">${optionText}</p>
      `;
      responsesContainer.appendChild(responseElement);
    }

    const responseElements = document.querySelectorAll('.response');
    responseElements.forEach(item => {
      item.addEventListener('click', (e) => responseEventClick(e, dataOptions));
    })

  } else {
    modalStatusMsg( 'Parabéns! Você acertou os três nívels');
  }
}

function getRandomQuestion(levelNow) {
  const amountData = levelNow.length - 1;
  const questionRandom = Math.floor(Math.random() * amountData);
  return questionRandom;
}


function responseEventClick(e, dataOptions) {
  let clickedOption = e.target.parentNode.getAttribute('data-op');

  confirmAnswer().then((confirm => {
    if(confirm) {
      if(parseInt(clickedOption) === dataOptions.answer) {
        calculatorPoints();
        nextQuestion();
      } else {
        modalStatusMsg('Você errou a resposta')
        finalScore();
      }
    } else {
      console.log('cancelado');
    }
  }))
}

function modalStatusMsg(msg) {
  const status = document.querySelector('.status');
  status.textContent = `${msg} de nível ${level[currentQuestion]}`;
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
    resetQuestion();
    modalScore.style.display = 'none';
  })
}

function nextQuestion() {
  if(currentQuestion < 3) {
    currentQuestion ++
  }
  showQuestion();
}

function resetQuestion() {
  totalPoints = 0;
  currentQuestion = 0;
  updatePoints()
  showQuestion();
}

function calculatorPoints() {
  let pointsRandom = 0;
  //score per level
  switch (currentQuestion) {
    case 0:
      pointsRandom = Math.floor(Math.random() * 5 + 1) * 100;// easy
      break;
    case 1:
      pointsRandom = Math.floor(Math.random() * 6 + 5) * 100; //middle
      break;
    case 2:
      pointsRandom = Math.floor(Math.random() * 6 + 10) * 100;//difficult
    break;
  }

  totalPoints += pointsRandom;
  updatePoints();
}

function updatePoints(pointsRandom) {
  const points = document.querySelector('.total-points');
  points.textContent = totalPoints;
}



showQuestion();