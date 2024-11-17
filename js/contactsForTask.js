let filteredContactsForTasks = []

function checkContacts(allContactsForTasks) {
    filteredContactsForTasks = [];
    for (let i = 11; i < allContactsForTasks.length; i++) {
        if (allContactsForTasks[i] !== null) {
            filteredContactsForTasks.push(allContactsForTasks[i])
        }
    }
    let contactListTemplate = createContactsTemplate(filteredContactsForTasks)
    document.getElementById("insertContactList").appendChild(contactListTemplate)
    return filteredContactsForTasks
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
            let listPersonId = filteredContactsForTasks[i].id;
            const initials = getInitials(filteredContactsForTasks[i].name);
            let contact = `
                <li id="listPerson${listPersonId}" class="backgroundOnHover" onclick="changeCheckbox(${listPersonId})">
                    <div class="profile">
                        <div class="initialsImg" id="initialsImg${listPersonId}" style="background-color: ${filteredContactsForTasks[i].color}">
                            ${initials}
                        </div>
                        <div id="profilPerson${listPersonId}" class="profilePerson"></div>    
                        <div class="contactPerson">${filteredContactsForTasks[i].name}</div>
                    </div>
                    <input type="checkbox" value="${filteredContactsForTasks[i].name}" class="contactListCheckbox" 
                        id="checkbox${filteredContactsForTasks[i].id}" onchange="renderAddedPersons()" 
                        onclick="event.stopPropagation()" 
                        ${isSelected ? "checked" : ""}
                    >
                    <img id="checkboxId${listPersonId}" src="assets/icons/checkbox.svg">
                </li>`
            template.innerHTML += contact
        }
    }
    console.log(template);
    return template
}