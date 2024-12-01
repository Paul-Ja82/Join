const priorityClasses = ["low", "medium", "urgent"];
let subtasks = [];
let selectedPrio = "";
let selectedContacts = [];
let isListOpen = false;
let hasEventListener = false;

/**
 * Initializes the "Add Tasks" functionality by rendering the task form, hiding the contact list, and setting default priority.
 *
 * Steps performed:
 * 1. Replaces the content of the `contentAddTaskContainer` element with the add-task form using `returnAddTaskForm`.
 * 2. Hides the contact list by adding the `d-none` class to the `insertContactList` element.
 * 3. Sets the default priority of the task to "medium" using `selectPrio`.
 */
async function initAddTasks() {
  document.getElementById("contentAddTaskContainer").innerHTML =
    returnAddTaskForm("todo");
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
  console.log(responseToJson);
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
  console.log(responseToJson);
}

/**
 * Renders the contact list in the DOM, displaying filtered contacts and updating the UI elements accordingly.
 *
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
 *
 * @param {Array} [filteredContacts=contacts] - The array of contacts to render. Defaults to the full `contacts` array.
 * 
 * @example
 * renderContactList(filteredContacts);
 * // Renders the filtered list of contacts in the UI.
 */
function renderContactList(filteredContacts = contacts) {
  const contactList = document.getElementById("insertContactList");
  contactList.classList.remove("d-none");

  contactList.innerHTML = "";
  document.getElementById("arrowDropdown").src =
    "./assets/icons/arrowUpDropdown.svg";

  if (filteredContacts.length === 0) {
    contactList.innerHTML =
      "<li class='emptyListMessage'>Ganz schön leer hier! :(</li>";
    return;
  }

  returnRenderdContacts();
  showPersons();
  colorSelectedContacts();
}

/**
 * Renders a list of contacts into the DOM and updates their visual state.
 * 
 * This function iterates through a list of filtered contacts and dynamically
 * generates HTML to display each contact within a list. It checks whether each
 * contact is selected (i.e., present in the `selectedContacts` array) and
 * updates the corresponding checkbox's state. Additionally, it shows each contact's
 * profile picture by calling the `showProfilPicture` function and ensures that
 * selected checkboxes are visually updated.
 * 
 * @function returnRenderdContacts
 * @global
 * 
 * @param {Array} filteredContacts - An array of contacts to be rendered. Each contact represents a string or object containing the contact information.
 * 
 * @example
 * returnRenderdContacts();
 * // Renders the contact list with checkboxes and profile images.
 */
function returnRenderdContacts () {
  filteredContacts.forEach((contact, index) => {
    const isSelected = selectedContacts.includes(contact);
    contactList.innerHTML += `
    <li id="listPerson${index}" class="backgroundOnHover" onclick="changeCheckbox(${index})">
      <div class="profile">
        <div id="profilPerson${index}" class="profilePerson"></div>    
        <div class="contactPerson">${contact}</div>
      </div>
      <input type="checkbox" value="${contact}" class="contactListCheckbox" 
        id="checkbox${index}" onchange="renderAddedPersons()" 
        onclick="event.stopPropagation()" 
        ${isSelected ? "checked" : ""}>
      <img id="checkboxId${index}" src="assets/icons/checkbox.svg">
    </li>`;
    showProfilPicture(contact, index);
    if (isSelected) {
      document.getElementById(`checkboxId${index}`).src =
        "assets/icons/checkboxChecked.svg";
    }
  });
}

/**
 * Highlights selected contacts in the contact list by adding a specific background class.
 *
 * Steps performed:
 * 1. Selects all checkboxes with the class `contactListCheckbox`.
 * 2. Iterates through each checkbox and removes the `backgroundContact` class from its parent element.
 * 3. If the checkbox is checked, adds the `backgroundContact` class to the parent element.
 * 4. Logs a success message to the console when a contact is successfully highlighted.
 */
