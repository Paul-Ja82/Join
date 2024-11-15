let filteredTasks = [];
let filteredKeys = [];
let filteredTasksTodo = [];
let filteredTasksInProgress = [];
let filteredTasksAwaitFeedback = [];
let filteredTasksDone = [];

function getFilter() {
    let filterInput = document.getElementById('name_of_task_input').value;
    // console.log(filterInput);
    
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

function clearFilteredArrays() {
    filteredTasksTodo = [];
    filteredTasksInProgress = [];
    filteredTasksAwaitFeedback = [];
    filteredTasksDone = [];
}

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