import { sendQuizzToServer, changeQuizzOnServer } from './buzzquizz_api.mjs';

const creationPage = {
    settings: document.getElementById("quizz-creation").children[0],
    questions: document.getElementById("quizz-creation").children[1],
    levels: document.getElementById("quizz-creation").children[2],
    endSection: document.getElementById("quizz-creation").children[3]
};

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

function createQuizzObject() {
    const settingsForm = creationPage.settings.querySelector("form");

    return {
        title: settingsForm.querySelector("input[type=text]").value,
        image: settingsForm.querySelector("input[type=url]").value,
        questions: getQuestionValues(),
        levels: quizzLevelsValues()
    };
}

function deleteQuestions() {
    const questions = creationPage.questions.querySelectorAll(".question");

    if (questions.length !== 0) {
        for (let i = questions.length - 1; i >= 0; i--) {
            questions[i].remove();
        }
    }
}

function deleteLevels() {
    const levels = creationPage.levels.querySelectorAll(".level");

    if (levels.length !== 0) {
        for (let i = levels.length - 1; i >= 0; i--) {
            levels[i].remove();
        }
    }
}

function validation(event) {
    const input = event.target;
    let dummy = input.parentElement;
    let form;

    while (dummy.tagName !== "FORM") {
        dummy = dummy.parentElement;
    }
    form = dummy;

    if (!input.validity.valid) {
        input.classList.add("invalid")
        form.reportValidity();
        return;
    }
    input.classList.remove("invalid");

    if (input.value !== "" && input.required === false) {
        if (input.nextElementSibling && input.nextElementSibling.type === "url") {
            input.nextElementSibling.required = true;

            let indexToRemove = input.nextElementSibling.placeholder.indexOf('(');
            if (indexToRemove > -1) {
                input.nextElementSibling.placeholder = input.nextElementSibling.placeholder.slice(0, indexToRemove);
            }
        }
    } else if (input.value === "" && input.required === false) {
        if (input.nextElementSibling && input.nextElementSibling.type === "url") {
            input.nextElementSibling.required = false;
            if (input.nextElementSibling.placeholder.indexOf('(') === -1) {
                input.nextElementSibling.placeholder = input.nextElementSibling.placeholder.concat("", "(opcional)");
            }
        }
    }
}

function formEvent(section, active) {
    const forms = section.querySelectorAll("form");

    if (active) {
        forms.forEach(element => element.addEventListener("change", validation));
        return;
    }
    forms.forEach(element => element.removeEventListener("change", validation));
}


