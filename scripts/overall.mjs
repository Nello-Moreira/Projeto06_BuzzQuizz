import { startHomeClickEvents, getServerQuizzes } from './home.mjs';
import { startQuizzClickEvents } from './quizz_questions.mjs';
import { activeTriggerEvents, removeTriggerEvents, visitQuizzCreated, backToHome } from './quizz_creation.mjs';


export { axiosBase };

const axiosBase = axios.create({
    baseURL: 'https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes',
});

function scrollToHeader(){
    window.scrollTo(0,0);
}

getServerQuizzes();
startHomeClickEvents();
startQuizzClickEvents();
activeFormEvent();
activeNextButtonsEvent();
activeQuestionEvent();
activeTriggerEvents();


export {scrollToHeader};
