/**
 * Initializes the summary view by calling the Multi-Page Application (MPA) initializer.
 *
 * @function initSummary
 */
function initSummary() {
    initMPA();
}

/**
 * Toggles the display of greeting elements based on the window width.
 * If the window width is less than or equal to 1280 pixels, the greetings frame is shown for 2 seconds,
 * after which it is hidden, and the main display is shown.
 * The greetings frame is shown only once per session using sessionStorage to track if it has been displayed.
 *
 * @function toggleGreetingsDisplay
 */
function toggleGreetingsDisplay() {
    if (window.innerWidth <= 1280) {
        if (!sessionStorage.getItem('greetingShown')) {
            const greetingsFrame = document.querySelector('.greetings-frame-responsive');
            const titleAndMainDisplay = document.querySelector('.title-and-main-display-resposive');
            if (greetingsFrame && titleAndMainDisplay) {
                greetingsFrame.style.display = 'block';
                titleAndMainDisplay.style.display = 'none';
                setTimeout(() => {
                    greetingsFrame.style.display = 'none';
                    titleAndMainDisplay.style.display = 'block';
                    sessionStorage.setItem('greetingShown', 'true');
                }, 2000);
            }
        }
    }
}

/**
 * Returns a greeting message based on the provided hour of the day.
 *
 * @function ifElseForSetGreeting
 * @param {number} currentHour - The current hour of the day (0-23).
 * @returns {string} - The appropriate greeting message.
 */
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

/**
 * Sets the greeting text in all elements with the ID 'greetingSummary' based on the current hour.
 *
 * @function setGreeting
 */
function setGreeting() {
    const greetingElements = document.querySelectorAll('#greetingSummary');
    const currentHour = new Date().getHours();
    const greetingText = ifElseForSetGreeting(currentHour);
    for (let i = 0; i < greetingElements.length; i++) {
        greetingElements[i].textContent = greetingText;
    }
}

/**
 * Adds a comma to the provided greeting text if a name is stored in session storage.
 *
 * @function addComma
 * @param {string} greetingText - The greeting text to which a comma may be added.
 * @returns {string} - The modified greeting text with or without a comma.
 */
function addComma(greetingText) {
    const storedName = sessionStorage.getItem('loggedInUserName');
    if (storedName) {
        return `${greetingText},`;
    }
    return greetingText;
}

/**
 * Formats a given name by capitalizing the first letter of each word and converting the rest to lowercase.
 *
 * @function formatName
 * @param {string} name - The name to be formatted.
 * @returns {string} - The formatted name.
 */
function formatName(name) {
    let nameParts = name.split(' ');
    for (let i = 0; i < nameParts.length; i++) {
        nameParts[i] = nameParts[i].charAt(0).toUpperCase() + nameParts[i].slice(1).toLowerCase();
    }
    return nameParts.join(' ');
}

/**
 * Updates the greeting text and displays the formatted name if a stored name exists.
 * Adds a comma to the greeting text if a name is found; otherwise, appends an exclamation mark if
 * the window width is less than 1280 pixels.
 *
 * @function ifElseForGreetedName
 * @param {string|null} storedName - The stored name retrieved from session storage.
 * @param {string} greetingText - The current greeting text.
 * @returns {string} - The modified greeting text.
 */
function ifElseForGreetedName(storedName, greetingText) {
    if (storedName) {
        greetingText = addComma(greetingText);
        const formattedName = formatName(storedName);
        const greetedNameElements = document.querySelectorAll('#greetedName');
        for (let i = 0; i < greetedNameElements.length; i++) {
            greetedNameElements[i].textContent = formattedName;
        }
    } else {
        if (window.innerWidth < 1280) {
            greetingText += '!';
        }
    }
    return greetingText;
}

/**
 * Asynchronously sets the greeting name by retrieving the stored name and updating the greeting text.
 * Calls other functions to modify and display the greeting based on whether a name is found.
 *
 * @async
 * @function setGreetedName
 */
