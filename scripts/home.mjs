import { scrollToHeader } from './overall.mjs';
import { axiosBase } from './overall.mjs';
import { startQuizz, hideQuizzPage } from './quizz_questions.mjs';

let homePageELement = document.querySelector('#home');
let serverQuizzesElement = document.querySelector('.server-quizzes .quizzes-list');
let userQuizzesElement = document.querySelector('.user-quizzes .quizzes-list');


function startHomeClickEvents(){
     serverQuizzesElement.addEventListener('click', getClickedQuizzID);
     userQuizzesElement.addEventListener('click', getClickedQuizzID);

     homePageELement.querySelector('.create-quizz button').addEventListener('click', startCreation );
}

function getServerQuizzes(){
    let promise = axiosBase.get();
    promise.then(renderServerQuizzes); //futuramente fazer uma função para filtrar entre os quizzes do servidor, aqueles criados pelo usuário
}

function renderServerQuizzes(quizzes){
    serverQuizzesElement.innerHTML = '';
    for (let i = 0; i < quizzes.data.length; i++) {
        serverQuizzesElement.innerHTML += `
            <li class='quizz-card' name='quizz-ID-${quizzes.data[i].id}'>
                <img src="${quizzes.data[i].image}" alt="">
                <h4 name='quizz-ID-${quizzes.data[i].id}'>${quizzes.data[i].title}</h4>
            </li>
        `
    }
}

function renderLoaders(){
    serverQuizzesElement.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        serverQuizzesElement.innerHTML += `
            <li class="quizzes-list-loader">
                <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </li>
        `
        
    }
}

function getClickedQuizzID(event){
    let clickedQuizzID;
    clickedQuizzID = Number(event.target.getAttribute('name').substring(9));
    hideHomePage(true);
    startQuizz(clickedQuizzID);
}

function hideHomePage(hide){
    if (hide === true){
        homePageELement.classList.add('hidden');
    }
    else if (hide === false){
        homePageELement.classList.remove('hidden');
    }
    
}

function backToHomePage(){
    hideCreationPage(true);
    hideQuizzPage(true);
    hideHomePage(false);
    scrollToHeader();
    renderLoaders();
    getServerQuizzes();
}

//////////////////////////////////////////////////////////////////////////////////
///////////////////////////colocar em quizz creation ////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
let creationPageELement = document.querySelector('#quizz-creation');

function startCreation(){
    hideHomePage(true);
    hideCreationPage(false);
}

function hideCreationPage(hide){
    if (hide === true){
        creationPageELement.classList.add('hidden');
    }
    else if (hide === false){
        creationPageELement.classList.remove('hidden');
    }
}
//////////////////////////////////////////////////////////////////////////////////////
export { startHomeClickEvents, getServerQuizzes, backToHomePage };