//import { startHomeClickEvents, getServerQuizzes, backToHomePage } from './home.mjs';
//import { startQuizzClickEvents } from './quizz_questions.mjs';
import { activeCreationEvents, removeCreationEvents, resetCreationPage, quizzEditionHandler, createQuizzObject } from './quizz_creation.mjs';
import { getQuizz, sendQuizzToServer, changeQuizzOnServer, deleteQuizz } from './buzzquizz_api.mjs';

const pages = {
    home: document.querySelector('#home'),
    quizz: document.querySelector('#quizz'),
    creation: document.querySelector('#quizz-creation')
}

const actualQuizz = {
    id: "919"
};

let editing = false;

function activatePage(page) {
    Object.values(pages).forEach(element => {
        if (element === page) {
            element.classList.remove('hidden');
            activeTriggerEvents(page)
        } else {
            element.classList.add('hidden');
        }
    });
    window.scrollTo(0, 0);
}

function hideLoader(hide) {
    if (hide) {
        document.querySelector('#loader').classList.add('hidden');
        return;
    }
    document.querySelector('#loader').classList.remove('hidden');
}

function editQuizz(quizzId) {
    editing = true;
    activatePage(pages.creation);
    getQuizz(quizzId)
        .then(response => {
            quizzEditionHandler(response.data)
        });
}

function visitQuizz(event) {
    resetCreationPage()
    startQuizz(actualQuizz.id);
}

function homeButtonHandler(event) {
    resetCreationPage();
    backToHomePage();
}

function endQuizzButtonHandler(event) {
    hideLoader(false);
    if (editing) {
        changeQuizzOnServer(actualQuizz.id, createQuizzObject())
            .then(response => hideLoader(true));
    } else {
        sendQuizzToServer(createQuizzObject())
            .then(response => {
                actualQuizz.id = response.data.id;
                hideLoader(true);
            });
    }
    editing = false;
}

function activeTriggerEvents(page) {
    //pages.quizz.querySelector('.back-home').addEventListener('click', backToHomePage);
    //pages.quizz.querySelector('.quizz-restart').addEventListener('click', restartQuizz);

    if (page === pages.home){
        removeCreationEvents(endQuizzButtonHandler, visitQuizz, homeButtonHandler);

    }else if (page === pages.quizz){
        removeCreationEvents(endQuizzButtonHandler, visitQuizz, homeButtonHandler);
        
    }else if (page === pages.creation){
        activeCreationEvents(endQuizzButtonHandler, visitQuizz, homeButtonHandler);
    }

}



/* sendQuizzToServer()
    .then(response => {
        hideLoader(true);
    }); */

// getQuizz().then((response) => {console.log(response)}).catch((err) => {console.log(err)});

/*
backToHomePage();
startHomeClickEvents();
startQuizzClickEvents();
*/
activeTriggerEvents();
editQuizz(919);