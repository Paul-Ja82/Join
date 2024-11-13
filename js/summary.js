function initSummary() {
    initMPA();
}

function toggleGreetingsDisplay() {
    if (window.innerWidth <= 1260) {
        const greetingsFrame = document.querySelector('.greetings-frame-responsive');
        const titleAndMainDisplay = document.querySelector('.title-and-main-display-resposive');
        
        if (greetingsFrame && titleAndMainDisplay) {
            greetingsFrame.style.display = 'block';
            titleAndMainDisplay.style.display = 'none';

            setTimeout(() => {
                greetingsFrame.style.display = 'none';
                titleAndMainDisplay.style.display = 'block';
            }, 2000);
        }
    }
}

function ifElseForSetGreeting(currentHour) {
    if (currentHour >= 5 && currentHour < 13) {
        return "Good morning,";
    } else if (currentHour >= 13 && currentHour < 18) {
        return "Good afternoon,";
    } else if (currentHour >= 18 && currentHour < 23) {
        return "Good evening,";
    } else {
        return "Good night,";
    }
}

function setGreeting() {
    const greetingElements = document.querySelectorAll('#greetingSummary');
    const currentHour = new Date().getHours();
    const greetingText = ifElseForSetGreeting(currentHour);
    for (let i = 0; i < greetingElements.length; i++) {
        greetingElements[i].textContent = greetingText;
    }
}


document.addEventListener("DOMContentLoaded", function () {
    setGreeting();
});


function setGreetedName() { 
    const storedName = localStorage.getItem('loggedInUserName');
    let greetednameText = "";

    if (storedName) {
        console.log('Retrieved Name:', storedName); 

        const greetedNameElements = document.querySelectorAll('#greetedName');
        for (let i = 0; i < greetedNameElements.length; i++) {
            greetedNameElements[i].textContent = storedName;
        }
    } else {
        console.error('No name found in Local Storage.');
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let amountElements = document.querySelectorAll('.amount');

    for (let i = 0; i < amountElements.length; i++) {
        let element = amountElements[i];
        let value = Number(element.textContent);
        if (!isNaN(value) && value > 99) {
            element.innerHTML = '99<span class="plus-sign">+</span>';
        }
    }
});

console.log(tasksTodo);
console.log(tasksInProgress);
console.log(tasksAwaitFeedback);
console.log(tasksDone);

function updateTkToDo() {
    const tasksTodo = [];
    const toDoAmount = document.getElementById('toDoAmount');

    if (toDoAmount) {
        toDoAmount.textContent = tasksTodo.length; 
    }
}

function updateTkInProgress() {
    const tasksInProgress = [];
    const tasksInProgressAmount = document.getElementById('taskProgressAmount');

    if (tasksInProgressAmount) {
        tasksInProgressAmount.textContent = tasksInProgress.length; 
    }
}

function updateTkAwaitFeedback() {
    const AwaitFeedback = [];
    const awaitingFeedbackAmount = document.getElementById('awaitingFeedbackAmount');

    if (awaitingFeedbackAmount) {
        awaitingFeedbackAmount.textContent = tasksAwaitFeedback.length; 
    }
}

function updateTkDoneAmount() {
    const tasksDone = [];
    const doneAmount = document.getElementById('doneAmount');

    if (doneAmount) {
        doneAmount.textContent = tasksDone.length; 
    }
}

function updateTkiInBoard() {
    const toDoAmount = parseInt(updateTkToDo(), 10) || 0;
    const inProgressAmount = parseInt(updateTkInProgress(), 10) || 0;
    const awaitingFeedbackAmount = parseInt(updateTkAwaitFeedback(), 10) || 0;
    const doneAmount = parseInt(updateTkDoneAmount(), 10) || 0;

    const totalTasks = toDoAmount + inProgressAmount + awaitingFeedbackAmount + doneAmount;

    const taskBoardAmountElement = document.getElementById("taskBoardAmount");
    if (taskBoardAmountElement) {
        taskBoardAmountElement.textContent = totalTasks.toString(); 
    }
}



function updateAllTasksInSummary() {
    updateTkToDo();
    updateTkInProgress();
    updateTkAwaitFeedback(); 
    updateTkDoneAmount();
    updateTkiInBoard();
}





