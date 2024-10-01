// Factory Method
class QuestionFactory {
    createQuestion(type, questionText) {
        let question;
        if (type === 'multipleChoice') {
            question = new MultipleChoiceQuestion(questionText);
        } else if (type === 'text') {
            question = new TextQuestion(questionText);
        }
        return question;
    }
}

class MultipleChoiceQuestion {
    constructor(questionText) {
        this.type = 'multipleChoice';
        this.questionText = questionText;
        this.options = [];
    }

    addOption(option) {
        this.options.push(option);
    }
}

class TextQuestion {
    constructor(questionText) {
        this.type = 'text';
        this.questionText = questionText;
    }
}

// Observer
class Survey {
    constructor() {
        this.questions = [];
        this.observers = [];
    }

    addQuestion(question) {
        this.questions.push(question);
        this.notifyObservers();
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    notifyObservers() {
        for (let observer of this.observers) {
            observer.update(this);
        }
    }
}

class SurveyResults {
    update(survey) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';
        survey.questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.innerHTML = `<strong>Pregunta ${index + 1}:</strong> ${question.questionText}`;
            if (question.type === 'multipleChoice') {
                const optionsList = document.createElement('ul');
                question.options.forEach(option => {
                    const optionItem = document.createElement('li');
                    optionItem.textContent = option;
                    optionsList.appendChild(optionItem);
                });
                questionDiv.appendChild(optionsList);
            }
            resultsDiv.appendChild(questionDiv);
        });
    }
}

// Uso
const survey = new Survey();
const results = new SurveyResults();
survey.addObserver(results);

const factory = new QuestionFactory();

document.getElementById('question-type').addEventListener('change', function() {
    const multipleChoiceOptions = document.getElementById('multiple-choice-options');
    if (this.value === 'multipleChoice') {
        multipleChoiceOptions.style.display = 'block';
    } else {
        multipleChoiceOptions.style.display = 'none';
    }
});

document.getElementById('add-option').addEventListener('click', function() {
    const newOption = document.createElement('input');
    newOption.type = 'text';
    newOption.name = 'option';
    newOption.placeholder = `Opción ${document.querySelectorAll('input[name="option"]').length + 1}`;
    document.getElementById('multiple-choice-options').appendChild(newOption);
});

document.getElementById('survey-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const questionType = document.getElementById('question-type').value;
    const questionText = document.getElementById('question-text').value;
    const question = factory.createQuestion(questionType, questionText);

    if (questionType === 'multipleChoice') {
        const options = document.querySelectorAll('input[name="option"]');
        options.forEach(option => {
            if (option.value) {
                question.addOption(option.value);
            }
        });
    }

    survey.addQuestion(question);
    document.getElementById('survey-form').reset();
    document.getElementById('multiple-choice-options').style.display = 'none';
});
