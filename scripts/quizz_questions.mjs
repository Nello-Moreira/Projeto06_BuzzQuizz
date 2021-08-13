import { axiosBase } from './overall.mjs';
import { backToHomePage } from './home.mjs';

let quizzPageElement = document.querySelector('#quizz');
let activeQuizzElement = quizzPageElement.querySelector('.active-quizz-container');
let activeQuizzObject = {};

startQuizzClickEvents();

function startQuizzClickEvents(){
    activeQuizzElement.addEventListener('click', filterClickedElement);
    quizzPageElement.querySelector('.back-home').addEventListener('click', backToHomePage);
    quizzPageElement.querySelector('.quizz-restart').addEventListener('click', renderQuestions);
}


function isAnswered(event){
    let questionElement = event.parentNode.parentNode.parentNode;
    return (questionElement.classList.contains('answered')); 
}

function isAnswer(event){
    let elementTag = event.parentNode.tagName;
    return (elementTag === 'LI');
}

function filterClickedElement(event){
    console.log(event);
    if (isAnswer(event.target) && !isAnswered(event.target)) { 
            setQuestionAnswered(event.target);
    }
}



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
    promise.then((value) => {
        storeQuestions(value);
        renderQuestions(activeQuizzObject);
    });
}

function storeQuestions(value){
    activeQuizzObject = value.data;
    console.log(activeQuizzObject);
}

function renderQuestions(){
    console.log(activeQuizzObject);
    let quizzAnswers;
    activeQuizzElement.innerHTML = `
    
    <div class="quizz-header">
            <img src="${activeQuizzObject.image}" alt="">
            <h1>${activeQuizzObject.title}</h1>
    </div>`;        
    
    for (let questionN = 0; questionN < activeQuizzObject.questions.length; questionN++) {
        activeQuizzElement.innerHTML += `
        
        <div class="quizz-question-container ${hideQuestions(questionN)}">
            <div class="quizz-question-header" style="background-color: ${activeQuizzObject.questions[questionN].color}">
                <h2>${activeQuizzObject.questions[questionN].title}</h2>
            </div>
            <ul class="quizz-answers">
              
            </ul>
        </div>

        `;

        quizzAnswers = activeQuizzElement.querySelector(`.quizz-question-container:nth-child(${ 2 + questionN}) .quizz-answers`);

        sortAnswers(activeQuizzObject.questions[questionN].answers);

        activeQuizzObject.questions[questionN].answers.forEach((answer) => {
            quizzAnswers.innerHTML += `
                <li class="${specifyAnswerColor(answer.isCorrectAnswer)}">
                    <img src="${answer.image}" alt="">
                    <h3>${answer.text}</h3>
                </li>
            `
        });
    }

}

function hideQuestions(questionN){
    if (questionN > 0) {
        return 'hidden';
    }
    else {
        return '';
    }
}

function specifyAnswerColor(isCorrectAnswer){
    if (isCorrectAnswer){
        return 'right-green';
    }
    else if(!isCorrectAnswer){
        return 'wrong-red';
    }
}

function setQuestionAnswered(selectedAnswer){
    selectedAnswer.parentNode.classList.add('selected');
    selectedAnswer.parentNode.parentNode.parentNode.classList.add('answered');
}
    
function sortAnswers(array){
    array.sort(function(){
        return Math.random() - 0.5; 
    });
}



function nextQuestion(){

}



export { startQuizz, hideQuizzPage };
