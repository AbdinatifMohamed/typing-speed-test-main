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
const resultTitle = document.getElementById("resultTitle");
const resultDesc = document.getElementById("resultDesc")
const resultWPM = document.getElementById("resultWPM");
const resultAccuracy = document.getElementById("resultAccuracy");
const resultCharacters = document.getElementById("resultCharacters");
const resultDiv = document.getElementById("resultDiv");
const personalBest = document.getElementById("personalBest");
const resultLogo = document.getElementById("resultLogo");
const main = document.getElementById("main");
const resultRepeat = document.getElementById("resultRepeat");
const star = document.getElementById("star");
const star2 = document.getElementById("star2");1

let gameStarted = false;
let time = 0;
let listWords = null;
let typed = 0;
let correctTyped = 0;
let timeId;
let currentString = null;
let pointer  = 0;
let startTime = Date.now();
let result = 0;
let WPM = 0;
let firstGame = true;


const createBackgroundTimer = () => {
    timeId = setInterval(() => {
        time--;
        currentTime.innerText = time
        if (time === 0) {
            endGame();
        }
        WPM = updateWPM();
        currentWPM.innerText = WPM;
    }, 1000)
}






const setupGame = async () => {
    currentWPM.textContent = "0";
    currentAccuracy.textContent = "100%";
    time = selectedTime.value;
    pointer = 0;
    typed = 0;
    correctTyped = 0;
    WPM = 0;
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
    startTime = Date.now();
    document.addEventListener("keydown", onType);
    createBackgroundTimer();
}


const onRestart = () => {
    setupGame();
}

const endGame = () => {
    clearInterval(timeId);
    document.removeEventListener("keydown", onType);
    main.classList.add("hidden");

    if (firstGame) {
        resultTitle.innerText = "Baseline Established!";
        resultDesc.innerText = "You've set the bar. Now the real challenge begins~~time to beat it."
        personalBest.innerHTML = `<span class="text-[#959597]">Best: </span>${WPM}WPM`;
        resultLogo.classList.add("box-shadow");
        resultLogo.src = "/assets/images/icon-completed.svg";
        star.classList.remove("hidden");
        star2.classList.remove("hidden");
        result = WPM;
    } else if (WPM < result) {
        resultTitle.innerText = "Test Complete!";
        resultDesc.innerText = "Solid run. Keep pushing to beat your score."
        resultLogo.classList.add("box-shadow");
        resultLogo.src = "/assets/images/icon-completed.svg";
        star.classList.remove("hidden");
        star2.classList.remove("hidden");
    } else if (WPM > result) {
        resultTitle.innerText = "High Score Smashed!";
        resultDesc.innerText = "You're getting faster. That was incredible typing."
        personalBest.innerHTML = `<span class="text-[#959597]">Best: </span>${WPM}WPM`;
        resultLogo.classList.remove("box-shadow");
        resultLogo.src = "./assets/images/icon-new-pb.svg";
        star.classList.add("hidden");
        star2.classList.add("hidden");
        result = WPM;
    }


    resultWPM.innerText = WPM;
    resultAccuracy.innerText = ((correctTyped/typed) * 100).toFixed(0) + "%"
    resultCharacters.innerHTML = `<span class="text-[#4CD67A]">${correctTyped}<span/><span class="text-[#727279]">/<span/><span class="text-[#D64C5A]">${typed - correctTyped}<span/>`

    resultDiv.classList.remove("hidden");
    resultRepeat.addEventListener("click", () => {
        main.classList.remove("hidden");
        resultDiv.classList.add("hidden");
        restartButton.classList.remove("hidden");
        restartButton.addEventListener("click", onRestart);
    }, { once: true })



    if (firstGame){
        firstGame = false;
    }

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
        return;
    }
    currentAccuracy.innerText =( (correctTyped/typed) * 100).toFixed(0) + "%"
    typed++;
    spans[pointer].style.backgroundColor = "transparent";
    pointer++;

    console.log("Pointer:", pointer, "spans length: ", spans.length);
    spans[pointer].style.backgroundColor = "rgb(149 149 151 / 40%)";
}

function updateWPM() {
  const currentTime = Date.now();

  const timeInSeconds = (currentTime - startTime) / 1000;

  const timeInMinutes = timeInSeconds / 60;

  const wpm = typed / timeInMinutes;

  return wpm.toFixed(0);
}


startButton.addEventListener("click", () => {
    console.log("reached here.")
    setupGame();
})