function colorSelectedContacts() {
  const selectedPersons = document.querySelectorAll(".contactListCheckbox");

  selectedPersons.forEach((person) => {
    person.parentNode.classList.remove("backgroundContact");
    if (person.checked) {
      person.parentNode.classList.add("backgroundContact");
      console.log("Erfolgreich");
    }
  });
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
    if (typeof contact === "string") {
      return contact.toLowerCase().includes(input);
    }
    return false; 
  });
  
  let contactsTemplate = createContactsTemplate(filteredContacts);
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
  let templateToRemove = document.getElementById("contactListTemplate");
  let contactList = document.getElementById("insertContactList");
  console.log(contactList);
  contactList.removeChild(templateToRemove);
  contactList.classList.add("d-none");
  document.getElementById("arrowDropdown").src =
    "/assets/icons/arrowDropdown.svg";
}

/**
 * Toggles the state of a checkbox in the contact list and updates the associated UI elements.
 *
 * Steps performed:
 * 1. Retrieves the checkbox element for the given index and toggles its `checked` state.
 * 2. Updates the checkbox icon to reflect the new state (checked or unchecked).
 * 3. Calls `renderAddedPersons` to update the list of selected contacts.
 * 4. Calls `colorSelectedContacts` to visually highlight selected contacts in the list.
 *
 * @param {number} index - The index of the checkbox/contact in the contact list.
 */
function changeCheckbox(index) {
  const checkbox = document.getElementById(`checkbox${index}`);
  checkbox.checked = !checkbox.checked;
  document.getElementById(`checkboxId${index}`).src =
    "assets/icons/checkbox.svg";

  if (checkbox.checked) {
    document.getElementById(`checkboxId${index}`).src =
      "assets/icons/checkboxChecked.svg";
  }
  renderAddedPersons();
  colorSelectedContacts();
}

/**
 * Collects all selected contacts from the checkboxes and updates the `selectedContacts` array.
 *
 * Steps performed:
 * 1. Resets the `selectedContacts` array to an empty state.
 * 2. Selects all checkbox elements in the document.
 * 3. Iterates through the checkboxes and adds the `value` of each checked box to the `selectedContacts` array.
 * 4. Logs the list of selected contacts to the console.
 * 5. Calls `showPersons` to update the UI with the selected contacts.
 * 6. Returns the updated `selectedContacts` array.
 */
function renderAddedPersons() {
  selectedContacts = [];
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedContacts.push(checkbox.value);
    }
  });
  console.log("Ausgewählte Kontakte:", selectedContacts);
  showPersons();
  return selectedContacts;
}

/**
 * Toggles the visibility of the contact list, opening or closing it based on its current state.
 *
 * Steps performed:
 * 1. Checks the current state of `isListOpen`:
 *    - If true, calls `closeContactList` to hide the contact list.
 *    - If false, initializes the contact list by calling `checkContacts` with `allContactsForTasks`.
 * 2. Updates the background and visibility of the contact list based on its state.
 * 3. Toggles the value of `isListOpen` to reflect the updated state.
 *
 * @param {Array} filteredContactsForTasks - The list of filtered contacts to display (not used in the current implementation).
 */
function toggleContactList(filteredContactsForTasks) {
  const inputField = document.getElementById("inputAssignedTo");
  console.log(isListOpen);
  if (isListOpen) {
    closeContactList();
  } else {
    checkContacts(allContactsForTasks);

    document.getElementById("insertContactList").classList.remove("d-none");
  }
  isListOpen = !isListOpen;
}

/**
 * Sets the minimum selectable date for a date input field to today's date.
 *
 * This function retrieves the current date, formats it in `YYYY-MM-DD` format,
 * and assigns it as the `min` attribute for an input field with the ID `date`.
 * This ensures that users cannot select a past date in the calendar input.
 *
 * Steps performed:
 * 1. Retrieves the current date using `new Date()`.
 * 2. Extracts the year, month (adjusting for 0-indexed months), and day.
 * 3. Formats the date as `YYYY-MM-DD` using string padding to ensure two-digit months and days.
 * 4. Finds the date input element by its ID (`date`).
 * 5. If the input element exists, sets its `min` attribute to the formatted date, preventing past dates from being selected.
 *
 * @example
 * prepareCalender();
 * // The input field with ID "date" now has today's date as the minimum selectable date.
 */
