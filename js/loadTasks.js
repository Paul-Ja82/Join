// const firebase_URL = 'https://join-7ae0e-default-rtdb.europe-west1.firebasedatabase.app/'
const firebase_URL = 'https://join-43c13-default-rtdb.europe-west1.firebasedatabase.app/'

let allTasks = [];
let allKeys = [];
let allContactsForTasks = [];
let id;

/**
 * Collects data for a new task, prepares the task object, and sends it to the server.
 * If no contacts are selected, it assigns 'nobody' as the default value. It also updates the task ID and retrieves updated data after the task is added.
 *
 * @async
 * @param {string} currentStatus - The current status of the task (e.g., "open", "in-progress").
 * @param {Array} selectedContacts - An array of selected contacts assigned to the task. If empty, 'nobody' is used.
 * @returns {number} - The updated task ID after creation.
 */
async function collectDataFromAddTask(currentStatus, selectedContacts) {
    if(selectedContacts.length == 0) {
        selectedContacts = 'nobody';
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
    id = Number(id) + 1;
    await putID(path="id", id);
    await postData(path="tasks", taskData);
    await getIdAndDataForAddTask(pathData='');
    return id
}

/**
 * Collects updated data for an existing task, prepares the task object with new values, and sends it to the server.
 * It updates the task details, retrieves the updated data after changes, and triggers the opening of the edited task.
 *
 * *@async
 */
async function collectDataFromChangingAddTask() {
    let taskData = {
        "assigned_to" : "",
        "category" : document.getElementById("showSelectedCategory").value,
        "description" : document.getElementById("description").value,
        "due_date" : document.getElementById("date").value,
        "priority" : selectedPrio == null ? "medium" : selectedPrio,
        "subtasks" : subtasks,
        "title" : document.getElementById("title").value,
        "currentStatus" : currentStatusofChangingTask,
        "single_ID" : currentTaskForEdit,
    }
    await putChangeInTask(path=`${currentKeyToOpen}`, taskData);
    await getIdAndData(pathData='');
    openEditedTask();
}

/**
 * Fetches the task data, ID, and contacts from the Firebase database and updates the local variables.
 * It retrieves the data from a specified path and returns the task ID, tasks list, and contacts associated with the tasks.
 *
 * @async
 * @param {string} [pathData=''] - The path to the Firebase data to fetch. Defaults to an empty string if not provided.
 * @returns {Promise<Object>} A promise that resolves to an object containing the task ID, tasks, and contacts.
 */
async function getIdAndDataForAddTask(pathData='') {
    let responseData = await fetch(firebase_URL + pathData + ".json");
    let responseDataToJson = await responseData.json();
    allTasks = responseDataToJson.tasks
    id = responseDataToJson.id;
    allContactsForTasks = responseDataToJson.contacts;
    return id, allTasks, allContactsForTasks
}

/**
 * Fetches task data, ID, and contacts from the Firebase database and updates local variables.
 * It retrieves data from the specified path and processes it by calling additional functions like `keyForAllTasks` and `checkTaskSections`.
 *
 * @async
 * @param {string} [pathData=''] - The path to the Firebase data to fetch. Defaults to an empty string if not provided.
 * @returns {Promise<Object>} A promise that resolves to an object containing the task ID, tasks, and contacts.
 */
async function getIdAndData(pathData='') {
    let responseData = await fetch(firebase_URL + pathData + ".json");
    let responseDataToJson = await responseData.json();
    console.log(responseDataToJson);
    allTasks = responseDataToJson.tasks
    id = responseDataToJson.id;
    allContactsForTasks = responseDataToJson.contacts;
    keyForAllTasks();
    checkTaskSections();
    return id, allTasks, allContactsForTasks
}

/**
 * Sends data to the specified Firebase path using a POST request.
 * The data is sent as a JSON object, and the function waits for a response after the request is made.
 *
 * @async
 * @param {string} [path=""] - The Firebase path where the data should be posted.
 * @param {Object} [data={}] - The data to be sent in the request body.
 * @returns {Promise<void>} A promise that resolves when the data has been successfully posted.
 */
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

/**
 * Sends data to the specified Firebase path using a POST request.
 * The data is sent as a JSON object, and the function waits for a response after the request is made.
 *
 * @async
 * @param {string} [path=""] - The Firebase path where the data should be posted.
 * @param {Object} [data={}] - The data to be sent in the request body.
 * @returns {Promise<void>} A promise that resolves when the data has been successfully posted.
 */
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

/**
 * Sends data to the specified Firebase path using a PUT request, updating or creating a new section at the given path.
 * The data is sent as a JSON object, and the function waits for a response after the request is made.
 *
 * @async
 * @param {string} [path=""] - The Firebase path where the data should be updated or a new section should be created.
 * @param {Object} [data={}] - The data to be sent in the request body, either updating an existing section or creating a new one.
 * @returns {Promise<void>} A promise that resolves when the new section has been successfully added or the data updated.
 */
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

/**
 * Sends updated data to a specific task in Firebase using a PUT request.
 * The data is sent as a JSON object, and the function waits for a response after the request is made.
 *
 * @async
 * @param {string} [path=""] - The Firebase path of the task to be updated (e.g., task ID).
 * @param {Object} [data={}] - The data to be sent in the request body, updating the specified task.
 * @returns {Promise<void>} A promise that resolves when the task has been successfully updated.
 */
async function putChangeInTask(path="", data={}) {
    let response = await fetch(firebase_URL + "/tasks/" + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    let responseToJson = await response.json();
}

/**
 * Sends updated checked status data to the specified Firebase path using a PUT request.
 * The data is sent as a JSON object, and the function waits for a response after the request is made.
 *
 * @async
 * @param {string} [path=""] - The Firebase path where the checked status data should be updated.
 * @param {Object} [data={}] - The data to be sent in the request body, updating the checked status.
 * @returns {Promise<void>} A promise that resolves when the checked status has been successfully updated.
 */
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

/**
 * Fetches data for a specific task from Firebase using a GET request.
 * The function retrieves the task data from the specified path and returns it as a JSON object.
 *
 * @async
 * @param {string} [pathData=''] - The Firebase path of the task to fetch. Defaults to an empty string if not provided.
 * @returns {Promise<Object>} A promise that resolves to the task data as a JSON object.
 */
async function getTaskForEdit(pathData='') {
    let responseData = await fetch(firebase_URL + pathData + ".json");
    let responseDataToJson = await responseData.json();
    console.log(responseDataToJson);
    return responseDataToJson
}

/**
 * Retrieves all the keys from the `allTasks` object and stores them in the `allKeys` array.
 * This function updates the `allKeys` array with the keys of the `allTasks` object.
 *
 * @returns {void}
 */
function keyForAllTasks() {
    allKeys = [];
    allKeys = Object.keys(allTasks);
}

/**
 * Deletes a task from Firebase at the specified path using a DELETE request.
 * The function sends the request to remove the task data from the specified Firebase path.
 *
 * @async
 * @param {string} [path=""] - The Firebase path of the task to be deleted.
 * @returns {Promise<void>} A promise that resolves once the task has been successfully deleted.
 */
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