import { getQuizz, deleteQuizz, getUserQuizzes } from '../api/buzzquizz_api.mjs';
import { pages, homePage, activatePage } from '../auxiliar/auxiliar.mjs';

let auxFuncs = {};

function hideCreationBox(hide) {
    if (hide) {
        homePage.userQuizzesBox.classList.remove('hidden');
        homePage.createQuizzBox.classList.add('hidden');
        return;
    }
    homePage.userQuizzesBox.classList.add('hidden');
    homePage.createQuizzBox.classList.remove('hidden');
}

function filterUserQuizzes(quizzes) {
    let userQuizzes;
    let otherUsersQuizzes;
    const createdQuizzesIDs = getUserQuizzes().map(element => Number(element.id));

    if (createdQuizzesIDs) {
        userQuizzes = quizzes.filter(element => { return createdQuizzesIDs.includes(element.id); });
        otherUsersQuizzes = quizzes.filter(element => { return !createdQuizzesIDs.includes(element.id); });

        hideCreationBox(userQuizzes.length > 0);

        return {
            userQuizzes,
            otherUsersQuizzes
        }
    }
    return {
        userQuizzes: [],
        otherUsersQuizzes: quizzes
    }
}

function quizzRendererHandler(quizzes) {
    let quizzesObject = filterUserQuizzes(quizzes);
    renderUserQuizzes(quizzesObject.userQuizzes);
    renderServerQuizzes(quizzesObject.otherUsersQuizzes);
}


function renderUserQuizzes(userQuizzes) {
    homePage.userQuizzesBox.querySelector("ul").innerHTML = '';

    userQuizzes.forEach(element => {
        homePage.userQuizzesBox.querySelector("ul").innerHTML += `
            <li class='quizz-card' id='${element.id}'>
                <img src="${element.image}" alt="">
                <h4>${element.title}</h4>
                <div class='edit-delete-box'>
                    <ion-icon class='edit-quizz-button' name="create-outline"></ion-icon>
                    <ion-icon class='delete-quizz-button' name="trash-outline"></ion-icon>
                </div>
            </li>    
        `
    });
}

function renderServerQuizzes(otherUsersQuizzes) {
    homePage.serverQuizzesBox.querySelector("ul").innerHTML = '';

    otherUsersQuizzes.forEach(element => {
        homePage.serverQuizzesBox.querySelector("ul").innerHTML += `
            <li class='quizz-card' id='${element.id}'>
                <img src="${element.image}" alt="">
                <h4>${element.title}</h4>
            </li>
        `
    })
}

function refreshHomePage() {
    activatePage(pages.loader);
    window.scrollTo(0, 0);
    getQuizz().then(response => {
        activatePage(pages.home);
        quizzRendererHandler(response.data);
    });
}

function addLoaderDeletingCard(target) {
    target.parentElement.parentElement.innerHTML += `
            <div class="lds-default">
                <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
            </div>
        `;
}

function deletePrompt(target, clickedQuizzID) {
    const deletionConfirm = window.confirm(`Quer mesmo deletar o quizz "${target.parentElement.parentElement.querySelector('h4').innerHTML}"?`);

    if (deletionConfirm) {
        addLoaderDeletingCard(target);
        deleteQuizz(clickedQuizzID).then(refreshHomePage);
    }
}

function editQuizz(quizzId) {
    activatePage(pages.loader);
    getQuizz(quizzId)
        .then(response => {
            auxFuncs.quizzEditionHandlerFunction(response.data)
            activatePage(pages.creation);
        });
}

function getClickedQuizzOption(target, clickedQuizzID) {
    if (target.tagName === 'LI' || target.tagName === 'H4') {
        auxFuncs.openQuizzFunction(clickedQuizzID);
    } else if (target.classList.contains('delete-quizz-button')) {
        deletePrompt(target, clickedQuizzID);
    } else if (target.classList.contains('edit-quizz-button')) {
        editQuizz(clickedQuizzID);
    }
}

function quizzClickHandler(event) {
    let clickedQuizzID;

    if (event.target.tagName === 'LI') {
        clickedQuizzID = Number(event.target.getAttribute('id'));
    } else if (event.target.tagName === 'H4') {
        clickedQuizzID = Number(event.target.parentElement.getAttribute('id'));
    } else if (event.target.tagName === 'ION-ICON') {
        clickedQuizzID = Number(event.target.parentElement.parentElement.getAttribute('id'));
    }
    if (clickedQuizzID) {
        getClickedQuizzOption(event.target, clickedQuizzID);
    }
}

function activateHomeEvents(openQuizzFunction, quizzEditionHandlerFunction) {
    auxFuncs = {
        openQuizzFunction,
        quizzEditionHandlerFunction,
    }
    refreshHomePage();
    homePage.userQuizzesBox.querySelector("ul").addEventListener('click', quizzClickHandler);
    homePage.serverQuizzesBox.querySelector("ul").addEventListener('click', quizzClickHandler);
    homePage.createQuizzBox.querySelector('button').addEventListener('click', () => { activatePage(pages.creation) });
    pages.home.querySelector('.add-quizz-button').addEventListener('click', () => { activatePage(pages.creation) });
}

export { activateHomeEvents, refreshHomePage };
