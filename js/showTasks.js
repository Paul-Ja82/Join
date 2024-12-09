let tasksTodo = [];
let tasksInProgress = [];
let tasksAwaitFeedback = [];
let tasksDone = [];

/**
 * Sorts tasks into different categories and populates the corresponding sections.
 */
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

/**
 * Distributes tasks from the `allTasks` object into separate arrays based on their current status.
 * Populates the arrays: `tasksTodo`, `tasksInProgress`, `tasksAwaitFeedback`, and `tasksDone`.
 */
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

/**
 * Distributes filtered tasks into separate arrays based on their current status.
 * Populates the arrays: `filteredTasksTodo`, `filteredTasksInProgress`, `filteredTasksAwaitFeedback`, and `filteredTasksDone`.
 */
function pushFilteredTasksToArray() {
    for (let i = 0; i < filteredKeys.length; i++) {
        if (filteredTasks[i].currentStatus === "todo") {
            filteredTasksTodo.push(filteredTasks[i])
        } 
        if (filteredTasks[i].currentStatus === "inProgress") {
            filteredTasksInProgress.push(filteredTasks[i])
        }
        if (filteredTasks[i].currentStatus === "awaitFeedback") {
            filteredTasksAwaitFeedback.push(filteredTasks[i])
        }
        if (filteredTasks[i].currentStatus === "done") {
            filteredTasksDone.push(filteredTasks[i])
        }
    }
}

/**
 * Populates a section with task elements based on the provided tasks array.
 * 
 * @param {string} section - The ID of the section to populate with tasks.
 * @param {Array<Object>} tasks - An array of task objects to be displayed in the section.
 */
function fillTaskSections(section, tasks) {
    document.getElementById(section).innerHTML = "";
    for (let i = 0; i < tasks.length; i++) {
        let assignedTocontacts = checkAssignedTo(tasks, i);
       
        let priorityImg = checkPriorityImg(tasks, i);
        let daysInFuture = checkDaysInFuture(tasks, i);
        let daysInPast = checkDaysInPast(tasks, i);
        let checkedSubtasks = checkCheckedSubtasks(tasks, i);
        let subtasksLength = checkSubtaskLength(tasks, i)
        let width = calcProcessBarWidth(checkedSubtasks, subtasksLength);
        createTaskHTML(section, tasks, i, assignedTocontacts, priorityImg, width, checkedSubtasks, subtasksLength)
        newUrgencyImg(daysInFuture, daysInPast, tasks, i)
    }
    let moveToShadow = createDragAndDropShadow(section)
    nothingTodoOrDone(tasks, section)
    document.getElementById(section).appendChild(moveToShadow)
    checkTaskCategoryColor("single_task_category")
    showSubtaskCtn()
}

/**
 * Updates the urgency icon of a task based on its due date and completion status.
 *
 * @param {number} daysInFuture - The number of days remaining until the task's due date.
 * @param {number} daysInPast - The number of days past the task's due date.
 * @param {Object[]} tasks - The array of task objects.
 * @param {number} i - The index of the current task in the tasks array.
 */
