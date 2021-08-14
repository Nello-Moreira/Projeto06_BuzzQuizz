import { startHomeClickEvents, getServerQuizzes } from './home.mjs';
import {  } from './quizz_questions.mjs';
import { activeTriggerEvents, removeTriggerEvents, visitQuizzCreated, backToHome } from './quizz_creation.mjs';

export { axiosBase };

const axiosBase = axios.create({
    baseURL: 'https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes',
});

getServerQuizzes();
startHomeClickEvents();
activeTriggerEvents();