import { activateHomeEvents, refreshHomePage } from './home.mjs';
import { startQuizz, activateQuizzEvents } from './quizz_questions.mjs';
import { activateCreationEvents, removeCreationEvents, quizzEditionHandler } from './quizz_creation.mjs';

const pages = {
    home: document.querySelector('#home'),
    quizz: document.querySelector('#quizz'),
    creation: document.querySelector('#quizz-creation')
}

const actualQuizz = {
    id: ""
};

function hideLoader(hide) {
    if (hide) {
        document.querySelector('#loader').classList.add('hidden');
        return;
    }
    document.querySelector('#loader').classList.remove('hidden');
}


function activeTriggerEvents(page) {
    //pages.quizz.querySelector('.back-home').addEventListener('click', refreshHomePage);
    //pages.quizz.querySelector('.quizz-restart').addEventListener('click', restartQuizz);

    if (page === pages.home) {
        refreshHomePage();
        activateHomeEvents(hideLoader, startQuizz, quizzEditionHandler, () => { activatePage(pages.creation) });

    } else if (page === pages.quizz) {

    } else if (page === pages.creation) {
        activateCreationEvents(hideLoader, startQuizz, () => activatePage(pages.home));
    }
}

function removeTriggerEvents(page) {
    if (page === pages.home) {
        removeCreationEvents(endQuizzButtonHandler, visitQuizz, homeButtonHandler);

    } else if (page === pages.quizz) {
        removeCreationEvents(endQuizzButtonHandler, visitQuizz, homeButtonHandler);

    } else if (page === pages.creation) {

    }
}

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

activatePage(pages.home);