function newUrgencyImg(daysInFuture, daysInPast, tasks, i) {
    if (daysInFuture <= 3 && tasks[i].currentStatus != "done" ||
        daysInPast <= 0 && tasks[i].currentStatus != "done"
    ) {
        document.getElementById(`single_task_priority${tasks[i].single_ID}`).innerHTML = "";
        document.getElementById(`single_task_priority${tasks[i].single_ID}`).innerHTML = 
        `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_75609_16176)">
                <path d="M16 14.7548C16.1994 14.7544 16.3937 14.8163 16.5543 14.9314L24.1228 20.3653C24.2212 20.4361 24.3044 20.525 24.3675 20.627C24.4307 20.7291 24.4725 20.8422 24.4907 20.9599C24.5273 21.1977 24.4654 21.4399 24.3184 21.6333C24.1714 21.8266 23.9514 21.9553 23.7068 21.9909C23.4623 22.0266 23.2131 21.9664 23.0143 21.8234L16 16.7925L8.98577 21.8234C8.8873 21.8942 8.77545 21.9454 8.65662 21.9742C8.53779 22.0029 8.4143 22.0086 8.2932 21.9909C8.1721 21.9733 8.05577 21.9326 7.95084 21.8712C7.84592 21.8099 7.75445 21.729 7.68166 21.6333C7.60888 21.5375 7.5562 21.4288 7.52664 21.3132C7.49708 21.1977 7.49122 21.0776 7.50938 20.9599C7.52754 20.8422 7.56938 20.7291 7.63251 20.627C7.69563 20.525 7.77881 20.4361 7.87728 20.3653L15.4458 14.9314C15.6063 14.8163 15.8006 14.7544 16 14.7548Z" fill="#FF3D00"/>
                <path d="M16 9.99988C16.1994 9.99954 16.3937 10.0614 16.5543 10.1765L24.1228 15.6104C24.3216 15.7534 24.454 15.9672 24.4907 16.205C24.5273 16.4428 24.4654 16.685 24.3184 16.8784C24.1714 17.0717 23.9514 17.2004 23.7068 17.2361C23.4623 17.2717 23.2131 17.2115 23.0143 17.0686L16 12.0376L8.98577 17.0686C8.78689 17.2115 8.53777 17.2717 8.2932 17.2361C8.04863 17.2004 7.82866 17.0717 7.68166 16.8784C7.53467 16.685 7.47269 16.4428 7.50938 16.205C7.54606 15.9672 7.6784 15.7534 7.87728 15.6104L15.4458 10.1765C15.6063 10.0614 15.8006 9.99954 16 9.99988Z" fill="#FF3D00"/>
            </g>
            <defs>
                <clipPath id="clip0_75609_16176">
                    <rect width="17" height="12" fill="white" transform="translate(24.5 22) rotate(-180)"/>
                </clipPath>
            </defs>
        </svg>`
    }
}

/**
 * Calculates the number of days between the current date and the due date of a task.
 *
 * @param {Object[]} tasks - The array of task objects.
 * @param {number} i - The index of the current task in the tasks array.
 * @returns {number} The number of days between the current date and the due date of the task.
 */
