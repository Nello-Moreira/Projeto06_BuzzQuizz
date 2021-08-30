import { sendQuizzToServer, changeQuizzOnServer } from '../api/buzzquizz_api.mjs';
import { createQuestions, deleteQuestions } from '../containers/questionInputsContainer.mjs';
import { createLevels, deleteLevels } from '../containers/levelInputsContainer.mjs';
import { pages, creationPage, activatePage, changeVisibility } from '../auxiliar/auxiliar.mjs';

let quizzToEdit = false;

const actualQuizz = {
    id: ""
};

let auxFuncs = {};

function getQuestionValues() {
    const questions = [];
    let answers;
    let questionInputs;

    creationPage.questions.querySelectorAll("form").forEach(form => {
        questionInputs = form.querySelectorAll("input");

        answers = [];
        for (let j = 2; j < questionInputs.length; j += 2) {
            if (questionInputs[j].value !== "") {
                answers.push({
                    text: questionInputs[j].value,
                    image: questionInputs[j + 1].value,
                    isCorrectAnswer: j === 2
                });
            }
        }
        questions.push({
            title: questionInputs[0].value,
            color: questionInputs[1].value,
            answers
        })
    })
    return questions;
}

function quizzLevelsValues() {
    const levels = [];
    let levelInputs;

    creationPage.levels.querySelectorAll("form").forEach(form => {
        levelInputs = form.querySelectorAll("input");

        levels.push({
            title: levelInputs[0].value,
            image: levelInputs[2].value,
            text: form.querySelector("textarea").value,
            minValue: Number(levelInputs[1].value)
        })
    })
    return levels;
}

function changeInputPlaceholder(input, required) {
    if (required) {
        let indexToRemove = input.placeholder.indexOf('(');

        input.placeholder = input.placeholder.slice(0, indexToRemove);
        return;
    }
    input.placeholder = input.placeholder.concat("", "(opcional)");
}

function changeSiblingsRequirement(input, required) {
    const parentElement = input.parentElement;
    const siblings = parentElement.childNodes;
    
    siblings.forEach(sibling=>{
        sibling.required = required;
        changeInputPlaceholder(sibling, required);
    })
}

function validation(event) {
    const input = event.target;
    let dummy = input.parentElement;
    let form;

    while (dummy.tagName !== "FORM") {
        dummy = dummy.parentElement;
    }
    form = dummy;

    const wrongAnswers = form.querySelectorAll("wrong-answer");
    
    if (input.value !== "" && input.parentNode !== wrongAnswers[0]) {
        changeSiblingsRequirement(input, true);
    } else if (input.value === "" && input.parentNode !== wrongAnswers[0]) {
        changeSiblingsRequirement(input, false);
    }
    
    if (!input.validity.valid) {
        input.classList.add("invalid")
        form.reportValidity();
        return;
    }
    input.classList.remove("invalid");
}

function formEvent(section, active) {
    const forms = section.querySelectorAll("form");

    if (active) {
        forms.forEach(element => element.addEventListener("change", validation));
        return;
    }
    forms.forEach(element => element.removeEventListener("change", validation));
}

function fillSettings() {
    const settingInputs = creationPage.settings.querySelectorAll("input");

    settingInputs[0].value = quizzToEdit.title;
    settingInputs[1].value = quizzToEdit.image;
    settingInputs[2].value = quizzToEdit.questions.length;
    settingInputs[3].value = quizzToEdit.levels.length;
}

function quizzEditionHandler(quizz) {
    quizzToEdit = quizz;
    fillSettings()
}

function getSectionChildFromClick(event) {
    if (event.target.classList.contains("question") || event.target.classList.contains("level")) {
        return event.target;
    }
    if (event.target.classList.contains("title-container")) {
        return event.target.parentElement;
    }
    if (event.target.parentElement.classList.contains("title-container")) {
        return event.target.parentElement.parentElement;
    }
    return false;
}

function clickToHide(event) {
    const sectionChild = getSectionChildFromClick(event); // this can be a question or a level

    if (sectionChild) {
        changeVisibility(sectionChild);
    }
}

function activeHideEvent(sectionElement) {
    let sectionChilds;

    if (sectionElement === creationPage.questions) {
        sectionChilds = sectionElement.querySelectorAll(".question");
    } else if (sectionElement === creationPage.levels) {
        sectionChilds = sectionElement.querySelectorAll(".level");
    }
    sectionChilds.forEach(element => element.addEventListener("click", clickToHide));
}

