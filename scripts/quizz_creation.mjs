export { activeFormEvent, activeNextButtonsEvent, activeQuestionEvent, visitQuizzCreated, backToHome };

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
    let questionContentContainer;
    let questionElement;

    for (let formIndex = 0; formIndex < forms.length; formIndex++) {
        formElement = forms[formIndex];

        if (!formElement.reportValidity()) {
            if (formElement.classList.contains("hidden")) {
                questionElement = formElement.parentElement
                questionElement.classList.add("invalid");
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

function createQuestionTitleContainer(questionNumber) {
    const titleContainer = document.createElement("div");
    const title = document.createElement("h3");
    const editionIcon = document.createElement("img");

    title.innerHTML = "Pergunta " + questionNumber;

    editionIcon.classList.add("hidden");
    editionIcon.src = "./assets/edit.png";

    titleContainer.classList.add("question-title-container");

    titleContainer.appendChild(title);
    titleContainer.appendChild(editionIcon);

    return titleContainer;
}

function createQuestionContainer(questionClasses) {
    const questionContainer = document.createElement("div");
    const questionTextInput = document.createElement("input");
    const questionColorInput = document.createElement("input");

    questionTextInput.type = "text";
    questionTextInput.placeholder = "Texto da pergunta";
    questionTextInput.minLength = "20";
    questionTextInput.required = true;

    questionColorInput.type = "text";
    questionColorInput.placeholder = "Cor de fundo da pergunta (hexadecimal, ex: #fafafa)";
    questionColorInput.pattern = "#[A-f]{6}";
    questionColorInput.required = true;

    for (let singleClass of questionClasses) {
        questionContainer.classList.add(singleClass);
    }

    questionContainer.appendChild(questionTextInput);
    questionContainer.appendChild(questionColorInput);

    return questionContainer;
}

function createAnswers(numberOfAnswers, answerClasses) {
    const ul = document.createElement("ul");
    let li;
    let answerTextInput;
    let answerImgInput;

    for (let i = 0; i < numberOfAnswers; i++) {
        li = document.createElement("li");
        answerTextInput = document.createElement("input");
        answerImgInput = document.createElement("input");

        answerTextInput.type = "text";
        answerImgInput.type = "url";

        if (answerClasses.includes("correct-answer")) {
            answerTextInput.placeholder = "Resposta correta ";
            answerImgInput.placeholder = "URL da imagem";
        } else {
            answerTextInput.placeholder = "Resposta incorreta " + (i + 1);
            answerImgInput.placeholder = "URL da imagem " + (i + 1);
        }
        if (i === 0) {
            answerTextInput.required = true;
            answerImgInput.required = true;
        }

        for (let singleClass of answerClasses) {
            li.classList.add(singleClass);
        }

        li.appendChild(answerTextInput);
        li.appendChild(answerImgInput);
        ul.appendChild(li);
    }
    return ul;
}

function createQuestionContentContainer() {
    const contentContainer = document.createElement("form");
    const questionInputsContainer = createQuestionContainer(["inputs"]);
    const correctAnswerTitle = document.createElement("h3");
    const wrongAnswerTitle = document.createElement("h3");
    const correctAnswerContainer = createAnswers(1, ["inputs", "correct-answer"]);
    const wrongAnswersContainer = createAnswers(3, ["inputs", "wrong-answer"]);

    correctAnswerTitle.innerHTML = "Resposta correta";
    wrongAnswerTitle.innerHTML = "Respostas incorretas";

    contentContainer.classList.add("question-content-container");

    contentContainer.appendChild(questionInputsContainer);
    contentContainer.appendChild(correctAnswerTitle);
    contentContainer.appendChild(correctAnswerContainer);
    contentContainer.appendChild(wrongAnswerTitle);
    contentContainer.appendChild(wrongAnswersContainer);

    return contentContainer;
}

function createquestions(sectionElement) {
    const endOfSectioButton = sectionElement.querySelector("button");
    const settingsSection = (sectionElement.parentElement.children)[creationPage.section.settings];
    const numberOfQuestions = settingsSection.querySelector("input[type='number']").value;
    let questionContainer;

    for (let i = 0; i < numberOfQuestions; i++) {
        questionContainer = document.createElement("div");
        questionContainer.classList.add("question");

        questionContainer.appendChild(createQuestionTitleContainer(i + 1));
        questionContainer.appendChild(createQuestionContentContainer());
        sectionElement.insertBefore(questionContainer, endOfSectioButton);

        if (i !== 0) {
            changeQuestionVisibility(questionContainer);
        }
    }
}

function createlevels(sectionElement) { }

function openNextSection(event) {
    const button = event.target;
    const sectionElement = button.parentElement;
    const allSections = sectionElement.parentElement.children;

    if (checkIfAllValid(sectionElement)) {
        sectionElement.classList.add("hidden");
        sectionElement.nextElementSibling.classList.remove("hidden");

        if (sectionElement === allSections[creationPage.section.settings]) {
            createquestions(allSections[creationPage.section.questions]);
            activeQuestionEvent(allSections[creationPage.section.questions]);
        }
        if (sectionElement === allSections[creationPage.section.questions]) {
            createlevels(allSections[creationPage.section.levels]);
        }
        if (sectionElement === allSections[creationPage.section.levels]) {
            refreshQuizzCoverPage(allSections[creationPage.section.endSection]);
        }
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

function changeQuestionVisibility(question) {
    const questionTitle = question.querySelector(".question-title-container")
    const editionIcon = questionTitle.querySelector("img");
    const questionForm = question.querySelector("form");

    editionIcon.classList.toggle("hidden");
    questionForm.classList.toggle("hidden");
    question.classList.remove("invalid");
}

function getQuestionFromClick(event) {
    if (event.target.classList.contains("question")) {
        return event.target;
    }
    if (event.target.classList.contains("question-title-container")) {
        return event.target.parentElement;
    }
    if (event.target.parentElement.classList.contains("question-title-container")) {
        return event.target.parentElement.parentElement;
    }
    return false;
}

function clickToHideQuestion(event) {
    const question = getQuestionFromClick(event);

    if (question) {
        changeQuestionVisibility(question);
    }
}

function activeQuestionEvent(sectionElement) {
    const questions = sectionElement.querySelectorAll(".question");

    for (let i = 0; i < questions.length; i++) {
        questions[i].addEventListener("click", clickToHideQuestion);
    }
}