function checkDaysInFuture(tasks, i) {
    const today = new Date();
    const inputDate = new Date(tasks[i].due_date);
    const diffTime = Math.abs(inputDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays
}

/**
 * Calculates the number of days past the current date for the due date of a task.
 *
 * @param {Object[]} tasks - The array of task objects.
 * @param {number} i - The index of the current task in the tasks array.
 * @returns {number} The number of days past the current date for the task's due date. 
 *                  A negative value indicates the task is overdue.
 */
function checkDaysInPast(tasks, i) {
    const today = new Date();
    const inputDate = new Date(tasks[i].due_date);
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);
    const diffTime = inputDate - today;
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Creates a shadow element for drag-and-drop functionality.
 * 
 * @param {string} section - The ID of the section where the shadow element will be used.
 * @returns {HTMLDivElement} The created shadow element with the appropriate class and ID.
 */
function createDragAndDropShadow(section) {
    let shadow = document.createElement("div");
    shadow.className = "move_to_shadow";
    shadow.id = `shadow_move_to_${section}`;
    return shadow;
}

/**
 * Generates a template with icons representing the contacts assigned to a specific task.
 * 
 * @param {Array<Object>} tasks - An array of task objects.
 * @param {number} i - The index of the task in the tasks array.
 * @returns {string} A string containing the HTML template for the assigned contacts' icons.
 */
function checkAssignedTo(tasks, i) {
    let contactsIconsTemplate = "";
    if (tasks[i].assigned_to == 'nobody') {
        contactsIconsTemplate = "";
    } else {
        if (tasks[i].assigned_to.length >= 5) {
            for (let j = 0; j < 5 ; j++) {contactsIconsTemplate += createContactsIconsTemplate(tasks, i, j)}  
            if (tasks[i].assigned_to.length > 5) {let moreContacts = tasks[i].assigned_to.length - 5; 
                contactsIconsTemplate += `<div class="single_task_single_contact" id="">+${moreContacts}</div>`}
        }
        if (tasks[i].assigned_to.length < 5) {
            for (let j = 0; j < tasks[i].assigned_to.length; j++) {          
            contactsIconsTemplate += createContactsIconsTemplate(tasks, i, j)
            }  
        }
    }
    return contactsIconsTemplate
}

/**
 * Creates a template for a contact icon displaying the initials of the assigned contact.
 * 
 * @param {Array<Object>} tasks - An array of task objects.
 * @param {number} i - The index of the task in the tasks array.
 * @param {number} j - The index of the assigned contact in the `assigned_to` array of the task.
 * @returns {string} A string containing the HTML template for a single contact icon, styled with initials and a background color.
 */
function createContactsIconsTemplate(tasks, i, j) {
    let iconsTemplate = "";
    let fullName = tasks[i].assigned_to[j];
    let charOneFirstName = "";
    let charOneLastName = "";
    let backgroundColorInitials = checkContactColor(fullName, allContactsForTasks); 
    if (fullName.includes(" ")) {
        let partsOfName = fullName.split(" ");
        charOneFirstName = partsOfName[0][0].toUpperCase();
        charOneLastName = partsOfName[1][0].toUpperCase();
    } else {
        charOneFirstName = fullName[0].toUpperCase(); 
    }
    iconsTemplate += `<div style="background-color: ${backgroundColorInitials};" class="single_task_single_contact" id="">${charOneFirstName}${charOneLastName}</div>`
    return iconsTemplate
}

/**
 * Generates an SVG icon representing the priority level of a task.
 * 
 * @param {Array<Object>} tasks - An array of task objects.
 * @param {number} i - The index of the task in the tasks array.
 * @returns {string} A string containing the SVG markup for the priority icon.
 * 
 * - If the priority is "urgent" or "high", a red icon is returned.
 * - If the priority is "medium", an orange icon is returned.
 * - If the priority is "low", a green icon is returned.
 */
function checkPriorityImg(tasks, i) {
    if (tasks[i].priority === "urgent") {
        return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_75609_16176)">
                <path d="M16 14.7548C16.1994 14.7544 16.3937 14.8163 16.5543 14.9314L24.1228 20.3653C24.2212 20.4361 24.3044 20.525 24.3675 20.627C24.4307 20.7291 24.4725 20.8422 24.4907 20.9599C24.5273 21.1977 24.4654 21.4399 24.3184 21.6333C24.1714 21.8266 23.9514 21.9553 23.7068 21.9909C23.4623 22.0266 23.2131 21.9664 23.0143 21.8234L16 16.7925L8.98577 21.8234C8.8873 21.8942 8.77545 21.9454 8.65662 21.9742C8.53779 22.0029 8.4143 22.0086 8.2932 21.9909C8.1721 21.9733 8.05577 21.9326 7.95084 21.8712C7.84592 21.8099 7.75445 21.729 7.68166 21.6333C7.60888 21.5375 7.5562 21.4288 7.52664 21.3132C7.49708 21.1977 7.49122 21.0776 7.50938 20.9599C7.52754 20.8422 7.56938 20.7291 7.63251 20.627C7.69563 20.525 7.77881 20.4361 7.87728 20.3653L15.4458 14.9314C15.6063 14.8163 15.8006 14.7544 16 14.7548Z" fill="#FF3D00"/>
                <path d="M16 9.99988C16.1994 9.99954 16.3937 10.0614 16.5543 10.1765L24.1228 15.6104C24.3216 15.7534 24.454 15.9672 24.4907 16.205C24.5273 16.4428 24.4654 16.685 24.3184 16.8784C24.1714 17.0717 23.9514 17.2004 23.7068 17.2361C23.4623 17.2717 23.2131 17.2115 23.0143 17.0686L16 12.0376L8.98577 17.0686C8.78689 17.2115 8.53777 17.2717 8.2932 17.2361C8.04863 17.2004 7.82866 17.0717 7.68166 16.8784C7.53467 16.685 7.47269 16.4428 7.50938 16.205C7.54606 15.9672 7.6784 15.7534 7.87728 15.6104L15.4458 10.1765C15.6063 10.0614 15.8006 9.99954 16 9.99988Z" fill="#FF3D00"/>
            </g>
            <defs>
                <clipPath id="clip0_75609_16176">
                    <rect width="17" height="12" fill="white" transform="translate(24.5 22) rotate(-180)"/>
                </clipPath>
            </defs>
        </svg>`
    }
    if (tasks[i].priority === "medium") {
        return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_75609_16182)">
                        <path d="M23.5685 19.1666L8.43151 19.1666C8.18446 19.1666 7.94752 19.0677 7.77283 18.8918C7.59814 18.7158 7.5 18.4772 7.5 18.2283C7.5 17.9795 7.59814 17.7408 7.77283 17.5649C7.94752 17.3889 8.18446 17.29 8.43151 17.29L23.5685 17.29C23.8155 17.29 24.0525 17.3889 24.2272 17.5649C24.4019 17.7408 24.5 17.9795 24.5 18.2283C24.5 18.4772 24.4019 18.7158 24.2272 18.8918C24.0525 19.0677 23.8155 19.1666 23.5685 19.1666Z" fill="#FFA800"/>
                        <path d="M23.5685 14.7098L8.43151 14.7098C8.18446 14.7098 7.94752 14.6109 7.77283 14.435C7.59814 14.259 7.5 14.0204 7.5 13.7715C7.5 13.5227 7.59814 13.284 7.77283 13.1081C7.94752 12.9321 8.18446 12.8333 8.43151 12.8333L23.5685 12.8333C23.8155 12.8333 24.0525 12.9321 24.2272 13.1081C24.4019 13.284 24.5 13.5227 24.5 13.7715C24.5 14.0204 24.4019 14.259 24.2272 14.435C24.0525 14.6109 23.8155 14.7098 23.5685 14.7098Z" fill="#FFA800"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_75609_16182">
                        <rect width="17" height="6.33333" fill="white" transform="translate(7.5 12.8333)"/>
                        </clipPath>
                    </defs>
                </svg>`
    }
    if (tasks[i].priority === "low") {
        return `<svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.99998 7.24524C8.80055 7.24557 8.60628 7.18367 8.44574 7.06863L0.877242 1.63467C0.778768 1.56391 0.695595 1.47498 0.632471 1.37296C0.569347 1.27094 0.527508 1.15784 0.509344 1.0401C0.472658 0.802317 0.53463 0.560105 0.681625 0.366747C0.828621 0.17339 1.0486 0.0447247 1.29317 0.00905743C1.53773 -0.0266099 1.78686 0.0336422 1.98574 0.176559L8.99998 5.2075L16.0142 0.17656C16.1127 0.105795 16.2245 0.0545799 16.3434 0.02584C16.4622 -0.00289994 16.5857 -0.00860237 16.7068 0.00905829C16.8279 0.0267189 16.9442 0.0673968 17.0492 0.128769C17.1541 0.190142 17.2456 0.271007 17.3183 0.366748C17.3911 0.462489 17.4438 0.571231 17.4734 0.686765C17.5029 0.802299 17.5088 0.922362 17.4906 1.0401C17.4725 1.15784 17.4306 1.27094 17.3675 1.37296C17.3044 1.47498 17.2212 1.56391 17.1227 1.63467L9.55423 7.06863C9.39369 7.18367 9.19941 7.24557 8.99998 7.24524Z" fill="#7AE229"/>
                    <path d="M8.99998 12.0001C8.80055 12.0005 8.60628 11.9386 8.44574 11.8235L0.877242 6.38955C0.678366 6.24664 0.546029 6.03276 0.509344 5.79498C0.472658 5.5572 0.53463 5.31499 0.681625 5.12163C0.828621 4.92827 1.0486 4.79961 1.29317 4.76394C1.53773 4.72827 1.78686 4.78853 1.98574 4.93144L8.99998 9.96239L16.0142 4.93144C16.2131 4.78853 16.4622 4.72827 16.7068 4.76394C16.9514 4.79961 17.1713 4.92827 17.3183 5.12163C17.4653 5.31499 17.5273 5.5572 17.4906 5.79498C17.4539 6.03276 17.3216 6.24664 17.1227 6.38956L9.55423 11.8235C9.39369 11.9386 9.19941 12.0005 8.99998 12.0001Z" fill="#7AE229"/>
                </svg>`
    }
}