function prepareCalender() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Monate sind 0-indexiert
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`; // Format: YYYY-MM-DD

  const dateInput = document.getElementById("date");
  if (dateInput) {
    dateInput.min = formattedDate;
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
  if (valueDate.value === "") {
    valueDate.classList.add("dateInput");
  } else {
    valueDate.classList.remove("dateInput");
  }

  const dateInput = document.getElementById("date");
  if (dateInput.value) {
    dateInput.classList.add("filled");
  } else {
    dateInput.classList.remove("filled");
  }
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
      contactsToShow.forEach((contact, index) => {
        createAndAppendSVG(avatarContainer, contact, index)
      });
    avatarContainer.appendChild(checkAssignedToContactsLength());
  } else if (selectedContacts.length <= 5) {
    selectedContacts.forEach((contact, index) => {
      createAndAppendSVG(avatarContainer, contact, index)
    });
  }
}

/**
 * Creates an SVG avatar with the contact's initials and appends it to the specified container.
 * The background color of the avatar is determined based on the contact's index.
 *
 * @function createAndAppendSVG
 * @param {HTMLElement} avatarContainer - The container element to which the SVG will be appended.
 * @param {Object} contact - The contact object containing details used to generate initials.
 * @param {number} index - The index of the contact used to determine the background color.
 * @returns {void}
 */
function createAndAppendSVG(avatarContainer, contact, index) {
  const initials = getInitials(contact);
  const bgColor = showTheColorOfContact(contact);
  const svgAvatar = createAvatarSVG(initials, bgColor);
  avatarContainer.appendChild(svgAvatar);
}

function showTheColorOfContact(contact) {
  let bgColor = "";
  for (let key in allContactsForTasks) {
    console.log(allContactsForTasks[key])
    if (allContactsForTasks[key].name === contact) {
      bgColor = allContactsForTasks[key].color;
      break;
    }
  }
  return bgColor;
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
 * Extracts initials from a given name, considering both single and multi-word names.
 *
 * Steps performed:
 * 1. Splits the name string into an array of words.
 * 2. Logs the split name parts to the console.
 * 3. Handles two cases:
 *    - For single-word names, returns the uppercase first letter of the name.
 *    - For multi-word names, returns the uppercase initials of the first and second words.
 *
 * @param {string} name - The name from which to extract initials.
 * @returns {string} The initials of the name in uppercase.
 */
function getInitials(name) {
  const nameParts = name.split(" ");
  console.log(nameParts);
  if (nameParts.length == 1) {
    const firstNameInitial = nameParts[0][0].toUpperCase();
    return firstNameInitial;
  } else if (nameParts.length >= 2) {
    const firstNameInitial = nameParts[0][0].toUpperCase();
    const lastNameInitial = nameParts[1][0].toUpperCase();
    return firstNameInitial + lastNameInitial;
  }
}

/**
 * Creates an SVG avatar with initials and a circular colored background.
 *
 * Steps performed:
 * 1. Defines the SVG namespace.
 * 2. Creates an SVG element with specified dimensions, viewbox, and a CSS class.
 * 3. Creates a circle element:
 *    - Positions it at the center of the SVG (`cx`, `cy`).
 *    - Sets its radius (`r`), fill color (`bgColor`), and white border (`stroke`).
 * 4. Creates a text element:
 *    - Positions it at the center of the circle (`x`, `y`, `dy`) and aligns it horizontally (`text-anchor`).
 *    - Sets the font size, color, and font family.
 *    - Assigns the initials as the text content.
 * 5. Appends the circle and text elements to the SVG.
 * 6. Returns the complete SVG element.
 *
 * @param {string} initials - The initials to display inside the avatar.
 * @param {string} bgColor - The background color for the avatar circle.
 * @returns {SVGElement} The created SVG avatar element.
 */
function createAvatarSVG(initials, bgColor) {
  const svgNS = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "42");
  svg.setAttribute("height", "42");
  svg.setAttribute("viewBox", "0 0 44 44");
  svg.setAttribute("class", "contact-avatar-svg");

  const circle = document.createElementNS(svgNS, "circle");
  circle.setAttribute("cx", "22");
  circle.setAttribute("cy", "22");
  circle.setAttribute("r", "20");
  circle.setAttribute("fill", bgColor);
  circle.setAttribute("stroke", "#fff");
  circle.setAttribute("stroke-width", "2");

  const text = document.createElementNS(svgNS, "text");
  text.setAttribute("x", "50%");
  text.setAttribute("y", "50%");
  text.setAttribute("dy", ".35em");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("font-size", "12");
  text.setAttribute("fill", "#fff");
  text.setAttribute("font-family", "Arial, sans-serif");
  text.textContent = initials;

  svg.appendChild(circle);
  svg.appendChild(text);
  return svg;
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
  console.log(textSubtask);
  pushTextSubtask(textSubtask);
  document.getElementById("subtasks").value = "";
  document.getElementById(
    "symbolsSubtasks"
  ).innerHTML = `<img src="assets/icons/plus.svg" alt="" />`;
  renderSubtasks();
}

/*
document.addEventListener("DOMContentLoaded", function () {
  let getInputfieldSubtask = document.getElementById("subtasks");

  getInputfieldSubtask.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("subtaskSaver").click();
    }
  });
});*/

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
  console.log(newSubtask);
  console.log(subtasks);
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
 * Dynamically updates the subtask input field icons based on user input.
 *
 * This function checks the value of the subtask input field (`#subtasks`) and updates the content of the `#symbolsSubtasks` element.
 * If the input is empty, a "plus" icon is displayed, allowing the user to add a new subtask.
 * If there is text input, the icons change to a "close" icon (to clear the input) and a "check" icon (to save the subtask).
 *
 * Steps performed:
 * 1. Clears the current content of the `#symbolsSubtasks` container.
 * 2. If the subtask input field contains text, the following icons are shown:
 *    - A "close" icon to clear the input (click triggers the `clearInput()` function).
 *    - A "check" icon to save the input (click triggers the `saveSubtasks()` function).
 * 3. If the subtask input field is empty, only a "plus" icon is displayed.
 *
 * @function changeSymbols
 */
