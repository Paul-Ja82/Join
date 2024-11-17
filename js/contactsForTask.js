let allContactsForTasks = []
let filteredContactsForTasks = []

async function getContacsForTasks(pathData='') {
    let responseData = await fetch(firebase_URL + pathData + ".json");
    let responseDataToJson = await responseData.json();
    console.log(responseDataToJson);
    allContactsForTasks = responseDataToJson;

    checkContacts(allContactsForTasks)
}

function checkContacts(allContactsForTasks) {
    filteredContactsForTasks = []
    for (let i = 11; i < allContactsForTasks.length; i++) {
        if (allContactsForTasks[i] !== null) {
            filteredContactsForTasks.push(allContactsForTasks[i])
        }
    }
    console.log(filteredContactsForTasks);
    return filteredContactsForTasks, allContactsForTasks
}