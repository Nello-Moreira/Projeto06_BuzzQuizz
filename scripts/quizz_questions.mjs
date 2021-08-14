import { axiosBase, scrollToHeader } from './overall.mjs';
import { backToHomePage } from './home.mjs';

let quizzPageElement = document.querySelector('#quizz');
let activeQuizzElement = quizzPageElement.querySelector('.active-quizz-container');
let activeQuizzObject = {};

let correctAnswersN;
let totalNQuestions;
let quizzScore;

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
    scrollToHeader();
    correctAnswersN = 0;
}

function getTotalNQuestions(){
    totalNQuestions = activeQuizzObject.questions.length;
}

function getQuestions(quizzID){
    let promise = axiosBase.get('/' + quizzID);
    promise.then((value) => {
        storeQuestions(value);
        getTotalNQuestions();
        renderQuestions(activeQuizzObject);
    });
}

function storeQuestions(value){
    activeQuizzObject = value.data;
}

function renderQuestions(){
    scrollToHeader();
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

function renderResult(levelIndex){
    activeQuizzElement += `
        <div class="quizz-result">
            <div class="quizz-result-header">
                <h2>${activeQuizzObject.levels[levelIndex].title}</h2>
            </div>

            <div class="quizz-result-content">
                <img src="./assets/widescreen-test.png" alt="">
                <p>Parabéns Potterhead! Bem-vindx a Hogwarts, aproveite o loop infinito de comida e clique no botão
                    abaixo para usar o vira-tempo e reiniciar este teste.</p>
            </div>
        </div>
    `
}

function isAnswerCorrect(selectedAnswer){
    if (selectedAnswer.classList.contains('right-green')) {
        correctAnswersN++;
    }
}

function calcResult(){
    quizzScore = (correctAnswersN / totalNQuestions) * 100;
    console.log(quizzScore);
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

function scrollNextQuestion(nextQuestion){
    nextQuestion.scrollIntoView();
}

function unhideNextQuestion(nextQuestion){
    nextQuestion.classList.remove('hidden');
}

function findNextQuestion(currentQuestion){
    let nextQuestion = currentQuestion.nextElementSibling;

    if (nextQuestion == null) {
        //let quizzResult = activeQuizzElement.querySelector('.quizz-result');
        //console.log(quizzResult);
        //setTimeout(unhideNextQuestion, 2000, quizzResult);
        //setTimeout(scrollNextQuestion, 2000, quizzResult);
        calcResult();
    }
    else {
        setTimeout(unhideNextQuestion, 1, nextQuestion);
        setTimeout(scrollNextQuestion, 1, nextQuestion);
    }
}

function setQuestionAnswered(selectedAnswer){
    isAnswerCorrect(selectedAnswer.parentNode);
    
    selectedAnswer.parentNode.classList.add('selected');

    let currentQuestion = selectedAnswer.parentNode.parentNode.parentNode;
    currentQuestion.classList.add('answered');

    

    findNextQuestion(currentQuestion);
}
    
function sortAnswers(array){
    array.sort(function(){
        return Math.random() - 0.5; 
    });
}



function nextQuestion(){

}



export { startQuizz, hideQuizzPage, startQuizzClickEvents };
