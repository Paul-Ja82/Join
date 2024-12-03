const priorityClasses = ["low", "medium", "urgent"];
let subtasks = [];
let selectedPrio = "";
let selectedContacts = [];
let isListOpen = false;
let hasEventListener = false;
let contactsChecked = false;


/**
 * Initializes the "Add Tasks" functionality by rendering the task form, hiding the contact list, and setting default priority.
 *
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
}


/**
 * Fetches data from the specified path on the server and logs the response in JSON format.
 *
 * @param {string} [path=""] - The path appended to the base URL for fetching the data.
 */
async function loadData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  // console.log(responseToJson);
}


/**
 * Sends data to the specified path on the server using a POST request and logs the server's JSON response.
 *
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
 * Filters the contact list based on user input and logs the resulting filtered template.
 *
 * Steps performed:
 * 1. Retrieves the value entered in the `inputAssignedTo` input field and converts it to lowercase.
 * 2. Filters the `filteredContactsForTasks` array to include only contacts that match the input value (case-insensitive).
 * 3. Generates the filtered contacts template using `createContactsTemplate`.
 * 4. Logs the resulting contacts template to the console.
 *
 * Note: The `renderContactList` function can be used to update the UI with the filtered contacts but is currently commented out.
 */
function filterContacts() {
  const input = document.getElementById("inputAssignedTo").value.toLowerCase();
  
  const filteredContacts = filteredContactsForTasks.filter((contact) => {
    if (contact && typeof contact.name === "string") {return contact.name.toLowerCase().includes(input);}
    return false;});
  let contactsTemplate = createContactsTemplate(filteredContacts);
  const contactListElement = document.getElementById("insertContactList");
  contactListElement.innerHTML = '';  
  contactListElement.appendChild(contactsTemplate);
}


/**
 * Closes the contact list by removing the template, hiding the list, and resetting UI elements.
 *
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
 * 
 * @param {Array} filteredContactsForTasks - An array of filtered contacts to be potentially used for tasks. (Currently unused in the function)
 * 
 * This function checks the state of the contact list (`isListOpen`). If the list is open, it hides the list by adding the `d-none` class.
 * If the list is closed, it performs a contact check by calling `checkContacts(allContactsForTasks)` and displays the list by removing the `d-none` class.
 * The `isListOpen` flag is toggled after each operation to track the visibility state of the contact list.
 * 
 * @global {boolean} isListOpen - A global variable used to track whether the contact list is currently open or closed.
 * @global {Array} allContactsForTasks - A global array that contains all available contacts to be checked by `checkContacts`.
 * 
 * @example
 * // Opens or closes the contact list
 * toggleContactList(filteredContactsForTasks);
 */
function toggleContactList(filteredContactsForTasks) {
  selectedContacts= 'nobody'; 
  if (isListOpen) {
    document.getElementById("insertContactList").classList.add("d-none");
    document.getElementById("arrowDropdown").src = "assets/icons/arrowDropdown.svg"; 
  } else {
    let assignedToContacts= getAssignedTo(currentTaskForEdit);
    checkContacts(allContactsForTasks);
    console.log(assignedToContacts); ///DEBUG
    clickAssignedToItems(assignedToContacts);
    document.getElementById("insertContactList").classList.remove("d-none");
    document.getElementById("arrowDropdown").src = "assets/icons/arrowUpDropdown.svg";
  }
  isListOpen = !isListOpen;
}



function getAssignedTo(single_ID) {
  let allTasksArray= [];
  for (let keyI in allTasks) {
    allTasksArray.push(allTasks[keyI]);
  }
  let task= allTasksArray.find((taskI) => taskI.single_ID == single_ID);
  return task.assigned_to;
}

async function getContactId(name) {
  await loadContacts();
  let contact= contacts.find(contactI => contactI.name == name);
  return contact.id;
}

async function clickAssignedToItems(namesArray) {
  let elemId;
  let clickEvent= new Event('click');
  if (namesArray != 'nobody' ) {
    for (let nameI of namesArray) {
      console.log(nameI); ///DEBUG
      elemId= 'listPerson' + await getContactId(nameI);
      document.getElementById(elemId).dispatchEvent(clickEvent);
    }
  }
}




/**
 * Validates the date input field to ensure a value is selected and applies appropriate styles.
 *
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
  if (valueDate.value === "") {valueDate.classList.add("dateInput");} 
  else {valueDate.classList.remove("dateInput");}

  const dateInput = document.getElementById("date");
  if (dateInput.value) {dateInput.classList.add("filled");} 
  else {dateInput.classList.remove("filled");}
}


/**
 * Displays avatars for selected contacts, limiting to a maximum of 5.
 * Clears the avatar container and creates SVG avatars for each contact.
 * If more than 5 contacts are selected, it appends a visual indicator.
 *
 * @function showPersons
 * @returns {void}
 */
