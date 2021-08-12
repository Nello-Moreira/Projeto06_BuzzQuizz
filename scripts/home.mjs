const axiosBase = axios.create({
    baseURL: 'https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes',
});
let serverQuizzesElement = document.querySelector('.server-quizzes .quizzes-list');
let userQuizzesElement = document.querySelector('.user-quizzes .quizzes-list');
serverQuizzesElement.innerHTML = '';

getServerQuizzes();

function getServerQuizzes(){
    let promise = axiosBase.get();
    promise.then(renderServerQuizzes); //futuramente fazer uma função para filtrar entre os quizzes do servidor, aqueles criados pelo usuário
}

function renderServerQuizzes(quizzes){
    for (let i = 0; i < quizzes.data.length; i++) {
        serverQuizzesElement.innerHTML += `
            <li>
                <img src="${quizzes.data[i].image}" alt="">
                <h4>${quizzes.data[i].title}</h4>
            </li>
        `
    }
}



export {  };