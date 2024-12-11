const priorityClasses = ["low", "medium", "urgent"];
let subtasks = [];
let selectedPrio = "";
let selectedContacts = [];
let isListOpen = false;
let hasEventListener = false;
let contactsChecked = false;

/**
 * Initializes the Add Tasks functionality by rendering the form, hiding the contact list, and setting default priority.
 */
async function initAddTasks() {
  document.getElementById("contentAddTaskContainer").innerHTML = returnAddTaskForm("todo");
  const contactList = document.getElementById("insertContactList");
  contactList.classList.add("d-none");
  selectPrio("medium");
  document.getElementById('inputAssignedTo').addEventListener('focusin', toggleContactList);
}


/**
 * Fetches data from the specified path on the server and logs the response in JSON format.
 * @param {string} [path=""] - The path appended to the base URL for fetching the data.
 */
async function loadData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  console.log(responseToJson);
}

/**
 * Sends data to the specified path on the server using a POST request and logs the server's JSON response.
 * @param {string} [path=""] - The path appended to the base URL where the data is to be sent.
 * @param {Object} [data={}] - The data to be sent in the request body.
 */
async function postData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  let responseToJson = await response.json();
}

/**
 * Displays the contact list, updates the dropdown icon, and handles rendering or showing appropriate messages.
 * @param {Array} filteredContacts - List of filtered contacts to display (defaults to all contacts).
 */
function showContactList(filteredContacts = contacts) {
  const contactList = document.getElementById("insertContactList");
  contactList.classList.remove("d-none");
  contactList.innerHTML = "";
  document.getElementById("arrowDropdown").src = "./assets/icons/arrowUpDropdown.svg";
  if (filteredContacts.length === 0) {
    contactList.innerHTML = "<li class='emptyListMessage'>Ganz schön leer hier! :(</li>";
    return;
  }
  returnRenderdContacts();
  showPersons();
  colorSelectedContacts();
}


/**
 * Retrieves the assigned contacts for a specific task by its ID.
 * @param {number|string} single_ID - The ID of the task.
 * @returns {Array} The list of assigned contacts.
 */
function getAssignedTo(single_ID) {
  let allTasksArray = [];
  for (let keyI in allTasks) {
    allTasksArray.push(allTasks[keyI]);
  }
  let task = allTasksArray.find((taskI) => taskI.single_ID == single_ID);
  return task.assigned_to;
}

/**
 * Retrieves the contact ID based on the contact's name.
 * @param {string} name - The name of the contact.
 * @returns {number|undefined} The ID of the contact or undefined if not found.
 */
async function getContactId(name) {
  await loadContacts();
  let contact = contacts.find(contactI => contactI.name == name);
  if (contact) return contact.id;
  else return undefined;
}

/**
 * Simulates click events for the items in the names array.
 * @param {Array} namesArray - Array of contact names.
 */
async function clickItems(namesArray) {
  let contactId;
  let elemId;
  let clickEvent = new Event('click');
  if (namesArray != 'nobody') {
    for (let nameI of namesArray) {
      contactId = await getContactId(nameI);
      if (contactId) {
        elemId = 'listPerson' + contactId;
        document.getElementById(elemId).dispatchEvent(clickEvent);
      }
    }
  }
}

/**
 * Marks items in the names array by updating their UI elements.
 * @param {Array} namesArray - Array of contact names.
 */
async function markItems(namesArray) {
  let contactId;
  if (namesArray != 'nobody') {
    for (let nameI of namesArray) {
      contactId = await getContactId(nameI);
      markItem(contactId);
    }
  }
}

/**
 * Selects items in the names array by updating their selection state.
 * @param {Array} namesArray - Array of contact names.
 */
async function selectItems(namesArray) {
  let contactId;
  if (namesArray != 'nobody') {
    for (let nameI of namesArray) {
      contactId = await getContactId(nameI);
      selectItem(contactId);
    }
  }
}

/**
 * Marks a specific item by its contact ID, updating its appearance.
 * @param {number|string} contactId - The ID of the contact to mark.
 */
function markItem(contactId) {
  let listItemElem = document.getElementById('listPerson' + contactId);
  let checkboxImgElem = document.getElementById('checkboxId' + contactId);
  if (listItemElem) {
    listItemElem.classList.add('backgroundContact');
    checkboxImgElem.src = './assets/icons/checkboxChecked.svg';
  }
}

/**
 * Demarks a specific item by its contact ID, resetting its appearance.
 * @param {number|string} contactId - The ID of the contact to demark.
 */
function demarkItem(contactId) {
  let listItemElem = document.getElementById('listPerson' + contactId);
  let checkboxImgElem = document.getElementById('checkboxId' + contactId);
  if (listItemElem) {
    listItemElem.classList.remove('backgroundContact');
    checkboxImgElem.src = './assets/icons/checkbox.svg';
  }
}

/**
 * Selects a specific item by its contact ID, marking it as checked.
 * @param {number|string} contactId - The ID of the contact to select.
 */
function selectItem(contactId) {
  let checkboxElem = document.getElementById('checkbox' + contactId);
  checkboxElem.checked = true;
}

/**
 * Deselects a specific item by its contact ID, marking it as unchecked.
 * @param {number|string} contactId - The ID of the contact to deselect.
 */
function deselectItem(contactId) {
  let checkboxElem = document.getElementById('checkbox' + contactId);
  checkboxElem.checked = false;
}

/**
 * Handles clicks outside the assigned-to input or dropdown menu and toggles the contact list.
 * @param {Event} event - The click event.
 */
