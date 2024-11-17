const firebase_URL = 'https://join-7ae0e-default-rtdb.europe-west1.firebasedatabase.app/'
let allTasks = [];
let allKeys = [];
let id;

// async function collectData(currentStatus, selectedContacts) {
    
//     let taskData = {
//         "assigned_to" : selectedContacts,
//         "category" : document.getElementById("categoryToSelect").value,
//         "description" : document.getElementById("description").value,
//         "due_date" : document.getElementById("date").value,
//         "priority" : selectedPrio == null ? "medium" : selectedPrio,
//         "subtasks" : subtasks,
//         "title" : document.getElementById("title").value,
//         "currentStatus" : currentStatus,
//         "single_ID" : id,
//     }
//     id = Number(id) + 1
//     await putID(path="id", id)
//     await postData(path="tasks", taskData)
//     await getIdAndData(pathData='')
//     return id
// }

async function collectDataFromAddTask(currentStatus, selectedContacts) {
    console.log(selectedContacts);
    if(selectedContacts.length == 0) {
        selectedContacts = 'nobody'
    }
    let taskData = {
        "assigned_to" : selectedContacts,
        "category" : document.getElementById("showSelectedCategory").value,
        "description" : document.getElementById("description").value,
        "due_date" : document.getElementById("date").value,
        "priority" : selectedPrio == null ? "medium" : selectedPrio,
        "subtasks" : subtasks,
        "title" : document.getElementById("title").value,
        "currentStatus" : currentStatus,
        "single_ID" : id,
    }
    id = Number(id) + 1
    await putID(path="id", id)
    await postData(path="tasks", taskData)
    await getIdAndDataForAddTask(pathData='')
    return id
}

async function getIdAndDataForAddTask(pathData='') {
    let responseData = await fetch(firebase_URL + pathData + ".json");
    let responseDataToJson = await responseData.json();
    console.log(responseDataToJson);
    allTasks = responseDataToJson.tasks
    id = responseDataToJson.id;
    return id
}

async function getIdAndData(pathData='') {
    let responseData = await fetch(firebase_URL + pathData + ".json");
    let responseDataToJson = await responseData.json();
    console.log(responseDataToJson);
    allTasks = responseDataToJson.tasks
    id = responseDataToJson.id;
    keyForAllTasks();
    checkTaskSections();
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
}

async function putNewSection(path="", data={}) {
    let response = await fetch(firebase_URL + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    let responseToJson = await response.json();
}

async function putNewCheckedStatus(path="", data={}) {
    let response = await fetch(firebase_URL + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    let responseToJson = await response.json();
}

function keyForAllTasks() {
    allKeys = [];
    allKeys = Object.keys(allTasks);
}

async function deleteTaskID(path="") {
    let response = await fetch(firebase_URL + path + ".json", {
        method: "Delete",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify()
    });
    let responseToJson = await response.json();
}