/**
 * Counts how many of the subtasks of a specific task are marked as completed.
 * 
 * @param {Object[]} tasks - Array of tasks, each of which may contain a subtasks array.
 * @param {number} i - The index of the task for which completed subtasks are to be counted.
 * @returns {number} - The number of completed subtasks (with `checked: true`).
 */
function checkCheckedSubtasks(tasks, i) {
    let checkedSubtasksNo = 0;
    if(tasks[i].subtasks) {
        for (let j = 0; j < tasks[i].subtasks.length; j++) {
            if (tasks[i].subtasks[j].checked === true) {
                checkedSubtasksNo++;
            }
        }
    }
    return checkedSubtasksNo
}

/**
 * Returns the number of subtasks for a specific task.
 * 
 * @param {Object[]} tasks - Array of tasks, each of which may contain a subtasks array.
 * @param {number} i - The index of the task for which the number of subtasks is to be returned.
 * @returns {number} - The number of subtasks for the specified task, or 0 if no subtasks exist.
 */
function checkSubtaskLength(tasks, i) {
    if(tasks[i].subtasks) {
       return tasks[i].subtasks.length
    } else {
        return 0
    }
}

/**
 * Calculates the width of a progress bar based on the number of checked subtasks and the total number of subtasks.
 * 
 * @param {number} checkedSubtasks - The number of checked subtasks.
 * @param {number} subtasksLength - The total number of subtasks.
 * @returns {string} - The width of the progress bar as a percentage (e.g., "50%"), or "0%" if the calculation results in NaN.
 */
