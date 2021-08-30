import { creationPage, changeVisibility, createTitleContainer } from '../auxiliar/auxiliar.mjs';

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

    contentContainer.append(levelTitleInput, levelPercentageInput, levelimgInput, levelDescriptionInput)

    return contentContainer;
}

function fillLevels(quizzToEdit) {
    if (!quizzToEdit) {
        return;
    }

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

function createLevels(quizzToEdit) {
    const sectionElement = creationPage.levels;
    const endOfSectioButton = sectionElement.querySelector("button");
    const numberOfLevels = (creationPage.settings.querySelectorAll("input[type='number']"))[1].value;
    let levelContainer;

    for (let i = 0; i < numberOfLevels; i++) {
        levelContainer = document.createElement("div");
        levelContainer.classList.add("level");

        levelContainer.append(
            createTitleContainer(i + 1, "level"),
            createLevelContentContainer(i + 1)
        );
        sectionElement.insertBefore(levelContainer, endOfSectioButton);

        if (i !== 0) {
            changeVisibility(levelContainer);
        }
    }
    fillLevels(quizzToEdit);
}

function deleteLevels() {
    const levels = creationPage.levels.querySelectorAll(".level");

    if (levels.length !== 0) {
        for (let i = levels.length - 1; i >= 0; i--) {
            levels[i].remove();
        }
    }
}

export { createLevels, deleteLevels };
