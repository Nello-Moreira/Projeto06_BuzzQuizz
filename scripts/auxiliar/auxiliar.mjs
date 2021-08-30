const pages = {
    home: document.querySelector('#home'),
    quizz: document.querySelector('#quizz'),
    creation: document.querySelector('#quizz-creation'),
    loader: document.querySelector('#loader'),
}

const homePage = {
    createQuizzBox: document.querySelector('.create-quizz'),
    userQuizzesBox: document.querySelector('.user-quizzes'),
    serverQuizzesBox: document.querySelector('.server-quizzes')
}

const creationPage = {
    settings: document.getElementById("quizz-creation").children[0],
    questions: document.getElementById("quizz-creation").children[1],
    levels: document.getElementById("quizz-creation").children[2],
    endSection: document.getElementById("quizz-creation").children[3]
};

function activatePage(page) {
    Object.values(pages).forEach(element => {
        if (element === page) {
            element.classList.remove('hidden');
            return;
        }
        element.classList.add('hidden');
    });
    window.scrollTo(0, 0);
}

function changeVisibility(container) {
    const titleContainer = container.querySelector(".title-container")
    const editionIcon = titleContainer.querySelector("img");
    const form = container.querySelector("form");

    editionIcon.classList.toggle("hidden");
    form.classList.toggle("hidden");
    container.classList.remove("invalid");
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

export { pages, homePage, creationPage, activatePage, changeVisibility, createTitleContainer };
