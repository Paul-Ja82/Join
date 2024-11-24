let filteredContactsForTasks = []

/**
 * Filters out null values from the given list of contacts and appends the filtered contact list to the DOM.
 * 
 * @param {Array} allContactsForTasks - The array containing all contacts for tasks, which may include null values.
 * @returns {Array} filteredContactsForTasks - The filtered array containing only non-null contacts.
 */
function checkContacts(allContactsForTasks) {
    const contactsArray = Object.values(allContactsForTasks);
    
    filteredContactsForTasks = [];
    for (let i = 0; i < contactsArray.length; i++) {
        if (contactsArray[i] !== null) {
            filteredContactsForTasks.push(contactsArray[i]);
        }
    }
    let contactListTemplate = createContactsTemplate(filteredContactsForTasks);
    document.getElementById("insertContactList").appendChild(contactListTemplate);
    return filteredContactsForTasks;
}

/**
 * Creates a contact list template based on the provided filtered contacts.
 * If the filtered contact list is empty, a message will be displayed. 
 * For each contact, a list item is created with a checkbox and profile information.
 * 
 * @param {Array} filteredContactsForTasks - An array of contacts to be displayed in the list.
 * @returns {HTMLUListElement} The generated unordered list (ul) element containing the contact list.
 */
function createContactsTemplate(filteredContactsForTasks) {
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
    return template
}