function changeSymbols() {
  let checkInput = document.getElementById("subtasks").value;
  
  document.getElementById("symbolsSubtasks").innerHTML = "";
  document.getElementById("symbolsSubtasks").innerHTML = `<div class="centerSymbol" onclick="clearInput()"><img src="assets/icons/close.svg"></div><div class="borderEditIcons"></div><div id="subtaskSaver" class="centerSymbol" onclick="saveSubtasks()"><img src="assets/icons/check.svg"></div>`;

  if (checkInput.length <= 0) {
    document.getElementById("symbolsSubtasks").innerHTML = `
      <img src="assets/icons/plus.svg" alt="">`;
  }
}

/**
 * Listens for the "Enter" key press in the subtask input field and triggers the save action.
 *
 * This function attaches a `keydown` event listener to the subtask input field (`#subtasks`). When the "Enter" key is pressed, 
 * it prevents the default behavior (which would typically submit a form or add a newline) and programmatically clicks the 
 * "save" button (with the ID `#subtaskSaver`) to trigger the subtask saving action.
 *
 * Steps performed:
 * 1. Listens for the "Enter" key press in the subtask input field.
 * 2. When the "Enter" key is pressed:
 *    - Prevents the default action (e.g., form submission or newline).
 *    - Simulates a click on the `#subtaskSaver` element to save the subtask.
 *
 * @function saveSubtaskOnEnter
 */