function checkIfAllValid(section) {
    const forms = section.querySelectorAll("form");
    let formElement;
    let questionElement;

    forms.forEach(formElement => {
        if (!formElement.reportValidity()) {
            if (formElement.classList.contains("hidden")) {
                questionElement = formElement.parentElement
                questionElement.classList.add("invalid");
            }
            return false;
        }
    })
    return true;
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

function fillSettings() {
    const settingInputs = creationPage.settings.querySelectorAll("input");

    settingInputs[0].value = quizzToEdit.title;
    settingInputs[1].value = quizzToEdit.image;
    settingInputs[2].value = quizzToEdit.questions.length;
    settingInputs[3].value = quizzToEdit.levels.length;
}

function fillQuestions() {
    let questions = creationPage.questions.querySelectorAll("form");
    let formInputs;

    for (let i = 0; i < quizzToEdit.questions.length; i++) {
        if (!questions[i]) {
            break;
        }
        formInputs = questions[i].querySelectorAll("input");
        formInputs[0].value = quizzToEdit.questions[i].title;
        formInputs[1].value = quizzToEdit.questions[i].color;

        for (let j = 0; j < quizzToEdit.questions[i].answers.length; j++) {
            formInputs[2 * j + 2].value = quizzToEdit.questions[i].answers[j].text;
            formInputs[2 * j + 3].value = quizzToEdit.questions[i].answers[j].image;
        }
    }
};

function fillLevels() {
    let levels = creationPage.levels.querySelectorAll("form");
    let formInputs;

    for (let i = 0; i < quizzToEdit.levels.length; i++) {
        if (!levels[i]) {
            break;
        }
        formInputs = levels[i].querySelectorAll("input");
        formInputs[0].value = quizzToEdit.levels[i].title;
        formInputs[1].value = quizzToEdit.levels[i].minValue;
        formInputs[2].value = quizzToEdit.levels[i].image;
        levels[i].querySelector("textarea").value = quizzToEdit.levels[i].text;
    }
};

function quizzEditionHandler(quizz) {
    quizzToEdit = quizz;
    fillSettings()
}

function changeVisibility(question) {
    const titleContainer = question.querySelector(".title-container")
    const editionIcon = titleContainer.querySelector("img");
    const form = question.querySelector("form");

    editionIcon.classList.toggle("hidden");
    form.classList.toggle("hidden");
    question.classList.remove("invalid");
}

function createTitleContainer(questionNumber, answerOrLevel) {
    const titleContainer = document.createElement("div");
    const title = document.createElement("h3");
    const editionIcon = document.createElement("img");

    if (answerOrLevel.toLowerCase() === "answer") {
        title.innerHTML = "Pergunta " + questionNumber;
    } else if (answerOrLevel.toLowerCase() === "level") {
        title.innerHTML = "Nivel " + questionNumber;
    } else {
        throw "No such possibility for 'answerOrLevel'";
    }
    editionIcon.classList.add("hidden");
    editionIcon.src = "./assets/edit.png";

    titleContainer.classList.add("title-container");

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
    questionColorInput.pattern = "#([A-f]|[0-9]){6}";
    questionColorInput.required = true;

    questionClasses.forEach(elementClass => questionContainer.classList.add(elementClass));

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

            if (i > 0) {
                answerTextInput.placeholder += " (opcional)";
                answerImgInput.placeholder += " (opcional)";
            }
        }
        if (i === 0) {
            answerTextInput.required = true;
            answerImgInput.required = true;
        }
        answerClasses.forEach(elementClass => li.classList.add(elementClass));

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

function createQuestions(numberOfQuestions = false) {
    const sectionElement = creationPage.questions;
    const endOfSectioButton = sectionElement.querySelector("button");
    numberOfQuestions = numberOfQuestions || creationPage.settings.querySelector("input[type='number']").value;
    let questionContainer;

    for (let i = 0; i < numberOfQuestions; i++) {
        questionContainer = document.createElement("div");
        questionContainer.classList.add("question");

        questionContainer.appendChild(createTitleContainer(i + 1, "answer"));
        questionContainer.appendChild(createQuestionContentContainer());
        sectionElement.insertBefore(questionContainer, endOfSectioButton);

        if (i !== 0) {
            changeVisibility(questionContainer);
        }
    }
}

function createLevelContentContainer(levelNumber) {
    const contentContainer = document.createElement("form");
    const levelTitleInput = document.createElement("input");
    const levelPercentageInput = document.createElement("input");
    const levelimgInput = document.createElement("input");
    const levelDescriptionInput = document.createElement("textarea");

    levelTitleInput.type = "text";
    levelTitleInput.placeholder = "Título do nível";
    levelTitleInput.minLength = "10";
    levelTitleInput.required = true;

    levelPercentageInput.type = "number";
    levelPercentageInput.placeholder = "% de acerto mínima";
    levelPercentageInput.required = true;

    if (levelNumber === 1) {
        levelPercentageInput.min = 0;
        levelPercentageInput.max = 0;
    } else {
        levelPercentageInput.min = 1;
        levelPercentageInput.max = 100;
    }
    levelimgInput.type = "url";
    levelimgInput.placeholder = "URL da imagem do nível"
    levelimgInput.required = true;

    levelDescriptionInput.rows = 2;
    levelDescriptionInput.minLength = "30";
    levelDescriptionInput.placeholder = "Descrição do nível";
    levelDescriptionInput.required = true;
    levelDescriptionInput.classList.add("level-description");

    contentContainer.classList.add("question-content-container");
    contentContainer.classList.add("inputs");

    contentContainer.appendChild(levelTitleInput);
    contentContainer.appendChild(levelPercentageInput);
    contentContainer.appendChild(levelimgInput);
    contentContainer.appendChild(levelDescriptionInput);

    return contentContainer;
}

function createlevels(numberOfLevels) {
    const sectionElement = creationPage.levels;
    const endOfSectioButton = sectionElement.querySelector("button");
    numberOfLevels = numberOfLevels || (creationPage.settings.querySelectorAll("input[type='number']"))[1].value;
    let levelContainer;

    for (let i = 0; i < numberOfLevels; i++) {
        levelContainer = document.createElement("div");
        levelContainer.classList.add("level");

        levelContainer.appendChild(createTitleContainer(i + 1, "level"));
        levelContainer.appendChild(createLevelContentContainer(i + 1));
        sectionElement.insertBefore(levelContainer, endOfSectioButton);

        if (i !== 0) {
            changeVisibility(levelContainer);
        }
    }
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

function openNextSection(event) {
    const button = event.target;
    const sectionElement = button.parentElement;

    if (checkIfAllValid(sectionElement)) {
        sectionElement.classList.add("hidden");
        sectionElement.nextElementSibling.classList.remove("hidden");

        if (sectionElement === creationPage.settings) {
            createQuestions();
            activeHideEvent(creationPage.questions);
            formEvent(creationPage.questions, true);

            if (quizzToEdit) {
                fillQuestions();
            }
        } else if (sectionElement === creationPage.questions) {
            formEvent(creationPage.settings, false);

            createlevels();
            activeHideEvent(creationPage.levels);
            formEvent(creationPage.levels, true);

            if (quizzToEdit) {
                fillLevels();
            }
        } else if (sectionElement === creationPage.levels) {
            formEvent(creationPage.questions, false);
            refreshQuizzCoverPage();
        }
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

function endQuizzButtonHandler(event) {
    auxFuncs.loaderFunction(false);
    let changed = openNextSection(event);

    if(!changed) {
        return;
    }
    
    if (quizzToEdit) {
        changeQuizzOnServer(quizzToEdit.id, createQuizzObject())
            .then(response => auxFuncs.loaderFunction(true));
    } else {
        sendQuizzToServer(createQuizzObject())
            .then(response => {
                actualQuizz.id = response.data.id;
                auxFuncs.loaderFunction(true);
            });
    }
    quizzToEdit = false;
}

function openQuizz(event) {
    auxFuncs.loaderFunction(false);
    resetCreationPage()
    auxFuncs.openQuizzFunction(actualQuizz.id);
}

function homeButtonHandler(event) {
    auxFuncs.loaderFunction(false);
    resetCreationPage();
    auxFuncs.homePageActivationFunction();
}

function activateCreationEvents(loaderFunction, openQuizzFunction, homePageActivationFunction) {
    auxFuncs = {
        loaderFunction,
        openQuizzFunction,
        homePageActivationFunction,
    };
    formEvent(creationPage.settings, true);
    creationPage.settings.querySelector("button").addEventListener("click", openNextSection);
    creationPage.questions.querySelector("button").addEventListener("click", openNextSection);
    creationPage.levels.querySelector(".end-quizz").addEventListener("click", endQuizzButtonHandler);
    creationPage.endSection.querySelector(".open-quizz").addEventListener("click", openQuizz);
    creationPage.endSection.querySelector(".back-to-home").addEventListener("click", homeButtonHandler);
}

function removeCreationEvents(sendQuizzFunction, openQuizzFunction, homePageActivationFunction) {
    formEvent(creationPage.settings, false);
    creationPage.settings.querySelector("button").removeEventListener("click", openNextSection);
    creationPage.questions.querySelector("button").removeEventListener("click", openNextSection);
    creationPage.levels.querySelector(".end-quizz").removeEventListener("click", event => {
        openNextSection(event);
        sendQuizzFunction(event);
    });
    creationPage.endSection.querySelector(".open-quizz").removeEventListener("click", visitQuizzFunction);
    creationPage.endSection.querySelector(".back-to-home").removeEventListener("click", homePageActivationFunction);
}

export { activateCreationEvents, removeCreationEvents, quizzEditionHandler };
