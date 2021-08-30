import { creationPage, changeVisibility, createTitleContainer } from '../auxiliar/auxiliar.mjs';

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

    questionContainer.append(questionTextInput, questionColorInput);

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

        li.append(answerTextInput, answerImgInput);
        ul.append(li);
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

    contentContainer.append(
        questionInputsContainer,
        correctAnswerTitle,
        correctAnswerContainer,
        wrongAnswerTitle,
        wrongAnswersContainer
    )

    return contentContainer;
}

function createQuestions(quizzToEdit) {
    const sectionElement = creationPage.questions;
    const endOfSectioButton = sectionElement.querySelector("button");
    const numberOfQuestions = creationPage.settings.querySelector("input[type='number']").value;
    let questionContainer;

    for (let i = 0; i < numberOfQuestions; i++) {
        questionContainer = document.createElement("div");
        questionContainer.classList.add("question");

        questionContainer.append(
            createTitleContainer(i + 1, "answer"),
            createQuestionContentContainer()
        );
        sectionElement.insertBefore(questionContainer, endOfSectioButton);

        if (i !== 0) {
            changeVisibility(questionContainer);
        }
    }
    fillQuestions(quizzToEdit)
}

function fillQuestions(quizzToEdit) {
    if (!quizzToEdit) {
        return;
    }

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

function deleteQuestions() {
    const questions = creationPage.questions.querySelectorAll(".question");

    if (questions.length !== 0) {
        for (let i = questions.length - 1; i >= 0; i--) {
            questions[i].remove();
        }
    }
}

export { createQuestions, deleteQuestions };