function clickOutsideAssignedToHandler(event) {
  let inputElem = document.getElementById('inputAssignedTo');
  let ddMenuElem = document.getElementById('insertContactList');
  let outsideInputElem = !inputElem.contains(event.target);
  let outsideDdMenuElem = !ddMenuElem.contains(event.target);
  if (outsideInputElem && outsideDdMenuElem) {
    toggleContactList();
  }
}

/**
 * Checks the date input field and updates its classes based on whether it is filled or empty.
 */
function checkDateInput() {
  let valueDate = document.getElementById("date");
  if (valueDate.value === "") { valueDate.classList.add("dateInput"); }
  else { valueDate.classList.remove("dateInput"); }
  const dateInput = document.getElementById("date");
  if (dateInput.value) { dateInput.classList.add("filled"); }
  else { dateInput.classList.remove("filled"); }
}


/**
 * Displays avatars for selected contacts, limiting to a maximum of 5.
 * Clears the avatar container and creates SVG avatars for each contact.
 * If more than 5 contacts are selected, it appends a visual indicator.
 */
function showPersons() {
  if (selectedContacts != 'nobody') {
    const avatarContainer = document.getElementById("showPersons");
    avatarContainer.innerHTML = "";
    if (selectedContacts.length > 5) {
      const contactsToShow = selectedContacts.slice(0, 5);
      contactsToShow.forEach((contact, index) => { createAndAppendSVG(avatarContainer, contact, index) });
      avatarContainer.appendChild(checkAssignedToContactsLength());
    } else if (selectedContacts.length <= 5) {
      selectedContacts.forEach((contact, index) => { createAndAppendSVG(avatarContainer, contact, index) });
    }
  }
}

/**
 * Creates a div element indicating the number of additional selected contacts beyond the first five.
 * The element displays the count in the format "+X" where X is the number of extra contacts.
 * @returns {HTMLDivElement} - A div element displaying the number of extra contacts.
 */
function checkAssignedToContactsLength() {
  let moreContactsChecked = document.createElement("div");
  moreContactsChecked.id = "moreContactsChecked";
  moreContactsChecked.classList.add("moreContactschecked")
  let moreContactsCount = Number(selectedContacts.length - 5);
  moreContactsChecked.innerHTML = `+${moreContactsCount}`;
  return moreContactsChecked
}

/**
* Saves the subtask, clears the input field, updates the icon, and renders the subtasks.
*/
function saveSubtasks() {
 let textSubtask = document.getElementById("subtasks").value;
 pushTextSubtask(textSubtask);
 document.getElementById("subtasks").value = "";
 document.getElementById("symbolsSubtasks").innerHTML = `<img src="assets/icons/plus.svg" alt="" />`;
 renderSubtasks();
}


/**
 * Adds a new subtask to the `subtasks` array with the provided title.
 * @param {string} textSubtask - The title of the subtask to add.
 */
function pushTextSubtask(textSubtask) {
  const newSubtask = { title: textSubtask, checked: false };
  subtasks.push(newSubtask);
}

/**
 * Updates the title of a subtask in the `subtasks` array by index.
 * @param {number} index - The index of the subtask to update.
 */
function saveEditSubtask(index) {
  let changedSubtask = document.getElementById(`inputField${index}`).value;
  subtasks[index].title = changedSubtask;
  renderSubtasks();
}

/**
 * Handles the "Enter" key press for the subtask input field.
 * @param {KeyboardEvent} event - The keyboard event triggered.
 */
function handleEnterKey(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    let subtaskSaver = document.getElementById("subtaskSaver");
    if (subtaskSaver) subtaskSaver.click();
  }
}

/**
 * Clears the subtask input field and resets the symbol to a "+" icon.
 */
function clearInput() {
  document.getElementById("subtasks").value = "";
  document.getElementById("symbolsSubtasks").innerHTML = `<img src="assets/icons/plus.svg" alt="">`;
}

/**
 * Changes the text of a subtask, renders its editing interface, and sets focus.
 * @param {number} index - The index of the subtask to edit.
 */
function changeText(index) {
  let changeText = subtasks[index].title;
  renderSubtasks();
  document.getElementById(`subtask${index}`).innerHTML = getSubtaskEditHTML(changeText, index);
  document.getElementById(`subtask${index}`).classList.add("changeTextSubtasks");
  document.getElementById(`inputField${index}`).classList.add("fullWidth");
  document.getElementById(`inputField${index}`).value = changeText;
  focusAtEnd(document.getElementById(`inputField${index}`));
}

/**
 * Focuses the input field and sets the cursor to the end of its content.
 * @param {HTMLElement} inputField - The input field to focus.
 */
function focusAtEnd(inputField) {
  inputField.focus();
  let textLength = inputField.value.length;
  inputField.setSelectionRange(textLength, textLength);
}

/**
 * Deletes a subtask from the `subtasks` array by index and re-renders the list.
 * @param {number} index - The index of the subtask to delete.
 */
function deleteSubtask(index) {
  subtasks.splice(index, 1);
  renderSubtasks();
}

/**
 * Updates the input field with a selected category and closes the dropdown.
 * @param {string} value - The selected category value.
 */
function putInput(value) {
  document.getElementById("showSelectedCategory").value = value;
  closeDropdown();
}


/**
 * Renders the subtasks into the subtask list.
 */
function renderSubtasks() {
  document.getElementById("showSubtasks").innerHTML = "";
  for (let index = 0; index < subtasks.length; index++) {
    document.getElementById("showSubtasks").innerHTML += getSubtaskHTML(subtasks[index].title, index); 
  }
}