function calcProcessBarWidth(checkedSubtasks, subtasksLength) {
    let processBarWidth = checkedSubtasks/subtasksLength*100 + "%";
    if (processBarWidth == "NaN%") {
        processBarWidth = "0%"
    }
    return processBarWidth
} 

/**
 * Generates and appends the HTML for a task to a specified section.
 * The task HTML includes details such as category, title, description, progress, contacts, and priority.
 * It also sets up event listeners for drag-and-drop functionality and task status updates.
 * 
 * @param {string} section - The ID of the section where the task HTML should be appended.
 * @param {Array} tasks - An array of task objects containing task details.
 * @param {number} i - The index of the task in the `tasks` array to generate HTML for.
 * @param {string} assignedTocontacts - The HTML for the contacts assigned to the task.
 * @param {string} priorityImg - The HTML or image source for the task's priority icon.
 * @param {string} width - The width of the progress bar, represented as a percentage (e.g., "50%").
 * @param {number} checkedSubtasks - The number of checked subtasks.
 * @param {number} subtasksLength - The total number of subtasks.
 */
function createTaskHTML(section, tasks, i, assignedTocontacts, priorityImg, width, checkedSubtasks, subtasksLength) {
    document.getElementById(section).innerHTML += `
    <div draggable="true" 
    onmousedown="if (window.innerWidth > 600) cloneElement(${tasks[i].single_ID}, event)"
    ondragstart="if (window.innerWidth > 600) startDragging(event)" 
    ondrag="if (window.innerWidth > 600) whileDragging(event)"
    ondragend="if (window.innerWidth > 600) checkDraggableArea(event)"
    onclick="checkTask(event)"  
    id="single_task_ctn${tasks[i].single_ID}" class="single_task_ctn">
        <div class="single_task_category">${tasks[i].category}</div>
        <div class="single_task_headline">${tasks[i].title}</div>
        <div class="single_task_description">${tasks[i].description}</div>
        <div id="single_task_progress_ctn${tasks[i].single_ID}" class="single_task_progress_ctn">
            <div class="single_task_progress_bar_background">
                <div style="width: ${width};" id="processLineTask${tasks[i].single_ID}" class="single_task_progress_bar_process_line"></div>
            </div>
            <div class="subtasks">${checkedSubtasks}/${subtasksLength} Subtasks</div>
        </div>
        <div class="single_tasks_contacts_and_priority">
            <div id="single_task_contacts_ctn${tasks[i].single_ID}" class="single_task_contacts_ctn">
                ${assignedTocontacts}
            </div>
            <div id="single_task_priority${tasks[i].single_ID}" class="single_task_priority">
            ${priorityImg}
            </div>
        </div>
        <div id="move_to_section_button_and_menu" class="move_to_section_button_and_menu">
            <div onclick="openCloseMenuMovingTask(event, '${tasks[i].single_ID}', '${tasks[i].currentStatus}')" class="move_to_section_button">
                <img onclick="openCloseMenuMovingTask(event, '${tasks[i].single_ID}', '${tasks[i].currentStatus}')" src="./assets/img/icons8-move-50.png" alt="Pfeil in alle Richtungen">
            </div>
            <div id="move_task_menu_${tasks[i].single_ID}" class="move_to_section_menu">
                <div id="move_${tasks[i].single_ID}_to_todo" onclick="event.stopPropagation(); moveTaskWithMenu('${tasks[i].single_ID}', 'todo')" class="link_section">To Do</div>
                <div id="move_${tasks[i].single_ID}_to_inProgress" onclick="event.stopPropagation(); moveTaskWithMenu('${tasks[i].single_ID}', 'inProgress')" class="link_section">In Progress</div>
                <div id="move_${tasks[i].single_ID}_to_awaitFeedback" onclick="event.stopPropagation(); moveTaskWithMenu('${tasks[i].single_ID}', 'awaitFeedback')" class="link_section">Await Feedback</div>
                <div id="move_${tasks[i].single_ID}_to_done" onclick="event.stopPropagation(); moveTaskWithMenu('${tasks[i].single_ID}', 'done')" class="link_section">Done</div>
            </div>
        </div>
  </div>
  `
}

