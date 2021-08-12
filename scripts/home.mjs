import { axiosBase } from './overall.mjs';
import { startQuizz } from './quizz_questions.mjs';

let homeScreenELement = document.querySelector('#home');
let serverQuizzesElement = document.querySelector('.server-quizzes .quizzes-list');
serverQuizzesElement.innerHTML = ''; //apagar no final
let userQuizzesElement = document.querySelector('.user-quizzes .quizzes-list');



 function startHomeClickEvents(){
     serverQuizzesElement.addEventListener('click', getClickedQuizzID);
     userQuizzesElement.addEventListener('click', getClickedQuizzID);
 }

function getServerQuizzes(){
    let promise = axiosBase.get();
    promise.then(renderServerQuizzes); //futuramente fazer uma função para filtrar entre os quizzes do servidor, aqueles criados pelo usuário
}

function renderServerQuizzes(quizzes){
    for (let i = 0; i < quizzes.data.length; i++) {
        serverQuizzesElement.innerHTML += `
            <li name='quizz-ID-${quizzes.data[i].id}'>
                <img src="${quizzes.data[i].image}" alt="">
                <h4 name='quizz-ID-${quizzes.data[i].id}'>${quizzes.data[i].title}</h4>
            </li>
        `
    }
}

function getClickedQuizzID(event){
    let clickedQuizzID;
    clickedQuizzID = Number(event.target.getAttribute('name').substring(9));
    startQuizz(clickedQuizzID);
}



export { serverQuizzesElement, startHomeClickEvents, getServerQuizzes, getClickedQuizzID };