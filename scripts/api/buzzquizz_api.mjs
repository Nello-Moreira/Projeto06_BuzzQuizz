const axiosBase = axios.create({
    baseURL: 'https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes',
});

function getUserQuizzes() {
    const myQuizzes = localStorage.getItem("myQuizzes");

    if (!myQuizzes) {
        return [];
    }
    return JSON.parse(myQuizzes);
}

function setUserQuizzes(quizzesArray) {
    quizzesArray = JSON.stringify(quizzesArray);
    localStorage.setItem("myQuizzes", quizzesArray);
}

function getQuizz(quizzID) {
    return new Promise((resolve, reject) => {
        if (quizzID) {
            axiosBase.get('/' + quizzID).then(resolve).catch(reject);
            return;
        }
        axiosBase.get().then(resolve).catch(reject);
    })
}

function sendQuizzToServer(quizz) {
    return new Promise((resolve, reject) => {
        axiosBase.post("", quizz)
            .then(response => {
                let myQuizzes = getUserQuizzes();
                myQuizzes.push(
                    {
                        id: response.data.id,
                        key: response.data.key
                    }
                );
                setUserQuizzes(myQuizzes);
                resolve(response);
            })
            .catch(reject);
    });
}

function changeQuizzOnServer(quizzID, quizzObject) {
    return new Promise((resolve, reject) =>
        axiosBase.put(`/${quizzID}`, quizzObject, {
            headers: {
                "Secret-Key": getUserQuizzes().find(element => Number(element.id) === quizzID).key
            }
        })
            .then(resolve)
            .catch(reject)
    );
}

function deleteQuizz(quizzId) {
    return new Promise((resolve, reject) => {
        axiosBase.delete(`/${quizzId}`, {
            headers: {
                "Secret-Key": getUserQuizzes().find(element => Number(element.id) === quizzId).key
            }
        })
            .then(response => {
                let myQuizzes = getUserQuizzes()
                myQuizzes.splice(myQuizzes.indexOf(myQuizzes.find(element => element.id === quizzId)), 1);
                setUserQuizzes(myQuizzes);
                resolve(response);
            });
    })
}

export { getQuizz, sendQuizzToServer, changeQuizzOnServer, deleteQuizz, getUserQuizzes }