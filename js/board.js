function openTaskOverlay(e) {
    document.getElementById(`task_overlay_ctn`).style.right = "0";
    document.body.style.overflow = "hidden"; 
}

function closeTaskOverlay(e) {
    if (e.target.id === "task_overlay_ctn" || e.target.id === "close_task_overlay" || e.target.id === "close_task_overlay_svg") {
        // console.log(e.target.id)
        // console.log(e)
        document.getElementById(`task_overlay_ctn`).style.right = "-100%";
    }
     document.body.style.overflow = "";
}

let currentDraggedElement;

function startDragging(id) {
    currentDraggedElement = `single_task_ctn${id}`;
    console.log(currentDraggedElement)
}

function allowDrop(e) {
    e.preventDefault();
}

function moveTo(category) {

}

function openAddTaskForm() {
    window.location.href = "/add_task.html"
}

const firebase_URL = 'https://join-7ae0e-default-rtdb.europe-west1.firebasedatabase.app/'
let allTasks = [];
let allKeys = [];
let id;

async function getIdAndData(pathData='') {
    let responseData = await fetch(firebase_URL + pathData + ".json");
    let responseDataToJson = await responseData.json();
    console.log(responseDataToJson);
    allTasks = responseDataToJson.tasks
    id = responseDataToJson.id;
    keyForAllTasks()
    checkTaskSections()
    return id
}

let assignedToContacts = [
    // {"contact_ID" : "contact0", "firstName" : "Lisa", "lastName" : "Mayer"},
    {"contact_ID" : "contact1", "firstName" : "Peter", "lastName" : "Müller"},
    // {"contact_ID" : "contact2", "firstName" : "Helga", "lastName" : "Huber"},
    // {"contact_ID" : "contact3", "firstName" : "Hans", "lastName" : "Krause"},
    // {"contact_ID" : "contact4", "firstName" : "Ina", "lastName" : "Schmidt"},
]

let subtaskCollection = [
    // {"title" : "erster Schritt", "checked" : false},
    // {"title" : "zweiter Schritt", "checked" : true},
    // {"title" : "dies", "checked" : false},
    // {"title" : "das", "checked" : false},
    {"title" : "jenes", "checked" : true},
]

async function collectData() {
    let taskData = {
        "assigned_to" : assignedToContacts,
        "category" : 'Technical Task',
        "description" : "Konaktformular erstellen und Newsletter Option einbinden",
        "due_date" : "2024-11-20",
        "priority" : "low",
        "subtasks" : subtaskCollection,
        "title" : "Kontaktformular",
        "task_ID" : `task${id}`,
        "currentStatus" : "awaitFeedback",
        "single_ID" : id,
    }
    id = Number(id) + 1
    // console.log(id, typeof id);
    await putID(path="id", id)
    await postData(path="tasks", taskData)
    await getIdAndData(pathData='')
    return id
}

async function postData(path="", data={}) {
    let response = await fetch(firebase_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    let responseToJson = await response.json();
    console.log(responseToJson); 
}

async function putID(path="", data={}) {
    let response = await fetch(firebase_URL + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    let responseToJson = await response.json();
    // console.log(response);
    // console.log(responseToJson);
}

function keyForAllTasks() {
    allKeys = [];
    allKeys = Object.keys(allTasks)
    // console.log(allKeys)
}

// async function deleteID(path="") {
//     let response = await fetch(firebase_URL + path + ".json", {
//         method: "Delete",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify()
//     });
//     let responseToJson = await response.json();
//     // console.log(response);
//     // console.log(responseToJson);
// }

// async function deleteData() {
//     console.log(idToWork);
//     let keyToDelete = findKey()
//     let keyToDeletePath = `transactions/${keyToDelete}`
//     // console.log(keyToDelete);
//     // console.log(keyToDeletePath);
//     await deleteID(path=keyToDeletePath)
//     await getIdAndData(pathData='')
//     closeMenuMore(idToWork)
//     fillMonthHTML()
   
// }

// function findKey() {
//     let keyToWork;
//     for (let i = 0; i < allKeys.length; i++) {
//         if (allTasks[allKeys[i]].showMoreID == idToWork) {
//             keyToWork = allKeys[i];
//             // console.log(keyToWork);
//             return keyToWork
//         }
//     }
//     return keyToWork
// }

let tasksTodo = [];
let tasksInProgress = [];
let tasksAwaitFeedback = [];
let tasksDone = [];

function checkTaskSections() {
    pushTasksToArray()
    fillTaskSections("to_do_tasks", tasksTodo)
    fillTaskSections("in_progress_tasks", tasksInProgress)
    fillTaskSections("await_feedback_tasks", tasksAwaitFeedback)
    fillTaskSections("done_tasks", tasksDone)
}

function pushTasksToArray() {
    tasksTodo = [];
    tasksInProgress = [];
    tasksAwaitFeedback = [];
    tasksDone = [];
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
        let contacts = checkAssignedTo(tasks, i);
        let priorityImg = checkPriorityImg(tasks, i);
        let width = calcProcessBarWidth(tasks, i);
        document.getElementById(section).innerHTML += `
          <div draggable="true" ondragstart="startDragging(${id})" onclick="openTaskOverlay(event)" id="single_task_ctn${id}" class="single_task_ctn">
            <div class="single_task_category">${tasks[i].category}</div>
            <div class="single_task_headline">${tasks[i].title}</div>
            <div class="single_task_description">${tasks[i].description}</div>
            <div class="single_task_progress_ctn">
                <div class="single_task_progress_bar_background">
                    <div style="width: ${width};" id="processLineTask${id}" class="single_task_progress_bar_process_line"></div>
                </div>
                <div class="subtasks">1/${tasks[i].subtasks.length} Subtasks</div>
            </div>
            <div class="single_tasks_contacts_and_priority">
                <div id="single_task_contacts_ctn${id}" class="single_task_contacts_ctn">
                    ${contacts}
                </div>
                <div id="single_task_priority${id}" class="single_task_priority">
                  ${priorityImg}
                </div>
            </div>
        </div>
        `
    }
}

function calcProcessBarWidth(tasks, i) {
    let checkedSubtasksNo = 0;
    for (let j = 0; j < tasks[i].subtasks.length; j++) {
        if (tasks[i].subtasks[j].checked === true) {
            checkedSubtasksNo++;
        }
    }
    let width = (100 / tasks[i].subtasks.length) * checkedSubtasksNo + "%";
    return width
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