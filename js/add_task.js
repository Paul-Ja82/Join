const priorityClasses = ["low", "medium", "urgent"];
let subtasks = [];
let selectedPrio = "";
let selectedContacts = [];
let isListOpen = false;
let hasEventListener = false;
let contactsChecked = false;

/**
 * Initializes the "Add Tasks" functionality by rendering the task form, hiding the contact list, and setting default priority.
 * Steps performed:
 * 1. Replaces the content of the `contentAddTaskContainer` element with the add-task form using `returnAddTaskForm`.
 * 2. Hides the contact list by adding the `d-none` class to the `insertContactList` element.
 * 3. Sets the default priority of the task to "medium" using `selectPrio`.
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
 * Renders the contact list in the DOM, displaying filtered contacts and updating the UI elements accordingly.
 * Steps performed:
 * 1. Displays the contact list by removing the `d-none` class and clearing its current content.
 * 2. Changes the dropdown arrow icon to an "up" state.
 * 3. If `filteredContacts` is empty, displays a message indicating the list is empty.
 * 4. Calls `returnRenderdContacts` to iterate through `filteredContacts` and:
 *    - Adds each contact as a list item with a checkbox.
 *    - Indicates whether the contact is already selected using `selectedContacts`.
 *    - Displays a profile picture for each contact using `showProfilPicture`.
 *    - Updates the checkbox icon to a "checked" state for selected contacts.
 * 5. Calls `showPersons` and `colorSelectedContacts` to finalize the UI updates for the contact list.
 * @param {Array} [filteredContacts=contacts] - The array of contacts to render. Defaults to the full `contacts` array.
 * @example
 * showContactList(filteredContacts);
 */
function showContactList(filteredContacts = contacts) {
  const contactList = document.getElementById("insertContactList");
  contactList.classList.remove("d-none");                                  
  contactList.innerHTML = "";
  document.getElementById("arrowDropdown").src ="./assets/icons/arrowUpDropdown.svg";
  if (filteredContacts.length === 0) {
    contactList.innerHTML ="<li class='emptyListMessage'>Ganz schön leer hier! :(</li>";
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
 * Validates the date input field to ensure a value is selected and applies appropriate styles.
 * Steps performed:
 * 1. Retrieves the date input element by its ID (`date`).
 * 2. Checks if the input field is empty:
 *    - If empty, adds the `dateInput` class to indicate an invalid state.
 *    - If not empty, removes the `dateInput` class.
 * 3. Adds the `filled` class if a date is selected to change the text color to black.
 * 4. Removes the `filled` class if the field is empty, reverting the text color to gray.
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
 * Saves a new subtask by retrieving the input value, resetting the input field, and updating the UI.
 * Steps performed:
 * 1. Retrieves the value from the subtask input field (`subtasks`) and logs it to the console.
 * 2. Passes the subtask text to `pushTextSubtask` to add it to the subtask collection.
 * 3. Clears the input field by setting its value to an empty string.
 * 4. Resets the subtask symbols area to display a default "+" icon.
 * 5. Calls `renderSubtasks` to update the UI with the new list of subtasks.
 */
function saveSubtasks() {
  let textSubtask = document.getElementById("subtasks").value;
  pushTextSubtask(textSubtask);
  document.getElementById("subtasks").value = "";
  document.getElementById("symbolsSubtasks").innerHTML = `<img src="assets/icons/plus.svg" alt="" />`;
  renderSubtasks();
}

/**
 * Adds a new subtask to the `subtasks` array.
 * Steps performed:
 * 1. Creates a new subtask object with the provided `textSubtask` as the title and `checked` set to `false`.
 * 2. Pushes the new subtask object into the global `subtasks` array.
 * 3. Logs the newly created subtask and the updated `subtasks` array to the console.
 * @param {string} textSubtask - The title of the subtask to be added.
 */
function pushTextSubtask(textSubtask) {
  const newSubtask = {
    title: textSubtask,
    checked: false,
  };
  subtasks.push(newSubtask);
}

/**
 * Updates the title of an existing subtask in the `subtasks` array and re-renders the subtasks.
 * Steps performed:
 * 1. Retrieves the updated subtask title from the input field corresponding to the provided index.
 * 2. Updates the `title` property of the subtask at the given index in the `subtasks` array.
 * 3. Calls `renderSubtasks` to reflect the changes in the UI.
 * @param {number} index - The index of the subtask to be updated in the `subtasks` array.
 */
function saveEditSubtask(index) {
  let changedSubtask = document.getElementById(`inputField${index}`).value;
  subtasks[index].title = changedSubtask;
  renderSubtasks();
}

/**
 * Handles the "Enter" key press event for the input field.
 * When the "Enter" key is pressed, it prevents the default action
 * (e.g., form submission) and triggers a click event on the element
 * with the ID "subtaskSaver" if it exists.
 * @param {KeyboardEvent} event - The keyboard event triggered when a key is pressed.
 */
function handleEnterKey(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    let subtaskSaver = document.getElementById("subtaskSaver");
    if (subtaskSaver) {
      subtaskSaver.click();
    }
  }
}

/**
 * Clears the subtask input field and resets the subtask symbol to its default "+" icon.
 * Steps performed:
 * 1. Sets the value of the subtask input field (`subtasks`) to an empty string.
 * 2. Updates the `symbolsSubtasks` element to display a "+" icon.
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
 * Sets the focus on the specified input field and moves the cursor to the end of its content.
 * Steps performed:
 * 1. Calls the `focus` method on the input field to bring it into focus.
 * 2. Calculates the length of the input field's current value.
 * 3. Sets the cursor position to the end of the text using `setSelectionRange`.
 * @param {HTMLElement} inputField - The input field to focus and adjust the cursor position.
 */
function focusAtEnd(inputField) {
  inputField.focus();
  let textLength = inputField.value.length;
  inputField.setSelectionRange(textLength, textLength);
}

/**
 * Deletes a subtask from the `subtasks` array at the specified index and re-renders the subtask list.
 * Steps performed:
 * 1. Removes the subtask at the given index from the `subtasks` array using `splice`.
 * 2. Calls `renderSubtasks` to update the displayed list of subtasks.
 * @param {number} index - The index of the subtask to be deleted.
 */
function deleteSubtask(index) {
  subtasks.splice(index, 1);
  renderSubtasks();
}

/**
 * Updates the input field with a selected category value and closes the dropdown menu.
 * Steps performed:
 * 1. Sets the value of the `showSelectedCategory` input field to the provided `value`.
 * 2. Calls `closeDropdown` to close the dropdown menu and reset its UI.
 * @param {string} value - The selected category value to set in the input field.
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