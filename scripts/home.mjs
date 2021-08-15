import { scrollToHeader, axiosBase } from './overall.mjs';
import { startQuizz, hideQuizzPage } from './quizz_questions.mjs';
import { deleteQuizz, editQuizz } from './quizz_creation.mjs';

let homePageELement = document.querySelector('#home');
let serverQuizzesElement = document.querySelector('.server-quizzes .quizzes-list');
let userQuizzesElement = document.querySelector('.user-quizzes .quizzes-list');

let createdQuizzesIDs = [];
let foundUserQuizz = false;
let userQuizzesData = [];

function getUserQuizzesIDs(){
    createdQuizzesIDs = JSON.parse(localStorage.getItem('myQuizzes'));
}

function hideCreateQuizzBox(hide){
    if (hide === true) {
        homePageELement.querySelector('.create-quizz').classList.add('hidden');
    }
    else if (hide === false){
        homePageELement.querySelector('.create-quizz').classList.remove('hidden');
    }
}

function hideUserQuizzes(hide){
    if (hide === true) {
        userQuizzesElement.parentElement.classList.add('hidden');
    }
    else if (hide === false){
        userQuizzesElement.parentElement.classList.remove('hidden');
    }

}

function filterUserQuizzes(quizzes){
    foundUserQuizz = false;
    userQuizzesData = [];
    getUserQuizzesIDs();
    if (createdQuizzesIDs) {
        for (let i = 0; i < quizzes.length; i++) {
            createdQuizzesIDs.forEach(quizzID => {
                if (quizzID === quizzes[i].id) {
                    foundUserQuizz = true;
                    userQuizzesData.push(quizzes.splice(i, 1));
                    i--;
                }
            });        
        }   
    }
     

    hideUserQuizzes(!foundUserQuizz);
    hideCreateQuizzBox(foundUserQuizz);
}


function startHomeClickEvents(){
     serverQuizzesElement.addEventListener('click', getClickedQuizzID);
     userQuizzesElement.addEventListener('click', getClickedQuizzID);

     homePageELement.querySelector('.create-quizz button').addEventListener('click', startCreation );
     homePageELement.querySelector('.add-quizz-button').addEventListener('click', startCreation );
}

function getServerQuizzes(){
    let promise = axiosBase.get();
    promise.then((value) => {
        
        filterUserQuizzes(value.data);
        renderUserQuizzes();
        renderServerQuizzes(value.data);
    });
}

function renderUserQuizzes(){
    userQuizzesElement.innerHTML = '';
    userQuizzesData.forEach(data => {
        userQuizzesElement.innerHTML += `
            <li class='quizz-card' name='quizz-ID-${data[0].id}'>
                <img src="${data[0].image}" alt="">
                <h4>${data[0].title}</h4>
                <div class='edit-delete-box'>
                    <ion-icon class='edit-quizz-button' name="create-outline"></ion-icon>
                    <ion-icon class='delete-quizz-button' name="trash-outline"></ion-icon>
                </div>
            </li>    
        `
    });
}


function renderServerQuizzes(quizzes){
    serverQuizzesElement.innerHTML = '';
    for (let i = 0; i < quizzes.length; i++) {
        serverQuizzesElement.innerHTML += `
            <li class='quizz-card' name='quizz-ID-${quizzes[i].id}'>
                <img src="${quizzes[i].image}" alt="">
                <h4>${quizzes[i].title}</h4>
            </li>
        `
    }
}

function renderLoaders(){
    serverQuizzesElement.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        serverQuizzesElement.innerHTML += `
            <li class="quizzes-list-loader">
                <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </li>
        `
        
    }
    userQuizzesElement.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        userQuizzesElement.innerHTML += `
            <li class="quizzes-list-loader">
                <div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </li>
        `
        
    }
}

function deletePrompt(target, clickedQuizzID){
    const deletionConfirm = window.confirm(`Quer mesmo deletar o quizz "${target.parentElement.parentElement.querySelector('h4').innerHTML}"?`);

    if (deletionConfirm) {
        deleteQuizz(clickedQuizzID);
        //backToHomePage();
    }
}

function getClickedQuizzOption(target, clickedQuizzID){
    if (target.tagName === 'LI' || target.tagName === 'H4') {
        startQuizz(clickedQuizzID);

    }else if (target.classList.contains('delete-quizz-button')) {
        deletePrompt(target, clickedQuizzID);

    } else if (target.classList.contains('edit-quizz-button')) {
        editQuizz(clickedQuizzID);

    }
}

function getClickedQuizzID(event){
    let clickedQuizzID;

    if (event.target.tagName === 'LI') {

        clickedQuizzID = Number(event.target.getAttribute('name').substring(9));

    } else if (event.target.tagName === 'H4') {

        clickedQuizzID = Number(event.target.parentElement.getAttribute('name').substring(9));

    } else if (event.target.tagName === 'ION-ICON'){

        clickedQuizzID = Number(event.target.parentElement.parentElement.getAttribute('name').substring(9));

    }

     if (typeof(clickedQuizzID) === 'number') {
        
        getClickedQuizzOption(event.target, clickedQuizzID);

     }
}

function hideHomePage(hide){
    if (hide === true){
        homePageELement.classList.add('hidden');
    }
    else if (hide === false){
        homePageELement.classList.remove('hidden');
    }
    
}

function backToHomePage(){
    hideCreationPage(true);
    hideQuizzPage(true);
    hideHomePage(false);
    scrollToHeader();
    renderLoaders();
    getServerQuizzes();
}

//////////////////////////////////////////////////////////////////////////////////
///////////////////////////colocar em quizz creation ////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
let creationPageELement = document.querySelector('#quizz-creation');

function startCreation(){
    hideHomePage(true);
    hideCreationPage(false);
}

function hideCreationPage(hide){
    if (hide === true){
        creationPageELement.classList.add('hidden');
    }
    else if (hide === false){
        creationPageELement.classList.remove('hidden');
    }
}
//////////////////////////////////////////////////////////////////////////////////////
export { startHomeClickEvents, getServerQuizzes, backToHomePage, hideHomePage, hideCreationPage, startCreation };