async function setGreetedName() {
    let storedName;
    if (localStorage.getItem('loggedInUserName')) {
        storedName = localStorage.getItem('loggedInUserName');
    } else storedName = sessionStorage.getItem('loggedInUserName');
    const currentHour = new Date().getHours();
    let greetingText = ifElseForSetGreeting(currentHour);
    greetingText = ifElseForGreetedName(storedName, greetingText);
    const greetingElements = document.querySelectorAll('#greetingSummary');
    for (let i = 0; i < greetingElements.length; i++) {
        greetingElements[i].textContent = greetingText;
    }
}

/**
 * Adds an event listener to handle DOM content loaded event.
 * It updates elements with the class 'amount' to display '99+' if the value is greater than 99.
 *
 * @function
 */
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

/**
 * Asynchronously retrieves task data and initializes task arrays.
 * This function also logs tasks into separate arrays for debugging purposes.
 *
 * @async
 * @function getTaskData
 */
async function getTaskData() {
    await getIdAndDataForAddTask(pathData = '');
    keyForAllTasks();
    tasksTodo = [];
    tasksInProgress = [];
    tasksAwaitFeedback = [];
    tasksDone = [];
    pushTasksToArray();
}

/**
 * Asynchronously retrieves all task data by calling `getTaskData()`.
 *
 * @async
 * @function getAllTaskData
 */
async function getAllTaskData() {
    await getTaskData();
}

/**
 * Updates the displayed count of tasks to do.
 *
 * @async
 * @function updateTkToDo
 */
async function updateTkToDo() {
    const toDoAmount = document.getElementById('toDoAmount');
    if (toDoAmount) {
        toDoAmount.textContent = tasksTodo.length;
    }
}

/**
 * Updates the displayed count of tasks in progress.
 *
 * @async
 * @function updateTkInProgress
 */
async function updateTkInProgress() {
    const tasksInProgressAmount = document.getElementById('taskProgressAmount');
    if (tasksInProgressAmount) {
        tasksInProgressAmount.textContent = tasksInProgress.length;
    }
}

/**
 * Updates the displayed count of tasks awaiting feedback.
 *
 * @async
 * @function updateTkAwaitFeedback
 */
async function updateTkAwaitFeedback() {
    const awaitingFeedbackAmount = document.getElementById('awaitingFeedbackAmount');
    if (awaitingFeedbackAmount) {
        awaitingFeedbackAmount.textContent = tasksAwaitFeedback.length;
    }
}

/**
 * Updates the displayed count of completed tasks.
 *
 * @async
 * @function updateTkDoneAmount
 */
async function updateTkDoneAmount() {
    const doneAmount = document.getElementById('doneAmount');
    if (doneAmount) {
        doneAmount.textContent = tasksDone.length;
    }
}

/**
 * Updates the total number of tasks in the board and displays it.
 *
 * @async
 * @function updateTKInBoard
 */
async function updateTKInBoard() {
    const totalTasks = tasksTodo.length + tasksInProgress.length + tasksAwaitFeedback.length + tasksDone.length;
    const taskBoardAmount = document.getElementById('taskBoardAmount');
    if (taskBoardAmount) {
        taskBoardAmount.textContent = totalTasks;
    }
}

/**
 * Determines if a task is urgent based on its due date.
 * A task is considered urgent if its due date is within the urgency threshold (3 days) or is already past.
 *
 * @function isUrgentTask
 * @param {string|Date} dueDate - The due date of the task.
 * @returns {boolean} - Returns true if the task is urgent, false otherwise.
 */
function isUrgentTask(dueDate) {
    let currentDate = new Date();
    let urgencyThreshold = 3; 
    let dueDateObject = new Date(dueDate);
    let timeDifference = dueDateObject - currentDate;
    let daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    return daysDifference <= urgencyThreshold || dueDateObject < currentDate;
}

/**
 * Checks an array of tasks and adds tasks considered urgent to another array.
 * Updates the displayed count of urgent tasks on the page.
 *
 * @function checkUrgencyInArray
 * @param {Array} tasks - Array of tasks to check.
 * @param {Array} urgentTasks - Array to store the urgent tasks.
 */
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
    return urgentTasks
}

