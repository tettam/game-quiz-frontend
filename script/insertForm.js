import { requestInsertQuestion } from '../script/request.js';

const form = document.querySelector('#question-form');

form.addEventListener('submit', (event) => {
  event.preventDefault();


  const questionForm = document.querySelector('.input--question');
  const question = questionForm.value
  const levels = document.getElementsByName('level');
  let level;
  for (let i = 0; i < levels.length; i++) {
    if(levels[i].checked) {
      level = levels[i].value;
      break;
    }
  }


  const answersInput = []; 
  const answersElements = document.getElementsByName('answer[]');
  for (const item of answersElements) {
    answersInput.push(item.value);
  }

  const isCorrect = [];
  const isCorrectAnswers = document.getElementsByName('is_correct[]');
  for (const item of isCorrectAnswers) {
    isCorrect.push(item.checked)
  }

  const data = [];
  const minLength = Math.min(answersInput.length, isCorrect.length);
  for (let i = 0; i < minLength; i++) {
    data.push({
      "answer":answersInput[i],
      "is_correct":isCorrect[i]
    })
  }

  const object = {
    question: question,
    level:level,
    answers:data
  }
  requestInsertQuestion(object);
  resertForm();
})

function resertForm() {
  const form = document.querySelector('#question-form');
  form.reset();
}