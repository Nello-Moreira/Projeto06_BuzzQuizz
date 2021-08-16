import { quizzPageElement, axiosBase, scrollToHeader, hideLoader, hideQuizzPage, hideHomePage, hideCreationPage} from './overall.mjs';
import { backToHomePage } from './home.mjs';


let activeQuizzObject = {};
let activeQuizzElement = document.querySelector('.active-quizz-container');

let correctAnswersN;
let totalNQuestions;
let quizzScore;

function resetScore(){
    correctAnswersN = 0;
}

function restartQuizz(){
    resetScore();
    scrollToHeader();
    renderQuestions();
}

function startQuizzClickEvents(){
    activeQuizzElement.addEventListener('click', filterClickedElement);
    quizzPageElement.querySelector('.back-home').addEventListener('click', backToHomePage);
    quizzPageElement.querySelector('.quizz-restart').addEventListener('click', restartQuizz);
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

function startQuizz(quizzID){

    hideHomePage(true);
    hideLoader(false);
    hideCreationPage(true);

    getQuestions(quizzID);

    scrollToHeader();
    resetScore();
}

function getTotalNQuestions(){
    totalNQuestions = activeQuizzObject.questions.length;
}

function getQuestions(quizzID){
    let promise = axiosBase.get('/' + quizzID);

    promise.then((value) => {
        storeQuestions(value);

        getTotalNQuestions();
        hideLoader(true);
        hideQuizzPage(false);

        renderQuestions(activeQuizzObject);
    });
}

function storeQuestions(value){
    activeQuizzObject = value.data;
}

function renderQuestions(){
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

    activeQuizzElement.innerHTML += `
        <div class="quizz-result">
            <div class="quizz-result-header">
                <h2>${quizzScore}% de acerto: ${activeQuizzObject.levels[levelIndex].title}</h2>
            </div>

            <div class="quizz-result-content">
                <img src="${activeQuizzObject.levels[levelIndex].image}" alt="">
                <p>${activeQuizzObject.levels[levelIndex].text}.</p>
            </div>
        </div>
    `;

        let quizzResult = activeQuizzElement.querySelector('.quizz-result');

        unhideNextQuestion(quizzResult);
        scrollNextQuestion(quizzResult);
}

function getLevelIndex () {
    let levelIndex;
    
    for (let i = 0; i < activeQuizzObject.levels.length; i++) {

        if (quizzScore >= activeQuizzObject.levels[i].minValue) {
            levelIndex = i;
        }
        
    }
    return(levelIndex);
}

function isAnswerCorrect(selectedAnswer){
    if (selectedAnswer.classList.contains('right-green')) {
        correctAnswersN++;
    }
}

function calcResult(){
    quizzScore = Math.ceil((correctAnswersN / totalNQuestions) * 100);
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
        calcResult();
        setTimeout(renderResult,2000,getLevelIndex());

    }
    else {
        setTimeout(unhideNextQuestion, 2000, nextQuestion);
        setTimeout(scrollNextQuestion, 2000, nextQuestion);
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




export { startQuizz, startQuizzClickEvents };
