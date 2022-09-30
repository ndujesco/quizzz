//References
let timeLeft = document.querySelector(".time-left");
let quizContainer = document.getElementById("container");
let nextBtn = document.getElementById("next-button");
let countOfQuestion = document.querySelector(".number-of-question");
let displayContainer = document.getElementById("display-container");
let scoreContainer = document.querySelector(".score-container");
let restart = document.getElementById("restart");
let userScore = document.getElementById("user-score");
let startScreen = document.querySelector(".start-screen");
let startButton = document.getElementById("start-button");
let questionCount;
let scoreCount = 0;
let count = 16;
let countdown;

document.getElementById("start-button").innerHTML =
  "Please wait while we fetch data";

document.getElementById("start-button").disabled = true;
let quizArray = [
  {
    id: "0",
    options: [],
  },
  {
    id: "1",
    options: [],
  },
  {
    id: "2",
    options: [],
  },
  {
    id: "3",
    options: [],
  },
  {
    id: "4",
    options: [],
  },
  {
    id: "5",
    options: [],
  },
  {
    id: "6",
    options: [],
  },
  {
    id: "7",
    options: [],
  },
  {
    id: "8",
    options: [],
  },
  {
    id: "9",
    options: [],
  },
];

let arr = [1, 2, 3, 4, 5];
arr.sort(() => Math.random() - 0.5);
console.log(arr);

function getQuestions(callback) {
  let countriesAndCapitals;
  let allCapitals = [];
  fetch("https://restcountries.com/v3.1/all")
    .then((response) => response.json())
    .then((data) => {
      countriesAndCapitals = data.map((value) => {
        if (value.capital) {
          if (value.capital.length > 0) {
            allCapitals.push(...value.capital);
            return { name: value.name.common, capital: value.capital };
          }
        } else {
          return null;
        }
      });
      callback(allCapitals, countriesAndCapitals);
    });
}

getQuestions((allCap, countAndCap) => {
  countAndCap.sort(() => Math.random() - 0.5);
  countAndCap = countAndCap.filter((value) => value !== null);
  for (let i = 0; i < 10; i++) {
    quizArray[i].question = countAndCap[i].name;
    quizArray[i].options.push(countAndCap[i].capital[0]);
    quizArray[i].correct = countAndCap[i].capital[0];
  }
  for (let i = 0; i < 10; i++) {
    allCap.sort(() => Math.random() - 0.5);

    for (let j = 0; j < 20; j++) {
      if (!quizArray[i].options.includes(allCap[j])) {
        quizArray[i].options.push(allCap[j]);
      }
    }
  }
  for (let i = 0; i < 10; i++) {
    quizArray[i].options = quizArray[i].options.slice(0, 4);
  }
  console.log(quizArray);

  document.getElementById("start-button").innerHTML = "Start";
  document.getElementById("start-button").disabled = false;
});

//Questions and Options array

/*
const quizArray = [
  {
    id: "0",
    question: "Which is the most widely spoken language in the world?",
    options: ["Spanish", "Mandarin", "English", "German"],
    correct: "Mandarin",
  }
];

*/

//Restart Quiz
restart.addEventListener("click", () => {
  initial();
  displayContainer.classList.remove("hide");
  scoreContainer.classList.add("hide");
});

//Next Button
nextBtn.addEventListener(
  "click",
  (displayNext = () => {
    //increment questionCount
    questionCount += 1;
    //if last question
    if (questionCount == quizArray.length) {
      //hide question container and display score
      displayContainer.classList.add("hide");
      scoreContainer.classList.remove("hide");
      //user score
      userScore.innerHTML =
        "Your score is " + scoreCount + " out of " + questionCount;
    } else {
      //display questionCount
      countOfQuestion.innerHTML =
        questionCount + 1 + " of " + quizArray.length + " Question";
      //display quiz
      quizDisplay(questionCount);
      count = 16;
      clearInterval(countdown);
      timerDisplay();
    }
  })
);

//Timer
const timerDisplay = () => {
  countdown = setInterval(() => {
    count--;
    timeLeft.innerHTML = `${count}s`;
    if (count == 0) {
      clearInterval(countdown);
      displayNext();
    }
  }, 1000);
};

//Display quiz
const quizDisplay = (questionCount) => {
  let quizCards = document.querySelectorAll(".container-mid");
  //Hide other cards
  quizCards.forEach((card) => {
    card.classList.add("hide");
  });
  //display current question card
  quizCards[questionCount].classList.remove("hide");
};

//Quiz Creation
function quizCreator() {
  //randomly sort questions
  quizArray.sort(() => Math.random() - 0.5);
  //generate quiz
  for (let i of quizArray) {
    //randomly sort options
    i.options.sort(() => Math.random() - 0.5);
    //quiz card creation
    let div = document.createElement("div");
    div.classList.add("container-mid", "hide");
    //question number
    countOfQuestion.innerHTML = 1 + " of " + quizArray.length + " Question";
    //question
    let question_DIV = document.createElement("p");
    question_DIV.classList.add("question");
    question_DIV.innerHTML = i.question;
    div.appendChild(question_DIV);
    //options
    div.innerHTML += `
    <button class="option-div" onclick="checker(this)">${i.options[0]}</button>
     <button class="option-div" onclick="checker(this)">${i.options[1]}</button>
      <button class="option-div" onclick="checker(this)">${i.options[2]}</button>
       <button class="option-div" onclick="checker(this)">${i.options[3]}</button>
    `;
    quizContainer.appendChild(div);
  }
}

//Checker Function to check if option is correct or not
function checker(userOption) {
  let userSolution = userOption.innerText;
  let question =
    document.getElementsByClassName("container-mid")[questionCount];
  let options = question.querySelectorAll(".option-div");

  //if user clicked answer == correct option stored in object
  if (userSolution === quizArray[questionCount].correct) {
    userOption.classList.add("correct");
    scoreCount++;
  } else {
    userOption.classList.add("incorrect");
    //For marking the correct option
    options.forEach((element) => {
      if (element.innerText == quizArray[questionCount].correct) {
        element.classList.add("correct");
      }
    });
  }

  //clear interval(stop timer)
  clearInterval(countdown);
  //disable all options
  options.forEach((element) => {
    element.disabled = true;
  });
}

//initial setup
function initial() {
  quizContainer.innerHTML = "";
  questionCount = 0;
  scoreCount = 0;
  count = 16;
  clearInterval(countdown);
  timerDisplay();
  quizCreator();
  quizDisplay(questionCount);
}

//when user click on start button
startButton.addEventListener("click", () => {
  startScreen.classList.add("hide");
  displayContainer.classList.remove("hide");
  initial();
});

//hide quiz and display start screen
window.onload = () => {
  startScreen.classList.remove("hide");
  displayContainer.classList.add("hide");
};
