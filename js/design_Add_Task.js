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
      if (person.checked) {person.parentNode.classList.add("backgroundContact");
      }
    });
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
    if (checkbox.checked) {
      document.getElementById(`checkboxId${index}`).src = "assets/icons/checkboxChecked.svg";}
    // renderAddedPersons();
    showPersons();
    colorSelectedContacts();
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
    const formattedDate = `${year}-${month}-${day}`; 
  
    const dateInput = document.getElementById("date");
    if (dateInput) {dateInput.min = formattedDate;}
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
      if (allContactsForTasks[key].name === contact) {
        bgColor = allContactsForTasks[key].color;
        break;
      }
    }
    return bgColor;
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
      document.getElementById(`${prio}ButtonImg`).src = `assets/icons/${prio}.svg`;
    });
  
    if (priority === "low") {lowPrio(priority);} 
    else if (priority === "medium") {mediumPrio(priority);} 
    else if (priority === "urgent") {urgentPrio(priority);}
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
  
    document.getElementById("categoryDropdown").src = "assets/icons/arrowDropdown.svg";
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