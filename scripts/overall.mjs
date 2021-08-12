import { startHomeClickEvents, getServerQuizzes } from './home.mjs';
import {  } from './quizz_questions.mjs';
import {  } from './quizz_creation.mjs';

const axiosBase = axios.create({
    baseURL: 'https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes',
});

//const creationPageElement = document.querySelector('#quizz-creation');

getServerQuizzes();
startHomeClickEvents();

export { axiosBase };