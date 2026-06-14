const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const currentWPM = document.getElementById("currentWPM");
const currentAccuracy = document.getElementById("currentAccuracy");
const currentTime = document.getElementById("currentTime");
const selectedDiffculty = document.getElementById("selectedDiffculty");
const selectedTime= document.getElementById("selectedTime");
const textBox = document.getElementById("textBox");
const startscreen = document.getElementById("startscreen");
const containerDiv = document.getElementById('textBoxWrapper');
const divHeight = containerDiv.clientHeight; 
const totalTextHeight = textBox.scrollHeight;


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
    typed = 0;
    correctTyped = 0;
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
    textBox.querySelectorAll('span')[0].style.backgroundColor = "rgb(149 149 151 / 40%)";
    textBox.querySelector('span:last-of-type').style.backgroundColor = "transparent";
    startscreen.style.display = "none";
    restartButton.classList.add("hidden");
    restartButton.removeEventListener("click", onRestart)
     textBox.style.transform = `translateY(0)`;
    startGame();
}

const startGame = () => {
    gameStarted = true;
    document.addEventListener("keydown", onType);
    createBackgroundTimer();
}


const onRestart = () => {
    setupGame();
}

const endGame = () => {
    clearInterval(timeId);
    document.removeEventListener("keydown", onType);
    startTime = Date.now();
    restartButton.classList.remove("hidden");
    restartButton.addEventListener("click", onRestart);
}


const onType = (e) => {
    const spans = textBox.querySelectorAll('span');

    if (e.key.length !== 1) {
        return;
    }
    
    
    if (pointer < spans.length){
        const spanOffset = spans[pointer].offsetTop;
        console.log("offsetTop", spanOffset);
        console.log("divHeight", divHeight);
        if (spanOffset > divHeight * 0.85) {
            const overflow = spanOffset - (divHeight * 0.5);
            textBox.style.transform =  `translateY(-${overflow}px)`
        }

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
    spans[pointer].style.backgroundColor = "transparent";
    pointer++;
    spans[pointer].style.backgroundColor = "rgb(149 149 151 / 40%)";
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