/**
 * Adds a specific class to task category elements based on their text content.
 * The function checks the text of each element and applies a corresponding class:
 * - Adds the class "user_story" for elements with the text "User Story".
 * - Adds the class "technical_task" for elements with the text "Technical Task".
 * 
 * @param {string} classname - The class name of the task category elements to be processed.
 */
function checkTaskCategoryColor(classname) {
    let taskTypes = document.getElementsByClassName(classname);
    Array.from(taskTypes).forEach(taskType => {
        if(taskType.textContent == "User Story") {
            taskType.classList.add("user_story") 
        } else if (taskType.textContent == "Technical Task") {
            taskType.classList.add("technical_task")
        }
    });
}

/**
 * Toggles the visibility of the task progress container based on the number of subtasks.
 * If the container contains the text "0/0 Subtasks", it hides the container.
 * Otherwise, it sets the container's display style to "flex" to make it visible.
 */
function showSubtaskCtn() {
    let subtascsCtn = document.getElementsByClassName("single_task_progress_ctn");
    Array.from(subtascsCtn).forEach(ctn => {
        if(ctn.innerHTML.includes("0/0 Subtasks")) {
            ctn.style.display = "none" 
        } else {
            ctn.style.display = "flex"
        }
    });
}

/**
 * Toggles the visibility of a section's "nothing" message based on whether the task list is empty.
 * If the task list is empty, it displays the element with the ID `${section}_nothing` as a flex container.
 * Otherwise, it hides the element.
 * 
 * @param {Array} tasks - The list of tasks to check.
 * @param {string} section - The section identifier used to target the "nothing" element.
 */
function nothingTodoOrDone(tasks, section) {
    if (tasks.length == 0) {
        document.getElementById(`${section}_nothing`).style.display = "flex";
    } else {
        document.getElementById(`${section}_nothing`).style.display = "none";
    }
}