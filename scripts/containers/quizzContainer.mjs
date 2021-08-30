function createQuizzHeader(quizz) {
    const headerContainer = document.createElement('div');
    const img = document.createElement('img');
    const header = document.createElement('h2');

    headerContainer.classList.add('quizz-header');

    img.src = quizz.image;
    header.innerHTML = quizz.title;

    headerContainer.append(img, header);

    return headerContainer;
}

function createAnswersContainer(answers) {
    const answersContainer = document.createElement('ul');
    answersContainer.classList.add('quizz-answers');

    answers.sort(() => Math.random() - 0.5);

    answers.forEach(answer => {
        const individualAnswerContainer = document.createElement('li');
        const img = document.createElement('img');
        const text = document.createElement('span');

        answer.isCorrectAnswer ?
            individualAnswerContainer.classList.add('correct')
            :
            individualAnswerContainer.classList.add('wrong');

        text.classList.add('answer-text');

        img.src = answer.image;
        text.innerHTML = answer.text;

        individualAnswerContainer.append(img, text);

        answersContainer.append(individualAnswerContainer);
    });
    return answersContainer;
}

function createQuestionContainer(question, index) {
    const questionContainer = document.createElement('li');
    questionContainer.classList.add('quizz-question-container');
    if (index > 0) questionContainer.classList.add('hidden');

    const headerContainer = document.createElement('div');
    headerContainer.classList.add("quizz-question-header");
    headerContainer.setAttribute('style', `background-color: ${question.color}`)

    const header = document.createElement('h2');
    header.innerHTML = question.title;

    headerContainer.append(header);
    
    questionContainer.append(
        headerContainer,
        createAnswersContainer(question.answers)
    );

    return questionContainer;
}

function AppendQuestionsContainers(quizz, containerToRender) {
    const listOfQuestions = document.createElement('ul');

    quizz.questions.forEach((question, index) => {
        listOfQuestions.append(createQuestionContainer(question, index));
    });
    
    containerToRender.append(listOfQuestions);
}

function createResultContainer(quizz, percentageScore, levelIndex) {
    const resultContainer = document.createElement('div');
    const headerContainer = document.createElement('div');
    const contentContainer = document.createElement('div');
    const levelSentence = document.createElement('h2');
    const levelImage = document.createElement('img');
    const levelDescription = document.createElement('p');

    resultContainer.classList.add('quizz-result');
    headerContainer.classList.add('quizz-result-header');
    contentContainer.classList.add('quizz-result-content');

    levelSentence.innerHTML = `${percentageScore}% de acerto: ${(quizz.levels)[levelIndex].title}`;
    levelImage.src = `${quizz.levels[levelIndex].image}`;
    levelDescription.innerHTML = `${quizz.levels[levelIndex].text}`;

    headerContainer.append(levelSentence);
    contentContainer.append(levelImage, levelDescription);
    resultContainer.append(headerContainer, contentContainer);

    return resultContainer;
}

export { createQuizzHeader, AppendQuestionsContainers, createResultContainer };