import { startHomeClickEvents, getServerQuizzes, backToHomePage } from './home.mjs';
import { startQuizzClickEvents } from './quizz_questions.mjs';
import { activeTriggerEvents, removeTriggerEvents } from './quizz_creation.mjs';

const axiosBase = axios.create({
    baseURL: 'https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes',
});

function scrollToHeader(){
    window.scrollTo(0,0);
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

export {scrollToHeader, hideLoader, axiosBase};
