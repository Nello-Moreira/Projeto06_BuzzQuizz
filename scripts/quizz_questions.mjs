import { axiosBase } from './overall.mjs';

let quizzPageElement = document.querySelector('#quizz');
let activeQuizz = quizzPageElement.querySelector('.active-quizz-container');

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
    getQuestions(quizzID);
}

function getQuestions(quizzID){
    let promise = axiosBase.get('/' + quizzID);
    promise.then(renderQuestions);
}

function renderQuestions(value){
    console.log(value.data);
    activeQuizz.innerHTML = `
    
    <div class="quizz-header">
            <img src="${value.data.image}" alt="">
            <h1>${value.data.title}</h1>
    </div>`;        
    
    for (let questionN = 0; questionN < value.data.questions.length; questionN++) {
        activeQuizz.innerHTML += `
        
        <div class="quizz-question-container answered">
            <div class="quizz-question-header">
                <h2>${value.data.questions[questionN].title}</h2>
            </div>
            <ul class="quizz-answers">
              
            </ul>
        </div>

        `;
        
    }

function addCorrectAnswerClass(isCorrectAnswer){

}
    



}

export { startQuizz };
