import { serverQuizzesElement, startHomeClickEvents, getServerQuizzes, getClickedQuizzID } from './home.mjs';
import {  } from './quizz_questions.mjs';
import {  } from './quizz_creation.mjs';

const axiosBase = axios.create({
    baseURL: 'https://mock-api.bootcamp.respondeai.com.br/api/v3/buzzquizz/quizzes',
});


const quizzScreenElement = document.querySelector('#quizz');
const creationScreenElement = document.querySelector('#quizz-creation');



getServerQuizzes();
//console.log(serverQuizzesElement);
startHomeClickEvents();

export { axiosBase };