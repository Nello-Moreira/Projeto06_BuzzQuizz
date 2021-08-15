import { axiosBase, hideLoader } from './overall.mjs';
import { backToHomePage, startCreation } from './home.mjs';
import { startQuizz } from './quizz_questions.mjs';


const creationPage = {
    section: {
        settings: 0,
        questions: 1,
        levels: 2,
        endSection: 3
    }
};

const newQuizz = {
    id: ""
};

const creatingQuizz = true;

function getSectionElement(section) {
    const page = document.getElementById("quizz-creation");
    return page.children[section];
}

function quizzQuestionValues(questionsSection) {
    const questions = [];
    const questionForms = questionsSection.querySelectorAll("form");
    let answers;
    let questionInputs;

    for (let i = 0; i < questionForms.length; i++) {
        questionInputs = questionForms[i].querySelectorAll("input");

        answers = [];
        for (let j = 2; j < questionInputs.length; j += 2) {
            if (questionInputs[j].value === "") {
                break;
            }

            answers.push({
                text: questionInputs[j].value,
                image: questionInputs[j + 1].value,
                isCorrectAnswer: j === 2
            });
        }

        questions.push({
            title: questionInputs[0].value,
            color: questionInputs[1].value,
            answers
        })
    }
    return questions;
}

function quizzLevelsValues(levelsSection) {
    const levels = [];
    const levelForms = levelsSection.querySelectorAll("form");

    let levelInputs;

    for (let i = 0; i < levelForms.length; i++) {
        levelInputs = levelForms[i].querySelectorAll("input");

        levels.push({
            title: levelInputs[0].value,
            image: levelInputs[2].value,
            text: levelForms[i].querySelector("textarea").value,
            minValue: Number(levelInputs[1].value)
        })
    }

    return levels;
}

function createQuizzObject() {
    const settingsSection = getSectionElement(creationPage.section.settings);
    const questionsSection = getSectionElement(creationPage.section.questions);
    const levelsSection = getSectionElement(creationPage.section.levels);
    const settingsForm = settingsSection.querySelector("form");

    return {
        title: settingsForm.querySelector("input[type=text]").value,
        image: settingsForm.querySelector("input[type=url]").value,
        questions: quizzQuestionValues(questionsSection),
        levels: quizzLevelsValues(levelsSection)
    };
}

function getUserQuizzesIDs() {
    const myQuizzes = localStorage.getItem("myQuizzes");

    if (!myQuizzes) {
        return [];
    }
    return JSON.parse(myQuizzes);
}

function getUserQuizzesKeys(){
    const myQuizzesKeys = localStorage.getItem("myQuizzesKeys");
    if (!myQuizzesKeys) {
        return {};
    }
    return JSON.parse(myQuizzesKeys);
}

function setUserQuizzesIDs(idsArray){
    idsArray = JSON.stringify(idsArray);
    localStorage.setItem("myQuizzes", idsArray);
}

function setUserQuizzesKeys(idsObject){
    idsObject = JSON.stringify(idsObject);
    localStorage.setItem("myQuizzesKeys", idsObject);
}

function saveQuizz(response) {
    let myQuizzes = getUserQuizzesIDs();
    let myQuizzesKeys = getUserQuizzesKeys();

    myQuizzes.push(response.data.id);
    myQuizzesKeys[response.data.id.toString()] = response.data.key;
    setUserQuizzesIDs(myQuizzes);
    setUserQuizzesKeys(myQuizzesKeys);
    
    newQuizz.id = response.data.id;
}