function showPersons() {
  const avatarContainer = document.getElementById("showPersons");
  avatarContainer.innerHTML = "";
  if (selectedContacts.length > 5) {
    const contactsToShow = selectedContacts.slice(0, 5);
    contactsToShow.forEach((contact, index) => {createAndAppendSVG(avatarContainer, contact, index)});
    avatarContainer.appendChild(checkAssignedToContactsLength());
  } else if (selectedContacts.length <= 5) {
    selectedContacts.forEach((contact, index) => {createAndAppendSVG(avatarContainer, contact, index)});
  }
}


/**
 * Creates a div element indicating the number of additional selected contacts beyond the first five.
 * The element displays the count in the format "+X" where X is the number of extra contacts.
 *
 * @function checkAssignedToContactsLength
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
 *
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
 *
 * Steps performed:
 * 1. Creates a new subtask object with the provided `textSubtask` as the title and `checked` set to `false`.
 * 2. Pushes the new subtask object into the global `subtasks` array.
 * 3. Logs the newly created subtask and the updated `subtasks` array to the console.
 *
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
 *
 * Steps performed:
 * 1. Retrieves the updated subtask title from the input field corresponding to the provided index.
 * 2. Updates the `title` property of the subtask at the given index in the `subtasks` array.
 * 3. Calls `renderSubtasks` to reflect the changes in the UI.
 *
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
 *
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
 *
 * Steps performed:
 * 1. Sets the value of the subtask input field (`subtasks`) to an empty string.
 * 2. Updates the `symbolsSubtasks` element to display a "+" icon.
 */
function clearInput() {
  document.getElementById("subtasks").value = "";
  document.getElementById("symbolsSubtasks").innerHTML = `<img src="assets/icons/plus.svg" alt="">`;
}


/**
 * Changes the text of a subtask by replacing its content with an input field
 * that allows editing the title of the subtask. The input field is populated
 * with the current subtask title. It also provides options to save or delete 
 * the edited subtask.
 *
 * @param {number} index - The index of the subtask in the `subtasks` array
 *                          that is being edited.
 */
function changeText(index) {
  let changeText = subtasks[index].title;

  renderSubtasks();

  document.getElementById(`subtask${index}`).innerHTML = `<div class="overChangingSubtask"><input id="inputField${index}" class="changingTextInputField" value="${changeText}"><div class="overAllChange editTaskImg"><div class="centerSymbol" onclick="deleteSubtask(${index})" ><img class="editIcons" src="assets/icons/basketIcon.svg"></div><div class="borderEditIcons"></div><div class="centerSymbol" onclick="saveEditSubtask(${index})"><img class="editIcons" src="assets/icons/check.svg"></div></div>`;
  document.getElementById(`subtask${index}`).classList.add("changeTextSubtasks");
  document.getElementById(`inputField${index}`).classList.add("fullWidth");

  document.getElementById(`inputField${index}`).value = changeText;
  focusAtEnd(document.getElementById(`inputField${index}`));
}


/**
 * Sets the focus on the specified input field and moves the cursor to the end of its content.
 *
 * Steps performed:
 * 1. Calls the `focus` method on the input field to bring it into focus.
 * 2. Calculates the length of the input field's current value.
 * 3. Sets the cursor position to the end of the text using `setSelectionRange`.
 *
 * @param {HTMLElement} inputField - The input field to focus and adjust the cursor position.
 */
function focusAtEnd(inputField) {
  inputField.focus();
  let textLength = inputField.value.length;
  inputField.setSelectionRange(textLength, textLength);
}


/**
 * Deletes a subtask from the `subtasks` array at the specified index and re-renders the subtask list.
 *
 * Steps performed:
 * 1. Removes the subtask at the given index from the `subtasks` array using `splice`.
 * 2. Calls `renderSubtasks` to update the displayed list of subtasks.
 *
 * @param {number} index - The index of the subtask to be deleted.
 */
function deleteSubtask(index) {
  subtasks.splice(index, 1);
  renderSubtasks();
}


/**
 * Updates the input field with a selected category value and closes the dropdown menu.
 *
 * Steps performed:
 * 1. Sets the value of the `showSelectedCategory` input field to the provided `value`.
 * 2. Calls `closeDropdown` to close the dropdown menu and reset its UI.
 *
 * @param {string} value - The selected category value to set in the input field.
 */
function putInput(value) {
  document.getElementById("showSelectedCategory").value = value;
  closeDropdown();
}
