/**
 * Highlights selected contacts by adding a background class to their parent elements.
 */
function colorSelectedContacts() {
  const selectedPersons = document.querySelectorAll(".contactListCheckbox");
  selectedPersons.forEach((person) => {
    person.parentNode.classList.remove("backgroundContact");
    if (person.checked) person.parentNode.classList.add("backgroundContact");
  });
}

/**
 * Toggles the selection state of a contact and updates the UI accordingly.
 * @param {number} contactId - The ID of the contact to toggle.
 */
function contactClickHandler(contactId) {
  if (selectedContacts == 'nobody') selectedContacts = [];
  let checkbox = document.getElementById(`checkbox${contactId}`);
  let contactName = checkbox.value;
  let selectedContactsIndex;
  if (selectedContacts.includes(contactName)) {
    selectedContactsIndex = selectedContacts.indexOf(contactName);
    deselectItem(contactId);
    demarkItem(contactId);
    selectedContacts.splice(selectedContactsIndex, 1);
  } else {
    selectItem(contactId);
    markItem(contactId);
    selectedContacts.push(contactName);
  }
  showPersons();
}

/**
 * Sets the minimum selectable date in a date input field to today's date.
 */
function prepareCalender() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  const dateInput = document.getElementById("date");
  if (dateInput) dateInput.min = formattedDate;
}


/**
 * Creates and appends an SVG avatar with initials and a background color to a container.
 * @param {HTMLElement} avatarContainer - The container to append the SVG to.
 * @param {Object} contact - The contact object used to generate initials.
 * @param {number} index - The contact index used for determining background color.
 */
function createAndAppendSVG(avatarContainer, contact, index) {
  const initials = getInitials(contact);
  const bgColor = showTheColorOfContact(contact);
  const svgAvatar = createAvatarSVG(initials, bgColor);
  avatarContainer.appendChild(svgAvatar);
}

/**
 * Determines the background color of a contact based on their details.
 * @param {Object} contact - The contact object.
 * @returns {string} The background color for the contact.
 */
function showTheColorOfContact(contact) {
  let bgColor = "";
  for (let key in allContactsForTasks) {
    if (allContactsForTasks[key].name === contact) {
      bgColor = allContactsForTasks[key].color;
      break;
    }
  }
  return bgColor;
}

/**
 * Extracts and returns the initials from a given name.
 * @param {string} name - The name to extract initials from.
 * @returns {string} The uppercase initials of the name.
 */
function getInitials(name) {
  const nameParts = name.split(" ");
  if (nameParts.length == 1) {
    return nameParts[0][0].toUpperCase();
  } else if (nameParts.length >= 2) {
    return nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase();
  }
}


/**
 * Creates an SVG element with predefined attributes for an avatar.
 * @function
 * @param {string} svgNS - The SVG namespace.
 * @returns {SVGElement} The configured SVG element.
 */
function createBaseSVG(svgNS) {
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "42");
  svg.setAttribute("height", "42");
  svg.setAttribute("viewBox", "0 0 44 44");
  svg.setAttribute("class", "contact-avatar-svg");
  return svg;
}

/**
 * Creates a circle element for the avatar SVG with predefined attributes.
 * @function
 * @param {string} svgNS - The SVG namespace.
 * @param {string} bgColor - The background color of the circle.
 * @returns {SVGCircleElement} The configured circle element.
 */
function createAvatarCircle(svgNS, bgColor) {
  const circle = document.createElementNS(svgNS, "circle");
  circle.setAttribute("cx", "22");
  circle.setAttribute("cy", "22");
  circle.setAttribute("r", "20");
  circle.setAttribute("fill", bgColor);
  circle.setAttribute("stroke", "#fff");
  circle.setAttribute("stroke-width", "2");
  return circle;
}

/**
 * Creates a text element for the avatar SVG with predefined attributes.
 * @function
 * @param {string} svgNS - The SVG namespace.
 * @param {string} initials - The initials to display in the avatar.
 * @returns {SVGTextElement} The configured text element.
 */
function createAvatarText(svgNS, initials) {
  const text = document.createElementNS(svgNS, "text");
  text.setAttribute("x", "50%");
  text.setAttribute("y", "50%");
  text.setAttribute("dy", ".35em");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("font-size", "12");
  text.setAttribute("fill", "#fff");
  text.setAttribute("font-family", "Arial, sans-serif");
  text.textContent = initials;
  return text;
}

/**
 * Creates an avatar SVG with a background color and initials.
 * @function
 * @param {string} initials - The initials to display in the avatar.
 * @param {string} bgColor - The background color of the avatar.
 * @returns {SVGElement} The completed SVG avatar element.
 */
function createAvatarSVG(initials, bgColor) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = createBaseSVG(svgNS);
  const circle = createAvatarCircle(svgNS, bgColor);
  const text = createAvatarText(svgNS, initials);
  svg.appendChild(circle);
  svg.appendChild(text);
  return svg;
}

/**
 * Sets the selected priority for a task and updates the UI.
 * @param {string} priority - The selected priority ("low", "medium", or "urgent").
 */
function selectPrio(priority) {
  selectedPrio = priority;
  priorityClasses.forEach((prio) => {
    document.getElementById(`${prio}Button`).classList.remove(`${prio}Button`);
    document.getElementById(`${prio}ButtonImg`).src = `assets/icons/${prio}.svg`;
  });
  if (priority === "low") {lowPrio(priority);} 
  else if (priority === "medium") {mediumPrio(priority);} 
  else if (priority === "urgent") {urgentPrio(priority);}
}

/**
 * Applies styles and icon for "low" priority.
 * @param {string} priority - The priority level ("low").
 */
function lowPrio(priority) {
  let button = `${priority}Button`;
  document.getElementById(button).classList.add(`${priority}Button`);
  document.getElementById(`${button}Img`).src = "assets/icons/lowWhite.svg";
}
  
/**
 * Applies styles and icon for "medium" priority.
 * @param {string} priority - The priority level ("medium").
 */
function mediumPrio(priority) {
  let button = `${priority}Button`;
  document.getElementById(button).classList.add(`${priority}Button`);
  document.getElementById(`${button}Img`).src = "assets/icons/mediumWhite.svg";
}  

/**
 * Applies styles and icon for "urgent" priority.
 * @param {string} priority - The priority level ("urgent").
 */
function urgentPrio(priority) {
  let button = `${priority}Button`;
  document.getElementById(button).classList.add(`${priority}Button`);
  document.getElementById(`${button}Img`).src = "assets/icons/upWhite.svg";
}

/**
 * Displays the category selection dropdown and updates its UI.
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
 * Closes the category dropdown and resets its UI.
 */
function closeDropdown() {
  document.getElementById("showSelectedCategory").onclick = showMeCategorys;
  document.getElementById("categoryDropdown").onclick = showMeCategorys;
  document.getElementById("showCategorys").classList.add("d-none");
  document.getElementById("categoryDropdown").src = "assets/icons/arrowDropdown.svg";
}

/**
 * Closes the dropdown if a click occurs outside its elements.
 * @param {Event} event - The click event.
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
 * Updates the subtask input field icons dynamically based on user input.
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
 * Displays a confirmation message for a successfully sent task and redirects to the board page.
 * @function
 */
function confirmationOfSendedTask() {
  document.getElementById("insertAddedToTaskConfirmation").innerHTML = getTaskConfirmationHTML(); 
  setTimeout(() => {
    window.open("board.html", "_self");
  }, 2000);
}
