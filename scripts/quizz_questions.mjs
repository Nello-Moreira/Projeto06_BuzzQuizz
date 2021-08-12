import { axiosBase } from './overall.mjs';

const quizzPageElement = document.querySelector('#quizz');

function hideQuizzPage(hide){
    if (hide === true){
        quizzPageElement.classList.add('hidden');
    }
    else if (hide === false){
        quizzPageElement.classList.remove('hidden');
    }
    
}


function startQuizz(quizzID){
    hideQuizzPage(false);
    console.log(quizzID);
}


export { startQuizz };
