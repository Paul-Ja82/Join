let filteredTasks = [];
let filteredKeys = [];
let filteredTasksTodo = [];
let filteredTasksInProgress = [];
let filteredTasksAwaitFeedback = [];
let filteredTasksDone = [];

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

function filterTasks(allTasks, allKeys, filter) {
    filteredTasks = [];
    filteredKeys = [];
    for (let i = 0; i < allKeys.length; i++) {
        if(allTasks[`${allKeys[i]}`].title.toLowerCase().includes(`${filter.toLowerCase()}`) || 
            allTasks[`${allKeys[i]}`].description.toLowerCase().includes(`${filter.toLowerCase()}`)) {
                filteredTasks.push(allTasks[`${allKeys[i]}`])
                filteredKeys.push(allKeys[i])
            }
        }
    filteredTasksTodo = [];
    filteredTasksInProgress = [];
    filteredTasksAwaitFeedback = [];
    filteredTasksDone = [];
   
}

function checkFilteredTaskLength(filteredTasks) {
    if (filteredTasks.length == 0) {
        document.getElementById("name_of_task_input").value = "";
        document.getElementById("name_of_task_input").placeholder = "Kein Ergebnis gefunden";
        document.getElementById("name_of_task_input").style.setProperty("--placeholder-color", "#8d1414");
    } else {
        document.getElementById("name_of_task_input").placeholder = "Find Task";
        document.getElementById("name_of_task_input").style.setProperty("--placeholder-color", "lightgray");
    }
}