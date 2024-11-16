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
        return "Good morning";
    } else if (currentHour >= 13 && currentHour < 18) {
        return "Good afternoon";
    } else if (currentHour >= 18 && currentHour < 23) {
        return "Good evening";
    } else {
        return "Good night";
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


function formatName(name) {
    let nameParts = name.split(' ');
    for (let i = 0; i < nameParts.length; i++) {
        nameParts[i] = nameParts[i].charAt(0).toUpperCase() + nameParts[i].slice(1).toLowerCase();
    }
    return nameParts.join(' ');
}

async function setGreetedName() { 
    const storedName = sessionStorage.getItem('loggedInUserName');
    let greetednameText = "";

    if (storedName) {
        console.log('Retrieved Name:', storedName); 

        const formattedName = formatName(storedName);
        const greetedNameElements = document.querySelectorAll('#greetedName');

        for (let i = 0; i < greetedNameElements.length; i++) {
            greetedNameElements[i].textContent = formattedName;
        }
    } else {
        console.error('No name found in Session Storage.');
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

async function getTaskData() {
    await getIdAndDataForAddTask(pathData='');
    keyForAllTasks();
    tasksTodo = [];
    tasksInProgress = [];
    tasksAwaitFeedback = [];
    tasksDone = [];
    pushTasksToArray()
    console.log(tasksTodo);
    console.log(tasksInProgress);
    console.log(tasksAwaitFeedback);
    console.log(tasksDone);
}

async function getAllTaskData() {
    await getTaskData(); 
}

async function updateTkToDo() {
    const toDoAmount = document.getElementById('toDoAmount');
    if (toDoAmount) {
        toDoAmount.textContent = tasksTodo.length; 
    }
}

async function updateTkInProgress() {
    const tasksInProgressAmount = document.getElementById('taskProgressAmount');
    if (tasksInProgressAmount) {
        tasksInProgressAmount.textContent = tasksInProgress.length; 
    }
}

async function updateTkAwaitFeedback() {
    const awaitingFeedbackAmount = document.getElementById('awaitingFeedbackAmount');
    if (awaitingFeedbackAmount) {
        awaitingFeedbackAmount.textContent = tasksAwaitFeedback.length; 
    }
}

async function updateTkDoneAmount() {
    const doneAmount = document.getElementById('doneAmount');
    if (doneAmount) {
        doneAmount.textContent = tasksDone.length; 
    }
}

async function updateTKInBoard() {
    const totalTasks = tasksTodo.length + tasksInProgress.length + tasksAwaitFeedback.length + tasksDone.length;
    const taskBoardAmount = document.getElementById('taskBoardAmount');
    if (taskBoardAmount) {
        taskBoardAmount.textContent = totalTasks;
    }
}

function isUrgentTask(dueDate) {
    let currentDate = new Date();
    let urgencyThreshold = 3; 
    let dueDateObject = new Date(dueDate);
    let timeDifference = dueDateObject - currentDate;
    let daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    return daysDifference <= urgencyThreshold || dueDateObject < currentDate;
}

function checkUrgencyInArray(tasks, urgentTasks) {
    for (let i = 0; i < tasks.length; i++) {
        if (isUrgentTask(tasks[i].due_date)) { 
            urgentTasks.push(tasks[i]);
        }
    }

    let urgentTasksAmount = document.getElementById('urgencyAmount');
    if (urgentTasksAmount) {
        urgentTasksAmount.textContent = urgentTasks.length;
    }
}

async function updateUrgentTasks() {
    let urgentTasks = [];

    await updateTkToDo(); 

    checkUrgencyInArray(tasksTodo, urgentTasks);

    console.log('Urgent Tasks:', urgentTasks);

    return urgentTasks; 
}

function findOldestTask(urgentTasks) {
    if (urgentTasks.length === 0) {
        return null;
    }

    return urgentTasks.reduce(function(oldest, currentTask) {
        let oldestDate = new Date(oldest.due_date);
        let currentDate = new Date(currentTask.due_date);
        return currentDate < oldestDate ? currentTask : oldest;
    });
}

function setRedIfPastDate(element, date) {
    const today = new Date();
    const taskDate = new Date(date);
    if (taskDate < today) {
        element.style.color = 'rgb(255, 61, 0, 1)';
    } else {
        element.style.color = ''; 
    }
}

function updateDeadlineDateElement(deadlineDateElement, formattedDate, dueDate) {
    if (deadlineDateElement) {
        deadlineDateElement.textContent = `${formattedDate}`;
        setRedIfPastDate(deadlineDateElement, dueDate);
    }
}

function updateDeadlineMessageElement(deadlineMsgElement, dueDate) {
    if (deadlineMsgElement) {
        const today = new Date();
        if (dueDate < today) {
            deadlineMsgElement.textContent = "Deadline crossed";
        } else {
            deadlineMsgElement.textContent = '';
        }
    }
}

function displayDeadline(oldestTask) {
    let deadlineDateElement = document.getElementById('deadlineDate');
    let deadlineMsgElement = document.getElementById('deadlineMsg');

    if (!oldestTask) {
        if (deadlineDateElement) {
            deadlineDateElement.textContent = "No deadlines";
            deadlineDateElement.style.color = ''; 
        }
        if (deadlineMsgElement) {                            // function zu lang 
            deadlineMsgElement.textContent = ''; 
        }
        return;
    }

    let dueDateObject = new Date(oldestTask.due_date);
    let options = { year: 'numeric', month: 'long', day: 'numeric' }; 
    let formattedDate = dueDateObject.toLocaleDateString('en-US', options);

    updateDeadlineDateElement(deadlineDateElement, formattedDate, oldestTask.due_date);
    updateDeadlineMessageElement(deadlineMsgElement, dueDateObject);
}






async function updateDeadline() {
    let urgentTasks = await updateUrgentTasks(); 
    let oldestTask = findOldestTask(urgentTasks);
    displayDeadline(oldestTask);
}

async function updateAllTasksInSummary() {
    await getAllTaskData(); 
    updateTkToDo();
    updateTkInProgress();
    updateTkAwaitFeedback(); 
    updateTkDoneAmount();
    updateTKInBoard();
    updateUrgentTasks();
    updateDeadline();
}





