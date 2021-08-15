import { startHomeClickEvents, getServerQuizzes } from './home.mjs';
import { startQuizzClickEvents } from './quizz_questions.mjs';
import { activeTriggerEvents, removeTriggerEvents } from './quizz_creation.mjs';

export { axiosBase, scrollToHeader };

const axiosBase = axios.create({
    baseURL: 'https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes',
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

getServerQuizzes();
startHomeClickEvents();
startQuizzClickEvents();
activeTriggerEvents();


export {scrollToHeader, hideLoader};
