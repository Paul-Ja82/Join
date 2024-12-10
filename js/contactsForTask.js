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
 * Creates a contact list template based on the provided filtered contacts.
 * If the filtered contact list is empty, a message will be displayed. 
 * For each contact, a list item is created with a checkbox and profile information.
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
 * Filters the contact list based on user input and logs the resulting filtered template.
 * Steps performed:
 * 1. Retrieves the value entered in the `inputAssignedTo` input field and converts it to lowercase.
 * 2. Filters the `filteredContactsForTasks` array to include only contacts that match the input value (case-insensitive).
 * 3. Generates the filtered contacts template using `createContactsTemplate`.
 * 4. Logs the resulting contacts template to the console.
 *
 * Note: The `showContactList` function can be used to update the UI with the filtered contacts but is currently commented out.
 */
function filterContacts() {
  const input = document.getElementById("inputAssignedTo").value.toLowerCase();
  const filteredContacts = filteredContactsForTasks.filter((contact) => {
    if (contact && typeof contact.name === "string") { return contact.name.toLowerCase().includes(input); }
    return false;
  });
  let contactsTemplate = createContactsTemplate(filteredContacts);
  const contactListElement = document.getElementById("insertContactList");
  contactListElement.innerHTML = '';
  contactListElement.appendChild(contactsTemplate);
}

/**
 * Closes the contact list by removing the template, hiding the list, and resetting UI elements.
 * Steps performed:
 * 1. Retrieves the template element (`contactListTemplate`) and the contact list container (`insertContactList`).
 * 2. Removes the template from the contact list container.
 * 3. Hides the contact list by adding the `d-none` class.
 * 4. Changes the dropdown arrow icon to the "down" state.
 * 5. Removes the white background applied to the contact section.
 */
function closeContactList() {
  let contactList = document.getElementById("insertContactList");
  contactList.classList.add("d-none");
  document.getElementById("arrowDropdown").src = "/assets/icons/arrowDropdown.svg";
}

/**
 * Toggles the visibility of a contact list and performs a contact check if opening the list.
 * This function checks the state of the contact list (`isListOpen`). If the list is open, it hides the list by adding the `d-none` class.
 * If the list is closed, it performs a contact check by calling `checkContacts(allContactsForTasks)` and displays the list by removing the `d-none` class.
 * The `isListOpen` flag is toggled after each operation to track the visibility state of the contact list.
 * @global {boolean} isListOpen - A global variable used to track whether the contact list is currently open or closed.
 * @global {Array} allContactsForTasks - A global array that contains all available contacts to be checked by `checkContacts`.
 * @example
 * // Opens or closes the contact list
 * toggleContactList(filteredContactsForTasks);
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