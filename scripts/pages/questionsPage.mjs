import { pages, activatePage } from '../auxiliar/auxiliar.mjs';
import { getQuizz } from '../api/buzzquizz_api.mjs';
import { createQuizzHeader, AppendQuestionsContainers, createResultContainer } from '../containers/quizzContainer.mjs';

const waitTime = 1 * 1000;

const activeQuizzElement = document.querySelector('.active-quizz-container');
let activeQuizzObject = {};

const score = {
    correctAnswers: 0,
    percentage: 0
};

function getNumberOfQuestions(quizz) {
    return quizz.questions.length;
}

function computeResult() {
    score.percentage = Math.ceil((score.correctAnswers / getNumberOfQuestions(activeQuizzObject)) * 100);
}

function unhideElement(element) {
    element.classList.remove('hidden');
}

function scrollToElement(element, alignment = 'center') {
    element.scrollIntoView({ behavior: "smooth", block: alignment, inline: "nearest" });
}

function getLevelIndex() {
    let levelIndex

    activeQuizzObject.levels.forEach((level, index) => {
        if (score.percentage >= level.minValue) {
            levelIndex = index;
        }
    })

    return levelIndex;
}

function renderResult() {
    const quizzResult = createResultContainer(activeQuizzObject, score.percentage, getLevelIndex())
    activeQuizzElement.append(quizzResult);

    const backToHomeButton = document.querySelector(".back-home");
    scrollToElement(backToHomeButton, "end");
}

function goToNextQuestion(currentQuestion) {
    const nextQuestion = currentQuestion.nextElementSibling;

    if (!nextQuestion) {
        computeResult();
        setTimeout(renderResult, waitTime);
        return;
    }
    setTimeout(unhideElement, waitTime, nextQuestion);
    setTimeout(scrollToElement, waitTime, nextQuestion);
}

function setQuestionAnswered(question) {
    question.classList.add('answered');

    goToNextQuestion(question);
}

function removeAnswersEvent(question) {
    question.querySelectorAll('li').forEach(answer => {
        answer.removeEventListener('click', checkAnswer);
    });
}

function getLi(target) {
    if (target.tagName == 'LI') {
        return target;
    }
    return target.parentNode;
}

function changeSelected(question, answerSelected) {
    question.querySelectorAll('li').forEach(answer => {
        if (answer === answerSelected) {
            answer.classList.add('selected');
            return;
        }
        answer.classList.add('not-selected');
    })
}

function checkAnswer(event) {
    const answer = getLi(event.target);
    if (answer.classList.contains('correct')) score.correctAnswers += 1;

    const currentQuestion = event.target.parentNode.parentNode.parentNode;
    changeSelected(currentQuestion, answer);
    removeAnswersEvent(currentQuestion);
    setQuestionAnswered(currentQuestion);
}

function setAnswersEvents() {
    const listOfAnswersContainer = activeQuizzElement.querySelectorAll('.quizz-answers');
    listOfAnswersContainer.forEach(answersContainer => {
        answersContainer.querySelectorAll('li').forEach(answer => {
            answer.addEventListener('click', checkAnswer);
        });
    })
}

function renderQuizz() {
    activeQuizzElement.append(createQuizzHeader(activeQuizzObject));
    AppendQuestionsContainers(activeQuizzObject, activeQuizzElement);
    setAnswersEvents();
}

function resetScore() {
    score.correctAnswers = 0;
}

function resetDisplay() {
    activeQuizzElement.innerHTML = '';
    renderQuizz();
    document.querySelector(".quizz-question-container").scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
}

function resetQuizz() {
    resetScore();
    resetDisplay();
}

function startQuizz(quizzID) {
    getQuizz(quizzID)
        .then((response) => {
            activeQuizzObject = response.data;
            resetQuizz();
            activatePage(pages.quizz);
        });
}

function activateQuizzEvents(refreshHomePageFunction) {
    pages.quizz.querySelector('.back-home').addEventListener('click', refreshHomePageFunction);
    pages.quizz.querySelector('.quizz-restart').addEventListener('click', resetQuizz);
}

export { startQuizz, activateQuizzEvents };
