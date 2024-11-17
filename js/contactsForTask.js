let allContactsForTasks = []
let filteredContactsForTasks = []

async function getContacsForTasks(pathData='') {
    let responseData = await fetch(firebase_URL + pathData + ".json");
    let responseDataToJson = await responseData.json();
    // console.log(responseDataToJson);
    allContactsForTasks = responseDataToJson.contacts;
    filteredContactsForTasks = checkContacts(allContactsForTasks);
    return allContactsForTasks, filteredContactsForTasks
}

function checkContacts(allContactsForTasks) {
    filteredContactsForTasks = []
    // console.log(allContactsForTasks);
    
    for (let i = 11; i < allContactsForTasks.length; i++) {
        if (allContactsForTasks[i] !== null) {
            filteredContactsForTasks.push(allContactsForTasks[i])
        }
    }
    
    let contactListTemplate = createContactsTemplate(filteredContactsForTasks)
    document.getElementById("insertContactList").appendChild(contactListTemplate)
    
}

function createContactsTemplate(filteredContactsForTasks) {
    console.log(filteredContactsForTasks);
    let template = document.createElement("ul");
    template.id = "contactListTemplate"
    if (filteredContactsForTasks.length == 0) {
        template.innerHTML = `
        <li class='emptyListMessage'>Ganz schön leer hier! :(</li>`
    } else {
        for (let i = 0; i < filteredContactsForTasks.length; i++) {
            let isSelected = '';
            let contact = `
                <li id="listPerson${filteredContactsForTasks[i].id}" class="backgroundOnHover" onclick="changeCheckbox(${filteredContactsForTasks[i].id})">
                    <div class="profile">
                        <div id="profilPerson${filteredContactsForTasks[i].id}" class="profilePerson"></div>    
                        <div class="contactPerson">${filteredContactsForTasks[i].name}</div>
                    </div>
                    <input type="checkbox" value="${filteredContactsForTasks[i].name}" class="contactListCheckbox" 
                        id="checkbox${filteredContactsForTasks[i].id}" onchange="renderAddedPersons()" 
                        onclick="event.stopPropagation()" 
                        ${isSelected ? "checked" : ""}
                    >
                    <img id="checkboxId${filteredContactsForTasks[i].id}" src="assets/icons/checkbox.svg">
                </li>`
            // console.log(contact);
            template.innerHTML += contact
        }
    }
    console.log(template);
    return template
}