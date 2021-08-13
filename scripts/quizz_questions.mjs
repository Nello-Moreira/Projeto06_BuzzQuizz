import { axiosBase } from './overall.mjs';

let quizzPageElement = document.querySelector('#quizz');
let activeQuizz = quizzPageElement.querySelector('.active-quizz-container');

startQuizzClickEvents();

function startQuizzClickEvents(){
    activeQuizz.addEventListener('click', filterClickedElement);
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
}

function getQuestions(quizzID){
    let promise = axiosBase.get('/' + quizzID);
    promise.then(renderQuestions);
}

function renderQuestions(value){
    console.log(value.data);
    let quizzAnswers;
    activeQuizz.innerHTML = `
    
    <div class="quizz-header">
            <img src="${value.data.image}" alt="">
            <h1>${value.data.title}</h1>
    </div>`;        
    
    for (let questionN = 0; questionN < value.data.questions.length; questionN++) {
        activeQuizz.innerHTML += `
        
        <div class="quizz-question-container">
            <div class="quizz-question-header" style="background-color: ${value.data.questions[questionN].color}">
                <h2>${value.data.questions[questionN].title}</h2>
            </div>
            <ul class="quizz-answers">
              
            </ul>
        </div>

        `;

        quizzAnswers = activeQuizz.querySelector(`.quizz-question-container:nth-child(${ 2 + questionN}) .quizz-answers`);

        sortAnswers(value.data.questions[questionN].answers);

        value.data.questions[questionN].answers.forEach((answer) => {
            console.log(answer);
            quizzAnswers.innerHTML += `
                <li class="${specifyAnswerColor(answer.isCorrectAnswer)}">
                    <img src="${answer.image}" alt="">
                    <h3>${answer.text}</h3>
                </li>
            `
        });
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

export { startQuizz };
