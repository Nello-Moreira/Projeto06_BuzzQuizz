export { activeTriggerEvents, removeTriggerEvents, visitQuizzCreated, backToHome };

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

function formEvent(sectionElement, active) {
    const forms = sectionElement.querySelectorAll("form");
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
            if (i > 0) {
                answerTextInput.placeholder += " (opcional)";
                answerImgInput.placeholder += " (opcional)";
            }
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

function createQuestions(sectionElement) {
    const endOfSectioButton = sectionElement.querySelector("button");
    const settingsSection = (sectionElement.parentElement.children)[creationPage.section.settings];
    const numberOfQuestions = settingsSection.querySelector("input[type='number']").value;
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
    levelTitleInput.minlength = 10;
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
    levelDescriptionInput.minLength = 30;
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

function createlevels(sectionElement) {
    const endOfSectioButton = sectionElement.querySelector("button");
    const settingsSection = (sectionElement.parentElement.children)[creationPage.section.settings];
    const numberOfLevels = (settingsSection.querySelectorAll("input[type='number']"))[1].value;
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

function openNextSection(event) {
    const button = event.target;
    const sectionElement = button.parentElement;
    const allSections = sectionElement.parentElement.children;
    
    if (checkIfAllValid(sectionElement)) {
        sectionElement.classList.add("hidden");
        sectionElement.nextElementSibling.classList.remove("hidden");
        
        if (sectionElement === allSections[creationPage.section.settings]) {
            createQuestions(allSections[creationPage.section.questions]);
            activeHideEvent(allSections[creationPage.section.questions]);
            formEvent(allSections[creationPage.section.questions], true);
        }
        if (sectionElement === allSections[creationPage.section.questions]) {
            formEvent(allSections[creationPage.section.settings], false);

            createlevels(allSections[creationPage.section.levels]);
            activeHideEvent(allSections[creationPage.section.levels]);
            formEvent(allSections[creationPage.section.levels], true);
        }
        if (sectionElement === allSections[creationPage.section.levels]) {
            formEvent(allSections[creationPage.section.questions], false);
            refreshQuizzCoverPage(allSections[creationPage.section.endSection]);
        }
    }
}

function changeVisibility(question) {
    const titleContainer = question.querySelector(".title-container")
    const editionIcon = titleContainer.querySelector("img");
    const form = question.querySelector("form");
    
    editionIcon.classList.toggle("hidden");
    form.classList.toggle("hidden");
    question.classList.remove("invalid");
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

function clickToHideQuestion(event) {
    const sectionChild = getSectionChildFromClick(event); // this can be a question or a level

    if (sectionChild) {
        changeVisibility(sectionChild);
    }
}

function activeHideEvent(sectionElement) {
    let sectionChilds;
    
    if (sectionElement === getSectionElement(creationPage.section.questions)) {
        sectionChilds = sectionElement.querySelectorAll(".question");
    } else if (sectionElement === getSectionElement(creationPage.section.levels)) {
        sectionChilds = sectionElement.querySelectorAll(".level");
    }

    sectionChilds.forEach(element => element.addEventListener("click", clickToHideQuestion));
}

function activeTriggerEvents() {
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

        if (creationPage.section[sectionIndex] === creationPage.section.settings) {
            formEvent(sectionElement, true);
        }
    }
}

function removeTriggerEvents(){
    let sectionElement = "";
    let button = "";

    for (let sectionIndex in creationPage.section) {
        sectionElement = getSectionElement(creationPage.section[sectionIndex]);
        button = sectionElement.querySelector("button");

        if (button.classList.length === 1) {
            button.removeEventListener("click", openNextSection);
        }
        if (button.classList.contains("open-quizz")) {
            button.removeEventListener("click", visitQuizz);
        }
        if (button.classList.contains("back-to-home")) {
            button.removeEventListener("click", goBackToHome);
        }

        if (creationPage.section[sectionIndex] === creationPage.section.settings) {
            formEvent(sectionElement, false);
        }
    }
}