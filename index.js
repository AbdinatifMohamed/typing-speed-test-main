const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const currentWPM = document.getElementById("currentWPM");
const currentAccuracy = document.getElementById("currentAccuracy");
const currentTime = document.getElementById("currentTime");
const selectedDiffculty = document.getElementById("selectedDiffculty");
const selectedTime= document.getElementById("selectedTime");
const textBox = document.getElementById("textBox");
const startscreen = document.getElementById("startscreen");


let gameStarted = false;
let time = 0;
let listWords = null;
let typed = 0;
let correctTyped = 0;
let timeId;
let currentString = null;
let pointer  = 0;
let startTime = Date.now();


const createBackgroundTimer = () => {
    timeId = setInterval(() => {
        time--;
        currentTime.innerText = time
        if (time === 0) {
            endGame();
        }
        currentWPM.innerText = updateWPM();

    }, 1000)
}






const setupGame = async () => {
    currentWPM.textContent = "0";
    currentAccuracy.textContent = "100%";
    time = selectedTime.value;
    pointer = 0;
    try {
        const response = await fetch('./data.json');

        if (response.ok) {
            listWords = await response.json();
            console.log("List of words:", listWords);
        }
    } catch (error) {
        
    }

    const list = listWords[selectedDiffculty.value];
    currentString = list[Math.floor(Math.random() * list.length)].text;
    textBox.innerHTML = currentString.split('').map(letter => `<span>${letter}</span>`).join('');
    startscreen.style.display = "none";
    startGame();
}

const startGame = () => {
    gameStarted = true;
    document.addEventListener("keydown", onType);
    createBackgroundTimer();
    restartButton.style.display = "None";
}


const endGame = () => {
    clearInterval(timeId);
    document.removeEventListener("keydown", onType);
    startTime = Date.now();
    restartButton.style.display = "block";
}


const onType = (e) => {
    const spans = textBox.querySelectorAll('span');

    if (pointer < spans.length){
        if (e.key === spans[pointer].innerText){
            spans[pointer].style.color = "green";
            correctTyped++;
        } else {
            spans[pointer].style.color = "red";
        }
    } else {
        endGame();
    }
    currentAccuracy.innerText =( (correctTyped/typed) * 100).toFixed(2) + "%"
    typed++;
    pointer++;
}

function updateWPM() {
  const currentTime = Date.now();

  const timeInSeconds = (currentTime - startTime) / 1000;

  const timeInMinutes = timeInSeconds / 60;

  const wpm = typed / timeInMinutes;

  return wpm.toFixed(2);
}


startButton.addEventListener("click", () => {
    console.log("reached here.")
    setupGame();
})
