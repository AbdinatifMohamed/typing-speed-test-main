const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const currentWPM = document.getElementById("currentWPM");
const currentAccuracy = document.getElementById("currentAccuracy");
const currentTime = document.getElementById("currentTime");
const selectedDiffculty = document.getElementById("selectedDiffculty");
const selectedTime= document.getElementById("selectedTime");


let startGame = false;
let time = 0;
let listWords = null;


const setupGame = async () => {
    currentWPM.textContent = "0";
    currentAccuracy.textContent = "100%";
    time = selectedTime.value;
    try {
        const response = await fetch('./data.json');

        if (response.ok) {
            listWords = await response.json();
            console.log("List of words:", listWords);
        }
    } catch (error) {
        
    }
}


setupGame();

