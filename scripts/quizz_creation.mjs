export { activeFormEvent, activeNextButtonsEvent, activeQuestionEvent };

const creationPage = {
    section: {
        settings: 0,
        questions: 1,
        levels: 2,
        endSection: 3
    }
};

let visitQuizzCreated = false;
let backToHome = false;

function getSectionElement(section) {
    const page = document.getElementById("quizz-creation");
    return page.children[section];
}

function validation(event) {
    const input = event.target;
    let dummy = input.parentElement;

    while (dummy.tagName !== "FORM") {
        dummy = dummy.parentElement;
    }
    const form = dummy;

    if (!input.validity.valid) {
        input.classList.add("invalid")
        form.reportValidity();
        return;
    }
    input.classList.remove("invalid");
}

function activeFormEvent() {
    let sectionElement = "";
    let forms = "";
    let formElement = "";

    for (let sectionIndex in creationPage.section) {
        sectionElement = getSectionElement(creationPage.section[sectionIndex]);
        forms = sectionElement.querySelectorAll("form");
        for (let formIndex = 0; formIndex < forms.length; formIndex++) {
            formElement = forms[formIndex];
            formElement.addEventListener("change", validation);
        }
    }
}

function removeFormEvent() {
    let sectionElement = "";
    let forms = "";
    let formElement = "";

    for (let sectionIndex in creationPage.section) {
        sectionElement = getSectionElement(creationPage.section[sectionIndex]);
        forms = sectionElement.querySelectorAll("form");
        for (let formIndex = 0; formIndex < forms.length; formIndex++) {
            formElement = forms[formIndex];
            formElement.removeEventListener("change", validation);
        }
    }
}

function checkIfAllValid(section) {
    const forms = section.querySelectorAll("form");
    let formElement;

    for (let formIndex = 0; formIndex < forms.length; formIndex++) {
        formElement = forms[formIndex];

        if (!formElement.reportValidity()) {
            if (formElement.parentElement.classList.contains("hidden")) {
                formElement.parentElement.parentElement.classList.add("invalid");
            }
            return false;
        }
    }
    return true;
}

function refreshQuizzCoverPage(endSection) {
    const quizzCover = endSection.querySelector(".quizz-cover")
    const quizzCoverImgElement = quizzCover.querySelector("img");
    const quizzCoverTitleElement = quizzCover.querySelector("h2");
    const allSections = document.querySelector("#quizz-creation").children
    const inputTitle = allSections[creationPage.section.settings].querySelector("input[type='text']");
    const inputCoverImg = allSections[creationPage.section.settings].querySelector("input[type='url']");

    quizzCoverImgElement.src = inputCoverImg.value;
    quizzCoverTitleElement.innerHTML = inputTitle.value;
}

function visitQuizz(event) {
    visitQuizzCreated = true;
}

function goBackToHome(event) {
    backToHome = true;
}

function openNextSection(event) {
    const button = event.target;
    const sectionElement = button.parentElement;
    const allSections = sectionElement.parentElement.children;

    if (checkIfAllValid(sectionElement)) {
        sectionElement.classList.add("hidden");
        sectionElement.nextElementSibling.classList.remove("hidden");
    }

    if (sectionElement.nextElementSibling === allSections[creationPage.section.endSection]) {
        refreshQuizzCoverPage(allSections[creationPage.section.endSection]);
    }
}

function activeNextButtonsEvent() {
    let sectionElement = "";
    let button = "";

    for (let sectionIndex in creationPage.section) {
        sectionElement = getSectionElement(creationPage.section[sectionIndex]);
        button = sectionElement.querySelector("button");

        if (button.classList.length === 1) {
            button.addEventListener("click", openNextSection);
        }
        if (button.classList.contains("open-quizz")) {
            button.addEventListener("click", visitQuizz);
        }
        if (button.classList.contains("back-to-home")) {
            button.addEventListener("click", goBackToHome);
        }
    }
}

function removeNextButtonsEvent() {
    let sectionElement = "";
    let button = "";

    for (let sectionIndex in creationPage.section) {
        sectionElement = getSectionElement(creationPage.section[sectionIndex]);
        button = sectionElement.querySelector("button");

        if (button.classList.length === 0) {
            button.removeEventListener("click", openNextSection);
        }
    }
}

function clickToHideQuestion(event) {
    let questionTitle = "";

    if (event.target.classList.contains("question-title-container")) {
        questionTitle = event.target;
    } else {
        questionTitle = event.target.parentElement;
    }

    const editionIcon = questionTitle.querySelector("img");
    const questionContent = questionTitle.nextElementSibling;

    editionIcon.classList.toggle("hidden");
    questionContent.classList.toggle("hidden");
    questionTitle.parentElement.classList.remove("invalid");
}

function activeQuestionEvent() {
    const page = document.querySelector("#quizz-creation");
    const questions = page.querySelectorAll(".question-title-container");
    let questionTitleText = "";
    let questionTitleImage = "";

    for (let i = 0; i < questions.length; i++) {
        questions[i].addEventListener("click", clickToHideQuestion);
    }
}
