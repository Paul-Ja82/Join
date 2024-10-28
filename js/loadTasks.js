const firebase_URL = 'https://join-7ae0e-default-rtdb.europe-west1.firebasedatabase.app/'
let allTasks = [];
let allKeys = [];
let id;
let tasksTodo = [];
let tasksInProgress = [];
let tasksAwaitFeedback = [];
let tasksDone = [];

let assignedToContacts = [
    // {"contact_ID" : "contact0", "firstName" : "Lisa", "lastName" : "Mayer"},
    // {"contact_ID" : "contact1", "firstName" : "Peter", "lastName" : "Müller"},
    // {"contact_ID" : "contact2", "firstName" : "Helga", "lastName" : "Huber"},
    {"contact_ID" : "contact3", "firstName" : "Hans", "lastName" : "Krause"},
    // {"contact_ID" : "contact4", "firstName" : "Ina", "lastName" : "Schmidt"},
]

let subtaskCollection = [
    // {"title" : "erster Schritt", "checked" : false},
    // {"title" : "zweiter Schritt", "checked" : true},
    // {"title" : "dies", "checked" : false},
    // {"title" : "das", "checked" : false},
    // {"title" : "jenes", "checked" : true},
]

async function collectData() {
    let taskData = {
        "assigned_to" : assignedToContacts,
        "category" : 'Technical Task',
        "description" : "Testen der Erweiterung durch Dritte veranlassen",
        "due_date" : "2024-11-20",
        "priority" : "low",
        "subtasks" : subtaskCollection,
        "title" : "TestUser",
        "task_ID" : `task${id}`,
        "currentStatus" : "inProgress",
        
        "single_ID" : id,
    }
    id = Number(id) + 1
    await putID(path="id", id)
    await postData(path="tasks", taskData)
    await getIdAndData(pathData='')
    return id
}

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