/**
 * Asynchronously updates the list of urgent tasks by checking tasks in multiple arrays.
 * Calls `updateTkToDo()` and other functions to ensure tasks are up-to-date.
 *
 * @async
 * @function updateUrgentTasks
 * @returns {Promise<Array>} - A promise that resolves to an array of urgent tasks.
 */
async function updateUrgentTasks() {
    let urgentTasks = [];
    await updateTkToDo(); 
    await updateTkInProgress();
    await updateTkAwaitFeedback();  
    checkUrgencyInArray(tasksTodo, urgentTasks);
    checkUrgencyInArray(tasksInProgress, urgentTasks);
    checkUrgencyInArray(tasksAwaitFeedback, urgentTasks);
    return urgentTasks; 
}

/**
 * Finds the oldest task (earliest due date) in an array of urgent tasks.
 *
 * @function findOldestTask
 * @param {Array} urgentTasks - Array of urgent tasks.
 * @returns {Object|null} - Returns the task with the earliest due date or null if the array is empty.
 */
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

/**
 * Sets the text color of an element to red if the provided date is in the past.
 *
 * @function setRedIfPastDate
 * @param {HTMLElement} element - The HTML element to modify.
 * @param {string|Date} date - The date to compare with the current date.
 */
function setRedIfPastDate(element, date) {
    const today = new Date();
    const taskDate = new Date(date);
    if (taskDate < today) {
        element.style.color = 'rgb(255, 61, 0, 1)';
    } else {
        element.style.color = ''; 
    }
}

/**
 * Updates the text content and color of a deadline date element based on the provided date.
 *
 * @function updateDeadlineDateElement
 * @param {HTMLElement} deadlineDateElement - The element to update with the formatted date.
 * @param {string} formattedDate - The formatted date string to display.
 * @param {string|Date} dueDate - The due date to compare for color adjustment.
 */
function updateDeadlineDateElement(deadlineDateElement, formattedDate, dueDate) {
    if (deadlineDateElement) {
        deadlineDateElement.textContent = `${formattedDate}`;
        setRedIfPastDate(deadlineDateElement, dueDate);
    }
}

/**
 * Updates the text content of a deadline message element based on whether the date is in the past.
 *
 * @function updateDeadlineMessageElement
 * @param {HTMLElement} deadlineMsgElement - The element to update with the message.
 * @param {string|Date} dueDate - The due date to compare with the current date.
 */
function updateDeadlineMessageElement(deadlineMsgElement, dueDate) {
    if (deadlineMsgElement) {
        const today = new Date();
        if (dueDate < today) {
            deadlineMsgElement.textContent = "Deadline crossed";
        } else {
            deadlineMsgElement.textContent = "Upcoming Deadline";
        }
    }
}

/**
 * Displays the deadline information for the oldest task.
 * Updates the deadline date and message elements based on the presence of a task or lack thereof.
 *
 * @function displayDeadline
 * @param {Object|null} oldestTask - The oldest task object with a `due_date` property or null if no tasks are present.
 */
function displayDeadline(oldestTask) {
    let deadlineDateElement = document.getElementById('deadlineDate');
    let deadlineMsgElement = document.getElementById('deadlineMsg');
    if (!oldestTask) {
        if (deadlineDateElement) {
            deadlineDateElement.textContent = "No deadlines";
            deadlineDateElement.style.color = ''; 
        }
        if (deadlineMsgElement) {
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

/**
 * Updates the deadline for the oldest urgent task.
 * Retrieves the list of urgent tasks and finds the oldest one, then calls `displayDeadline`.
 *
 * @async
 * @function updateDeadline
 */
async function updateDeadline() {
    let urgentTasks = await updateUrgentTasks(); 
    let oldestTask = findOldestTask(urgentTasks);
    displayDeadline(oldestTask);
}

/**
 * Updates all task-related summaries on the page.
 * Retrieves all task data and updates task counts, urgent tasks, and deadlines.
 *
 * @async
 * @function updateAllTasksInSummary
 */
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