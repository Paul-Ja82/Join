let filteredTasks = [];
let filteredKeys = [];
let filteredTasksTodo = [];
let filteredTasksInProgress = [];
let filteredTasksAwaitFeedback = [];
let filteredTasksDone = [];

/**
 * Filters tasks based on input value and displays them in respective sections.
 */
function getFilter() {
    let filterInput = document.getElementById('name_of_task_input').value;
    filterTasks(allTasks, allKeys, filterInput);
    checkFilteredTaskLength(filteredTasks);
    pushFilteredTasksToArray();
    fillTaskSections("to_do_tasks", filteredTasksTodo);
    fillTaskSections("in_progress_tasks", filteredTasksInProgress);
    fillTaskSections("await_feedback_tasks", filteredTasksAwaitFeedback);
    fillTaskSections("done_tasks", filteredTasksDone);
}

/**
 * Filters tasks by title or description matching the filter string.
 * @param {Array} allTasks - Array of all tasks.
 * @param {Array} allKeys - Keys corresponding to tasks.
 * @param {string} filter - Filter string to match.
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
    clearFilteredArrays();
}

/**
 * Resets the filtered task arrays for different statuses.
 */
function clearFilteredArrays() {
    filteredTasksTodo = [];
    filteredTasksInProgress = [];
    filteredTasksAwaitFeedback = [];
    filteredTasksDone = [];
}

/**
 * Checks filtered task length and updates the input field if no results are found.
 * @param {Array} filteredTasks - Array of filtered tasks.
 */
function checkFilteredTaskLength(filteredTasks) {
    if (filteredTasks.length == 0) {
        document.getElementById("name_of_task_input").value = "";
        document.getElementById("name_of_task_input").placeholder = "Kein Ergebnis gefunden";
        targetElement.style.boxShadow = '0 0 3px #8d1414 inset';
        document.getElementById("name_of_task_input").style.setProperty("--placeholder-color", "#8d1414");
        setTimeout(() => {
            targetElement.style.boxShadow = 'none';
            getFilter();
        }, 2000);
    } else {
        document.getElementById("name_of_task_input").placeholder = "Find Task";
        document.getElementById("name_of_task_input").style.setProperty("--placeholder-color", "lightgray");
    }
}
