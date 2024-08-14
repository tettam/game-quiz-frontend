import { messageError }  from '../script/utils/uiHelpers.js';



export async function requestGetQuestion(level) {
  const url = `http://localhost/api/questions.php?nivel=${level}`

  try {
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error("Erro ao buscar informações", error);
  }
}

export async function requestInsertQuestion(data) {
  const url = "http://localhost/api/insert-question.php";
  const postData = data;
  const showMessageError = document.querySelector('.show--msg');

  try {
    const response = await axios.post(url, postData)

    if(response.data.error) {
      showMessageError.textContent = response.data.error;
      messageError(showMessageError, false);
    } else {
      showMessageError.textContent = 'Pergunta salva com sucesso!';
      messageError(showMessageError, true);
    }

  } catch (error) {
    showMessageError.textContent = 'Erro ao enviar requisição. Tente novamente!';
    messageError(showMessageError, false);
  }
}