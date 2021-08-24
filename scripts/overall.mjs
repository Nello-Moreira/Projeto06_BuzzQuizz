import { activateHomeEvents, refreshHomePage } from './pages/home.mjs';
import { startQuizz, activateQuizzEvents } from './pages/questionsPage.mjs';
import { activateCreationEvents, quizzEditionHandler } from './pages/creationPage.mjs';

function activeTriggerEvents() {
    activateHomeEvents(startQuizz, quizzEditionHandler);
    activateQuizzEvents(refreshHomePage);
    activateCreationEvents(startQuizz, refreshHomePage);
}

activeTriggerEvents();
