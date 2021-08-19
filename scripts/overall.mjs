//import { startHomeClickEvents, getServerQuizzes, backToHomePage } from './home.mjs';
//import { startQuizzClickEvents } from './quizz_questions.mjs';
//import { activeTriggerEvents, removeTriggerEvents } from './quizz_creation.mjs';
import { getQuizz, sendQuizzToServer, changeQuizzOnServer, deleteQuizz } from './buzzquizz_api.mjs';


const newQuizz = {
    id: ""
};

const pages = {
    home: document.querySelector('#home'),
    quizz: document.querySelector('#quizz'),
    creation: document.querySelector('#quizz-creation')
}


// getQuizz().then((response) => {console.log(response)}).catch((err) => {console.log(err)});

/* 
function scrollToHeader() {
    window.scrollTo(0, 0);
}

function hideQuizzPage(hide) {
    if (hide === true) {
        quizzPageElement.classList.add('hidden');
    }
    else if (hide === false) {
        quizzPageElement.classList.remove('hidden');
    }
}

function hideHomePage(hide) {
    if (hide === true) {
        homePageELement.classList.add('hidden');
    }
    else if (hide === false) {
        homePageELement.classList.remove('hidden');
    }
}

function hideCreationPage(hide) {
    if (hide === true) {
        creationPageELement.classList.add('hidden');
    }
    else if (hide === false) {
        creationPageELement.classList.remove('hidden');
    }
}

function hideLoader(hide) {
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
*/