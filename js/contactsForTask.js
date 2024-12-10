let filteredContactsForTasks = []

/**
 * Filters out null values from the provided contacts and appends a generated contact list template to the DOM.
 *
 * @param {Object} allContactsForTasks - An object containing all contacts, where each contact is associated with a task.
 * @returns {Array} filteredContactsForTasks - An array of contacts excluding null values.
 */
function checkContacts() {
    const contactsArray = Object.values(allContactsForTasks);
    let inputElem= document.getElementById('inputAssignedTo');
    filteredContactsForTasks = [];
    for (let i = 0; i < contactsArray.length; i++) {
      if (contactsArray[i].name.toLowerCase().includes(inputElem.value.toLowerCase())) {filteredContactsForTasks.push(contactsArray[i]);}
    }
    let contactListTemplate = createContactsTemplate(filteredContactsForTasks);
    document.getElementById("insertContactList").innerHTML= contactListTemplate.innerHTML;
    markItems(selectedContacts);
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
    template.id = "contactListTemplate";
    if (filteredContactsForTasks.length === 0) {
      template.innerHTML = `<li class='emptyListMessage'>Ganz schön leer hier! :(</li>`;
    } else {
      for (let i = 0; i < filteredContactsForTasks.length; i++) {
        let isSelected = '';
        let listPersonId = filteredContactsForTasks[i].id;
        const initials = getInitials(filteredContactsForTasks[i].name);
        let contact = renderShowContacts(listPersonId, initials, isSelected, i);
        template.innerHTML += contact;
      }
    }
    return template;
  }

 