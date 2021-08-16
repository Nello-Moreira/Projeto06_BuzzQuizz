import { startHomeClickEvents, getServerQuizzes, backToHomePage } from './home.mjs';
import { startQuizzClickEvents } from './quizz_questions.mjs';
import { activeTriggerEvents, removeTriggerEvents } from './quizz_creation.mjs';

let homePageELement = document.querySelector('#home');
let quizzPageElement = document.querySelector('#quizz');
let creationPageELement = document.querySelector('#quizz-creation');

const axiosBase = axios.create({
    baseURL: 'https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes',
});

function scrollToHeader(){
    window.scrollTo(0,0);
}

function hideQuizzPage(hide){
    if (hide === true){
        quizzPageElement.classList.add('hidden');

    }
    else if (hide === false){
        quizzPageElement.classList.remove('hidden');
    }   
}

function hideHomePage(hide){
    if (hide === true){
        homePageELement.classList.add('hidden');

    }
    else if (hide === false){
        homePageELement.classList.remove('hidden');
    }
    
}

function hideCreationPage(hide){
    if (hide === true){
        creationPageELement.classList.add('hidden');
    }
    else if (hide === false){
        creationPageELement.classList.remove('hidden');
    }
}

function hideLoader(hide){
    if (hide === true) {
        document.querySelector('#loader').classList.add('hidden');
    }
    else {
        document.querySelector('#loader').classList.remove('hidden');
    }
}

backToHomePage();
startHomeClickEvents();
startQuizzClickEvents();
activeTriggerEvents();

export {homePageELement, quizzPageElement, scrollToHeader, hideLoader, axiosBase, hideQuizzPage, hideHomePage, hideCreationPage};