function saveSubtaskOnEnter() {
  let getInputfieldSubtask = document.getElementById("subtasks");


  getInputfieldSubtask.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();

      let subtaskSaver = document.getElementById("subtaskSaver");
      if (subtaskSaver) {
        subtaskSaver.click();
      }
    }
  });
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
  document.getElementById(
    "symbolsSubtasks"
  ).innerHTML = `<img src="assets/icons/plus.svg" alt="">`;
}

/**
 * Renders the list of subtasks in the `showSubtasks` element.
 *
 * Steps performed:
 * 1. Clears the content of the `showSubtasks` element.
 * 2. Iterates through the `subtasks` array:
 *    - For each subtask, creates an HTML list item with the following:
 *      - The subtask title.
 *      - An edit button (pencil icon) for changing the subtask.
 *      - A delete button (basket icon) for removing the subtask.
 * 3. Appends each generated list item to the `showSubtasks` element.
 */
function renderSubtasks() {
  document.getElementById("showSubtasks").innerHTML = "";
  for (let index = 0; index < subtasks.length; index++) {
    document.getElementById(
      "showSubtasks"
    ).innerHTML += `<li id="subtask${index}" class="">
      <div class="showEntrySubtask" onclick="changeText(${index})">
        <div class="subtaskText">${subtasks[index].title}</div>
        <div id="edit${index}" class="edit">
          <div class="centerSymbol editTask"><img src="assets/icons/pencil.svg"></div>
          <div class="borderEditIcons"></div>
          <div class="centerSymbol basket" onclick="deleteSubtask(${index})"><img src="assets/icons/basketIcon.svg"></div>
        </div>
      </div>
    </li>`;
  }
}

/**
 * Initiates the process of editing a subtask by displaying an input field for text modification.
 *
 * This function updates the DOM to allow the user to edit the title of an existing subtask. It replaces the subtask's current 
 * display with an input field pre-filled with the subtask's current title, providing options to save or delete the edit.
 *
 * Steps performed:
 * 1. Retrieves the current title of the subtask from the `subtasks` array using the provided index.
 * 2. Renders the list of subtasks again by calling `renderSubtasks()`.
 * 3. Replaces the subtask's display with an editable input field containing the current title of the subtask.
 * 4. Adds "delete" and "save" icons with corresponding actions (delete the subtask or save the changes).
 * 5. Adds styling to highlight that the subtask is being edited and makes the input field full-width.
 * 6. Focuses the cursor at the end of the input field to facilitate text editing.
 *
 * @param {number} index - The index of the subtask to be edited in the `subtasks` array.
 * @function changeText
 */