function sendQuizzToServer(quizz) {
    axiosBase.post("", quizz)
        .then((response) => {
            hideLoader(true);
            saveQuizz(response);
        });
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

function createQuestions(sectionElement, numberOfQuestions=false) {
    const endOfSectioButton = sectionElement.querySelector("button");
    const settingsSection = (sectionElement.parentElement.children)[creationPage.section.settings];
    numberOfQuestions = numberOfQuestions || settingsSection.querySelector("input[type='number']").value;
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

function deleteQuestions() {
    const questionsSection = getSectionElement(creationPage.section.questions);
    const questions = questionsSection.querySelectorAll(".question");

    for (let i = questions.length - 1; i >= 0; i--) {
        questions[i].remove();
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

function createlevels(sectionElement, numberOfLevels) {
    const endOfSectioButton = sectionElement.querySelector("button");
    const settingsSection = (sectionElement.parentElement.children)[creationPage.section.settings];
    numberOfLevels = numberOfLevels || (settingsSection.querySelectorAll("input[type='number']"))[1].value;
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

function deleteLevels() {
    const levelsSection = getSectionElement(creationPage.section.levels);
    const levels = levelsSection.querySelectorAll(".level");

    for (let i = levels.length - 1; i >= 0; i--) {
        levels[i].remove();
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
            hideLoader(false);


            sendQuizzToServer(createQuizzObject());
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

function resetCreationPage() {
    const settings = getSectionElement(creationPage.section.settings);
    const endSection = getSectionElement(creationPage.section.endSection);
    const settingsInputs = settings.querySelectorAll("input");
    settings.classList.remove("hidden");
    endSection.classList.add("hidden");
    settingsInputs.forEach(element => { element.value = "" });

    deleteQuestions();
    deleteLevels();
}

function visitQuizz(event) {
    resetCreationPage()
    startQuizz(newQuizz.id);
}

function homeButtonHandler(event) {
    resetCreationPage();
    backToHomePage();
}

function activeTriggerEvents() {
    let sectionElement = "";
    let button1;
    let button2;

    for (let sectionIndex in creationPage.section) {
        sectionElement = getSectionElement(creationPage.section[sectionIndex]);
        button1 = sectionElement.querySelector("button");

        if (button1.classList.length === 1 || button1.classList.contains("end-quizz")) {
            button1.addEventListener("click", openNextSection);
        }
        if (button1.classList.contains("open-quizz")) {
            button1.addEventListener("click", visitQuizz);
        }

        if (creationPage.section[sectionIndex] === creationPage.section.settings) {
            formEvent(sectionElement, true);
        }
    }
    button2 = (sectionElement.querySelectorAll("button"))[1];
    if (button2.classList.contains("back-to-home")) {
        button2.addEventListener("click", homeButtonHandler);
    }
}

function removeTriggerEvents() {
    let sectionElement = "";
    let button = "";

    for (let sectionIndex in creationPage.section) {
        sectionElement = getSectionElement(creationPage.section[sectionIndex]);
        button1 = sectionElement.querySelector("button");

        if (button1.classList.length === 1) {
            button1.removeEventListener("click", openNextSection);
        }
        if (button1.classList.contains("open-quizz")) {
            button1.removeEventListener("click", visitQuizz);
        }


        if (creationPage.section[sectionIndex] === creationPage.section.settings) {
            formEvent(sectionElement, false);
        }
    }
    button2 = (sectionElement.querySelectorAll("button"))[1];
    if (button2.classList.contains("back-to-home")) {
        button2.removeEventListener("click", homeButtonHandler);
    }
}

function deleteQuizz(quizzId) {
    let myQuizzesKeys = getUserQuizzesKeys();
    let myQuizzes = getUserQuizzesIDs();
    let idIndex = myQuizzes.indexOf(quizzId);

    axiosBase.delete(`/${quizzId}`, {
        headers: {
            "Secret-Key": myQuizzesKeys[quizzId]
        }
    }).then(backToHomePage);
    myQuizzes.splice(idIndex, 1);
    delete(myQuizzesKeys[quizzId]);

    setUserQuizzesIDs(myQuizzes);
    setUserQuizzesKeys(myQuizzesKeys);
}

function editQuizzHandler(response) {
    const allSections = document.querySelector("#quizz-creation").children

    const quizzSettings = allSections[creationPage.section.settings].querySelectorAll("inputs")
    quizzSettings
}

function editQuizz(quizzId){
    startCreation();
    axiosBase.get(`/${quizzId}`).then(editQuizzHandler);
}

export { activeTriggerEvents, removeTriggerEvents, deleteQuizz, editQuizz };
