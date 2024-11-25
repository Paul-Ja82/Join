let filteredTasks = [];
let filteredKeys = [];
let filteredTasksTodo = [];
let filteredTasksInProgress = [];
let filteredTasksAwaitFeedback = [];
let filteredTasksDone = [];

/**
 * Retrieves the value from the task name input field and applies a filter to the tasks based on that value.
 * The filtered tasks are then pushed to appropriate arrays and displayed in different sections.
 * 
 * This function performs the following tasks:
 * 1. Gets the filter input value from the task name input field.
 * 2. Filters the tasks based on the input value.
 * 3. Checks the length of the filtered tasks and updates the display accordingly.
 * 4. Distributes the filtered tasks into different sections (To Do, In Progress, Await Feedback, Done).
 * 
 */
function getFilter() {
    let filterInput = document.getElementById('name_of_task_input').value;
    filterTasks(allTasks, allKeys, filterInput)
    checkFilteredTaskLength(filteredTasks)
    pushFilteredTasksToArray()
    fillTaskSections("to_do_tasks", filteredTasksTodo)
    fillTaskSections("in_progress_tasks", filteredTasksInProgress)
    fillTaskSections("await_feedback_tasks", filteredTasksAwaitFeedback)
    fillTaskSections("done_tasks", filteredTasksDone)
}

/**
 * Filters tasks based on the provided filter string, checking both the title and description of each task.
 * The tasks and their corresponding keys are stored in filtered arrays if they match the filter criteria.
 * 
 * This function performs the following tasks:
 * 1. Iterates through all tasks using the provided keys.
 * 2. For each task, it checks if the title or description contains the filter string (case-insensitive).
 * 3. Adds matching tasks and their keys to the filtered arrays.
 * 4. Calls `clearFilteredArrays()` to clear the global arrays after filtering.
 * 
 * @param {Array} allTasks - The array of all tasks.
 * @param {Array} allKeys - The array of keys corresponding to the tasks.
 * @param {string} filter - The string used to filter tasks based on their title or description.
 */
function filterTasks(allTasks, allKeys, filter) {
    filteredTasks = [];
    filteredKeys = [];
    for (let i = 0; i < allKeys.length; i++) {
        let task = allTasks[allKeys[i]];
        if (task && (task.title || task.description)) {
            let title = task.title ? task.title.toLowerCase() : "";
            let description = task.description ? task.description.toLowerCase() : "";
            if (title.includes(filter.toLowerCase()) || description.includes(filter.toLowerCase())) {
                filteredTasks.push(task);
                filteredKeys.push(allKeys[i]);
            }
        }
    }
    clearFilteredArrays()
}

/**
 * Clears the filtered task arrays by resetting them to empty arrays.
 * This is typically called after filtering tasks to reset the arrays holding the filtered tasks
 * for different task statuses (Todo, In Progress, Await Feedback, Done).
 * 
 */
function clearFilteredArrays() {
    filteredTasksTodo = [];
    filteredTasksInProgress = [];
    filteredTasksAwaitFeedback = [];
    filteredTasksDone = [];
}

/**
 * Checks the length of the filtered tasks array and updates the task input field based on whether tasks are found or not.
 * If no tasks are found, the input field is cleared, and a "No results found" message is displayed with a red border.
 * After a timeout, the filter is re-applied. If tasks are found, the placeholder text is reset.
 * 
 * @param {Array} filteredTasks - The array of filtered tasks based on user input.
 */
function checkFilteredTaskLength(filteredTasks) {
    if (filteredTasks.length == 0) {
        document.getElementById("name_of_task_input").value = "";
        document.getElementById("name_of_task_input").placeholder = "Kein Ergebnis gefunden";
        targetElement.style.boxShadow = '0 0 3px #8d1414 inset';
        document.getElementById("name_of_task_input").style.setProperty("--placeholder-color", "#8d1414");
        setTimeout(() => {
            targetElement.style.boxShadow = 'none';
            getFilter()
        }, 2000)
    } else {
        document.getElementById("name_of_task_input").placeholder = "Find Task";
        document.getElementById("name_of_task_input").style.setProperty("--placeholder-color", "lightgray");
    }
}