function refreshQuizzCoverPage() {
    const quizzCover = creationPage.endSection.querySelector(".quizz-cover")
    const quizzCoverImgElement = quizzCover.querySelector("img");
    const quizzCoverTitleElement = quizzCover.querySelector("h2");
    const inputTitle = creationPage.settings.querySelector("input[type='text']");
    const inputCoverImg = creationPage.settings.querySelector("input[type='url']");

    quizzCoverImgElement.src = inputCoverImg.value;
    quizzCoverTitleElement.innerHTML = inputTitle.value;
}

function setNextSection(nextSection) {
    if (nextSection === creationPage.questions) {
        formEvent(creationPage.settings, false);
        createQuestions(quizzToEdit);
        activeHideEvent(creationPage.questions);
        formEvent(creationPage.questions, true);

    } else if (nextSection === creationPage.levels) {
        formEvent(creationPage.questions, false);
        createLevels(quizzToEdit);
        activeHideEvent(creationPage.levels);
        formEvent(creationPage.levels, true);

    } else if (nextSection === creationPage.endSection) {
        formEvent(creationPage.levels, false);
        refreshQuizzCoverPage();
    }
}

function checkIfAllValid(section) {
    const forms = section.querySelectorAll("form");
    let questionElement;
    let valid = true;

    forms.forEach(formElement => {
        if (!formElement.reportValidity()) {
            if (formElement.classList.contains("hidden")) {
                questionElement = formElement.parentElement
                questionElement.classList.add("invalid");
            }
            valid = false;
        }
    })
    return valid;
}

function openNextSection(event) {
    const button = event.target;
    const sectionElement = button.parentElement;

    if (checkIfAllValid(sectionElement)) {
        setNextSection(sectionElement.nextElementSibling);

        sectionElement.classList.add("hidden");
        sectionElement.nextElementSibling.classList.remove("hidden");

        return true;
    }
    return false;
}

function resetCreationPage() {
    const settingsInputs = creationPage.settings.querySelectorAll("input");
    creationPage.settings.classList.remove("hidden");
    creationPage.endSection.classList.add("hidden");
    settingsInputs.forEach(element => element.value = "");

    deleteQuestions();
    deleteLevels();
}

function createQuizzObject() {
    const settingsForm = creationPage.settings.querySelector("form");

    return {
        title: settingsForm.querySelector("input[type=text]").value,
        image: settingsForm.querySelector("input[type=url]").value,
        questions: getQuestionValues(),
        levels: quizzLevelsValues()
    };
}

function endQuizzButtonHandler(event) {
    activatePage(pages.loader);
    let changed = openNextSection(event);

    if (!changed) {
        return;
    }

    if (quizzToEdit) {
        changeQuizzOnServer(quizzToEdit.id, createQuizzObject())
            .then(response => {
                actualQuizz.id = response.data.id;
                activatePage(pages.creation)
            });
    } else {
        sendQuizzToServer(createQuizzObject())
            .then(response => {
                actualQuizz.id = response.data.id;
                activatePage(pages.creation);
            });
    }
    quizzToEdit = false;
}

function openQuizz(event) {
    activatePage(pages.loader);
    resetCreationPage();
    auxFuncs.openQuizzFunction(actualQuizz.id);
}

function homeButtonHandler(event) {
    activatePage(pages.loader);
    resetCreationPage();
    auxFuncs.refreshHomePageFunction();
}

function activateCreationEvents(openQuizzFunction, refreshHomePageFunction) {
    auxFuncs = {
        openQuizzFunction,
        refreshHomePageFunction
    };
    formEvent(creationPage.settings, true);
    creationPage.settings.querySelector("button").addEventListener("click", openNextSection);
    creationPage.questions.querySelector("button").addEventListener("click", openNextSection);
    creationPage.levels.querySelector(".end-quizz").addEventListener("click", endQuizzButtonHandler);
    creationPage.endSection.querySelector(".open-quizz").addEventListener("click", openQuizz);
    creationPage.endSection.querySelector(".back-to-home").addEventListener("click", homeButtonHandler);
}

export { activateCreationEvents, quizzEditionHandler };
