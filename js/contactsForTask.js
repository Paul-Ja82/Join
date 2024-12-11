let filteredContactsForTasks = []

/**
 * Filters out null values from the provided contacts and appends a generated contact list template to the DOM.
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
 * Generates a contact list template from filtered contacts.
 * @param {Array} filteredContactsForTasks - Array of contacts to display.
 * @returns {HTMLUListElement} Unordered list element with contact items or a message if empty.
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

 /**
 * Renders the filtered contacts into the contact list.
 */
function returnRenderdContacts() {
  filteredContacts.forEach((contact, index) => {
    const isSelected = selectedContacts.includes(contact);
    contactList.innerHTML += getContactListItemHTML(contact, index, isSelected);
    showProfilPicture(contact, index);
    if (isSelected) {
      document.getElementById(`checkboxId${index}`).src =
        "assets/icons/checkboxChecked.svg";
    }
  });
}

/**
 * Filters contacts based on input text, updates the contact list, and renders the filtered results.
 */
function filterContacts() {
  const input = document.getElementById("inputAssignedTo").value.toLowerCase(); 
  const filteredContacts = filteredContactsForTasks.filter((contact) => {
    if (contact && typeof contact.name === "string") {
      return contact.name.toLowerCase().includes(input); 
    }
    return false;
  });
  let contactsTemplate = createContactsTemplate(filteredContacts); 
  const contactListElement = document.getElementById("insertContactList");
  contactListElement.innerHTML = ''; 
  contactListElement.appendChild(contactsTemplate); 
}

/**
 * Closes the contact list by hiding the element and updating the dropdown arrow icon.
 */
function closeContactList() {
  let contactList = document.getElementById("insertContactList");
  contactList.classList.add("d-none"); 
  document.getElementById("arrowDropdown").src = "/assets/icons/arrowDropdown.svg";
}

/**
 * Toggles the contact list open or closed by calling the appropriate function
 * and updating the state variable `isListOpen`.
 */
function toggleContactList() {
  if (isListOpen) {
    toggleContactListClose();
  } else {
    toggleContactListOpen();
  }
  isListOpen = !isListOpen;
}

/**
 * Closes the contact list and resets related event listeners and UI elements.
 */
function toggleContactListClose() {
  let inputElem = document.getElementById('inputAssignedTo');
  if (currentTaskForEdit) {
    document.getElementById('dialogBox').removeEventListener('click', clickOutsideAssignedToHandler);
  } else {
    window.removeEventListener('click', clickOutsideAssignedToHandler);
  }
  inputElem.addEventListener('focusin', toggleContactList);
  document.getElementById("insertContactList").classList.add("d-none");
  document.getElementById("arrowDropdown").src = "assets/icons/arrowDropdown.svg";
}

/**
 * Opens the contact list, sets up event listeners, and updates UI elements.
 */
function toggleContactListOpen() {
  let inputElem = document.getElementById('inputAssignedTo');
  inputElem.removeEventListener('focusin', toggleContactList);
  let assignedToContacts = 'nobody';
  if (currentTaskForEdit) {
    if (currentTaskForEdit != -1) assignedToContacts = getAssignedTo(currentTaskForEdit);
    document.getElementById('dialogBox').addEventListener('click', clickOutsideAssignedToHandler);
  } else {
    window.addEventListener('click', clickOutsideAssignedToHandler);
  }
  checkContacts();
  document.getElementById("insertContactList").classList.remove("d-none");
  document.getElementById("arrowDropdown").src = "assets/icons/arrowUpDropdown.svg";
}
/**
 * Renders the added persons by selecting all checkboxes and calling `showPersons`.
 */
function renderAddedPersons() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]'); 
  showPersons(); 
}