function changeText(index) {
  let changeText = subtasks[index].title;
  let inputField = document.getElementById(`inputField${index}`);

  renderSubtasks();

  document.getElementById(`subtask${index}`).innerHTML = `<div class="overChangingSubtask"><input id="inputField${index}" class="changingTextInputField" value="${changeText}"><div class="overAllChange editTaskImg"><div class="centerSymbol" onclick="deleteSubtask(${index})" ><img class="editIcons" src="assets/icons/basketIcon.svg"></div><div class="borderEditIcons"></div><div class="centerSymbol" onclick="saveEditSubtask(${index})"><img class="editIcons" src="assets/icons/check.svg"></div></div>`;

  document.getElementById(`subtask${index}`).classList.add("changeTextSubtasks");
  inputField.classList.add("fullWidth");

  inputField.value = changeText;
  focusAtEnd(inputField);
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
 * Selects the priority for a task and updates the UI to reflect the selection.
 *
 * Steps performed:
 * 1. Sets the global `selectedPrio` variable to the chosen priority.
 * 2. Iterates through all priority classes (`priorityClasses`):
 *    - Removes the priority-specific class from the corresponding button.
 *    - Resets the priority button icons to their default state.
 * 3. Calls a function specific to the selected priority (`lowPrio`, `mediumPrio`, `urgentPrio`)
 *    to apply the appropriate styles and behavior for the chosen priority.
 *
 * @param {string} priority - The selected priority ("low", "medium", or "urgent").
 */
function selectPrio(priority) {
  selectedPrio = priority;
  priorityClasses.forEach((prio) => {
    document.getElementById(`${prio}Button`).classList.remove(`${prio}Button`);
    document.getElementById(
      `${prio}ButtonImg`
    ).src = `assets/icons/${prio}.svg`;
  });

  if (priority === "low") {
    lowPrio(priority);
  } else if (priority === "medium") {
    mediumPrio(priority);
  } else if (priority === "urgent") {
    urgentPrio(priority);
  }
}

/**
 * Applies the styles and icon for the "low" priority selection.
 *
 * Steps performed:
 * 1. Constructs the button ID for the "low" priority based on the provided `priority` string.
 * 2. Adds the `lowButton` class to the button element to apply the selected styles.
 * 3. Updates the button's icon to a white "low" priority icon.
 *
 * @param {string} priority - The priority level ("low").
 */
function lowPrio(priority) {
  let button = `${priority}Button`;
  document.getElementById(button).classList.add(`${priority}Button`);
  document.getElementById(`${button}Img`).src = "assets/icons/lowWhite.svg";
}

/**
 * Applies the styles and icon for the "medium" priority selection.
 *
 * Steps performed:
 * 1. Constructs the button ID for the "medium" priority based on the provided `priority` string.
 * 2. Adds the `mediumButton` class to the button element to apply the selected styles.
 * 3. Updates the button's icon to a white "medium" priority icon.
 *
 * @param {string} priority - The priority level ("medium").
 */
function mediumPrio(priority) {
  let button = `${priority}Button`;
  document.getElementById(button).classList.add(`${priority}Button`);
  document.getElementById(`${button}Img`).src = "assets/icons/mediumWhite.svg";
}

/**
 * Applies the styles and icon for the "urgent" priority selection.
 *
 * Steps performed:
 * 1. Constructs the button ID for the "urgent" priority based on the provided `priority` string.
 * 2. Adds the `urgentButton` class to the button element to apply the selected styles.
 * 3. Updates the button's icon to a white "urgent" priority icon.
 *
 * @param {string} priority - The priority level ("urgent").
 */
function urgentPrio(priority) {
  let button = `${priority}Button`;
  document.getElementById(button).classList.add(`${priority}Button`);
  document.getElementById(`${button}Img`).src = "assets/icons/upWhite.svg";
}

/**
 * Closes the category dropdown menu and resets its UI elements.
 *
 * Steps performed:
 * 1. Reassigns the `onclick` event handlers for `showSelectedCategory` and `categoryDropdown` to reopen the dropdown using `showMeCategorys`.
 * 2. Adds the `d-none` class to the `showCategorys` element to hide the dropdown menu.
 * 3. Removes the `whiteBG` class from the `costumSelect` element to revert the background style.
 * 4. Updates the dropdown arrow icon to the "down" state.
 */
function closeDropdown() {
  document.getElementById("showSelectedCategory").onclick = showMeCategorys;
  document.getElementById("categoryDropdown").onclick = showMeCategorys;
  document.getElementById("showCategorys").classList.add("d-none");

  document.getElementById("categoryDropdown").src =
    "assets/icons/arrowDropdown.svg";
}

//Test//
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

/**
 * Displays the category selection dropdown and updates UI elements.
 * 
 * This function:
 * 1. Clears any input using `putInput()`.
 * 2. Sets up the `onclick` event on the category selection element (`showSelectedCategory`) to close the dropdown when clicked.
 * 3. Removes the `d-none` class from the category list (`showCategorys`), making it visible.
 * 4. Changes the dropdown arrow icon to indicate the dropdown is open (`arrowUpDropdown`).
 * 5. Adds an event listener to close the dropdown if a click occurs outside the dropdown.
 * 
 * @function
 */
function showMeCategorys() {
  putInput(``);
  document.getElementById("showSelectedCategory").onclick = closeDropdown;
  document.getElementById("showCategorys").classList.remove("d-none");
  document.getElementById("categoryDropdown").onclick = closeDropdown;
  document.getElementById("categoryDropdown").src = "assets/icons/arrowUpDropdown.svg";

  document.addEventListener("click", closeOnClickOutside);
}

/**
 * Closes the category dropdown if a click occurs outside of the dropdown.
 * 
 * This function:
 * 1. Checks if the click event target is outside of the category dropdown (`showSelectedCategory`), the dropdown list (`showCategorys`), or the dropdown arrow (`categoryDropdown`).
 * 2. If the click is outside, it calls the `closeDropdown()` function to close the dropdown.
 * 3. Removes the event listener for clicks outside the dropdown after closing it.
 * 
 * @param {Event} event - The click event triggered by the user.
 * @function
 */
function closeOnClickOutside(event) {
  const catImage = document.getElementById("categoryDropdown");
  const dropdown = document.getElementById("showSelectedCategory");
  const selectBox = document.getElementById("showCategorys");

  if (
    !dropdown.contains(event.target) &&
    !selectBox.contains(event.target) &&
    !catImage.contains(event.target)
  ) {
    closeDropdown();
    document.removeEventListener("click", closeOnClickOutside); 
  }
}

/**
 * Validates the form fields and submits the form data if all fields are valid.
 * 
 * This function checks if the title, due date, and category fields have valid values. 
 * If any of the fields are invalid, an error message is displayed and the form is not submitted.
 * If all fields are valid, it proceeds to collect the data and send the task information.
 * 
 * @param {string} selectedProcessCategory - The category of the selected process for the task.
 * @returns {Promise<void>} A promise that resolves when the form submission process is completed.
 */
async function submitForm(selectedProcessCategory) {
  let hasError = false;
  const title = document.getElementById("title").value.trim();
  const dueDate = document.getElementById("date").value;
  const category = document.getElementById("showSelectedCategory").value;

  if (title.length === 0) {
    document.getElementById("title").style.border = "1px solid #FF8190";
    document.getElementById("errorTitle").style.display = "block";
    hasError = true;
  } else {
    document.getElementById("title").style.border = "none";
    document.getElementById("errorTitle").style.display = "none";
  }

  if (!dueDate) {
    document.getElementById("date").style.border = "1px solid #FF8190";
    document.getElementById("errorDate").style.display = "block";
    hasError = true;
  } else {
    document.getElementById("date").style.border = "none";
    document.getElementById("errorDate").style.display = "none";
  }

  if (category.length === 0) {
    document.getElementById("showSelectedCategory").style.border =
      "1px solid #FF8190";
    document.getElementById("errorCategory").style.display = "block";
    hasError = true;
  } else {
    document.getElementById("showSelectedCategory").style.border = "none";
    document.getElementById("errorCategory").style.display = "none";
  }

  if (!hasError) {
    await collectDataFromAddTask(selectedProcessCategory, selectedContacts); 
    confirmationOfSendedTask();
  }
}

/**
 * Displays a confirmation message and redirects the user to the board page.
 * 
 * This function displays a confirmation message on the page indicating that the task has been successfully added to the board.
 * After a brief delay of 2 seconds, the user is automatically redirected to the "board.html" page.
 * 
 * @returns {void}
 */
function confirmationOfSendedTask() {
 document.getElementById(
      "insertAddedToTaskConfirmation"
    ).innerHTML = `<div class="backgroundInformationForm"><div id="addConfirmation" class="addedToBoard">
     <div class="taskAddedInformation">Task added to board</div>
     <img src="assets/icons/boardIcon.svg" alt="" />
     </div></div>`;
    setTimeout(() => {
      window.open("board.html", "_self");
    }, 2000);
}

/**
 * Checks if the dropdown list is open and toggles its visibility.
 * 
 * This function checks if the dropdown list is currently open (`isListOpen` is `true`). 
 * If the list is open, it calls the `toggleContactList()` function to close it. 
 * If the list is not open, it does nothing. 
 * It also stops the event from propagating.
 * 
 * @returns {void}
 */
function checkIfOpenDropdown() {
stopPropagation();
  if (isListOpen == true) {
    toggleContactList();
    return;
  }
}