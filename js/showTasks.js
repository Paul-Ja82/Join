function checkTaskSections() {
    tasksTodo = [];
    tasksInProgress = [];
    tasksAwaitFeedback = [];
    tasksDone = [];
    pushTasksToArray()
    fillTaskSections("to_do_tasks", tasksTodo)
    fillTaskSections("in_progress_tasks", tasksInProgress)
    fillTaskSections("await_feedback_tasks", tasksAwaitFeedback)
    fillTaskSections("done_tasks", tasksDone)
}

function pushTasksToArray() {
    for (let i = 0; i < allKeys.length; i++) {
        if (allTasks[`${allKeys[i]}`].currentStatus === "todo") {
            tasksTodo.push(allTasks[`${allKeys[i]}`])
        } 
        if (allTasks[`${allKeys[i]}`].currentStatus === "inProgress") {
            tasksInProgress.push(allTasks[`${allKeys[i]}`])
        }
        if (allTasks[`${allKeys[i]}`].currentStatus === "awaitFeedback") {
            tasksAwaitFeedback.push(allTasks[`${allKeys[i]}`])
        }
        if (allTasks[`${allKeys[i]}`].currentStatus === "done") {
            tasksDone.push(allTasks[`${allKeys[i]}`])
        }
    }
}

function fillTaskSections(section, tasks) {
    document.getElementById(section).innerHTML = "";
    for (let i = 0; i < tasks.length; i++) {
        let assignedTocontacts = checkAssignedTo(tasks, i);
        let priorityImg = checkPriorityImg(tasks, i);
        let checkedSubtasks = checkCheckedSubtasks(tasks, i);
        let subtasksLength = checkSubtaskLength(tasks, i)
        let width = calcProcessBarWidth(checkedSubtasks, subtasksLength);
       console.log(subtasksLength);
       
        createTaskHTML(section, tasks, i, assignedTocontacts, priorityImg, width, checkedSubtasks, subtasksLength)
      
    }
    checkTaskCategoryColor()
    showSubtaskCtn()
}
//geht noch nicht
function showSubtaskCtn() {
    let subtascsCtn = document.getElementsByClassName("single_task_progress_ctn");
    console.log(subtascsCtn)
    Array.from(subtascsCtn).forEach(ctn => {
        if(ctn.textContent == "0/0 Subtasks") {
            console.log(ctn);
            ctn.classList.add("progress_d_none") 
        }
    });
}

function checkSubtaskLength(tasks, i) {
    if(tasks[i].subtasks) {
       return tasks[i].subtasks.length
    } else {
        return 0
    }
}

function createTaskHTML(section, tasks, i, assignedTocontacts, priorityImg, width, checkedSubtasks, subtasksLength) {
    document.getElementById(section).innerHTML += `
    <div draggable="true" ondragstart="startDragging(${id})" onclick="openTaskOverlay(event)" id="single_task_ctn${id}" class="single_task_ctn">
      <div class="single_task_category">${tasks[i].category}</div>
      <div class="single_task_headline">${tasks[i].title}</div>
      <div class="single_task_description">${tasks[i].description}</div>
      <div id="single_task_progress_ctn${tasks[i].single_ID}" class="single_task_progress_ctn">
          <div class="single_task_progress_bar_background">
              <div style="width: ${width};" id="processLineTask${id}" class="single_task_progress_bar_process_line"></div>
          </div>
          <div class="subtasks">${checkedSubtasks}/${subtasksLength} Subtasks</div>
      </div>
      <div class="single_tasks_contacts_and_priority">
          <div id="single_task_contacts_ctn${id}" class="single_task_contacts_ctn">
              ${assignedTocontacts}
          </div>
          <div id="single_task_priority${id}" class="single_task_priority">
            ${priorityImg}
          </div>
      </div>
  </div>
  `

}

function calcProcessBarWidth(checkedSubtasks, subtasksLength) {
    let processBarWidth = checkedSubtasks/subtasksLength*100 + "%";
    if (processBarWidth == "NaN%") {
        processBarWidth = "0%"
    }
    return processBarWidth
} 

function checkCheckedSubtasks(tasks, i) {
    let checkedSubtasksNo = 0;
    if(tasks[i].subtasks) {
        for (let j = 0; j < tasks[i].subtasks.length; j++) {
            if (tasks[i].subtasks[j].checked === true) {
                checkedSubtasksNo++;
            }
        }
    }
    return  checkedSubtasksNo
}

function checkPriorityImg(tasks, i) {
    if (tasks[i].priority === "high") {
        return ` <img src="./assets/img/prio_high.png" alt="roter Pfeil nach oben">`
    }
    if (tasks[i].priority === "medium") {
       return ` <img src="./assets/img/prio_medium.png" alt="orangenes Gleichzeichen">`
    }
    if (tasks[i].priority === "low") {
         return ` <img src="./assets/img/prio_low.png" alt="grüner Pfeil nach unten">`
    }
}

function checkAssignedTo(tasks, i) {
    let contactsIconsTemplate = "";
    for (let j = 0; j < tasks[i].assigned_to.length; j++) {
        let charOneFirstName = tasks[i].assigned_to[j].firstName.charAt(0)
        let charOneLastName = tasks[i].assigned_to[j].lastName.charAt(0)
        contactsIconsTemplate += `
         <div class="single_task_single_contact" id="${tasks[i].assigned_to[j].contact_ID}">${charOneFirstName}${charOneLastName}</div>
        `
    }
    return contactsIconsTemplate
}

function checkTaskCategoryColor() {
    let taskTypes = document.getElementsByClassName("single_task_category");
    Array.from(taskTypes).forEach(taskType => {
        if(taskType.textContent == "User Story") {
            taskType.classList.add("user_story") 
        } else if (taskType.textContent == "Technical Task") {
            taskType.classList.add("technical_task")
        }
    });
}