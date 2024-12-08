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
    <li id="listPerson${index}" class="backgroundOnHover" onclick="contactClickHandler(${index})">
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
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  showPersons();
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
 * Returns the HTML structure for the task editing form.
 *
 * This function generates and returns an HTML string that defines the structure of the task editing form.
 * The form includes input fields for title, description, due date, priority, category, assigned contacts, and subtasks. 
 * It also includes buttons and functionality to select a priority, toggle the contact list, and add subtasks. 
 * The due date field's minimum value is dynamically set based on the provided `today` parameter.
 *
 * @param {string} today - The current date in "YYYY-MM-DD" format, used to set the minimum value for the due date input.
 * @returns {string} The HTML string that represents the task editing form.
 */
function returnChangingAddTask(today) {
  return `
<div class="overAllFormAddTask overAllChangeAddTask">
  <div class="closeButtonChangeAddTask"><div class="overImgCloser"><img onclick="closeChangeTaskValues()" class="imgCloseChangeAddTask" src="assets/icons/close.svg"></div></div>
<form id="formAddTasks" class="formChangeAddTasks">
      <div class="seperateSendButtonsChangeAddTask"><div class="titleSectionChangeAddTask"><h2 class="titleAddTask">Add Task</h2><div class="iconImage"><img onclick="closeDialog()" src="assets/icons/close.svg"></div></div>
        <div class="overInputFieldsChangeAddTask">
          <div class="fillOutChangeAddTask">
            <div class="overFieldChangeAddTask">
              <label for="title"
                >Title</label
              >
              <input
                type="text"
                id="title"
                class="fieldInput"
                placeholder="Enter a Title"
              />
              <div id="errorTitle" class="errorMessage">
                This field is required.
              </div>
            </div>
            <div class="overFieldChangeAddTask marginTop">
              <label for="description">Description</label>
              <textarea
                type="text"
                name="description"
                id="description"
                class="inputFieldDescriptionChangeAddTask"
                placeholder="Enter a Description"
              ></textarea>
            </div>
            
          </div>
          <div class="lineChangeAddTask"></div>
          <div class="fillOutChangeAddTask">
            <div class="overFieldChangeAddTask">
              <label for="date"
                >Due date</label
              >
              <div class="dateWrapper">
                <input
                  type="date"
                  id="date"
                  min="${today}"
                  class="fieldInput dateInput"
                  onchange="checkDateInput()"
                />
                <div
                  class="dateIcon"
                  onclick="document.getElementById('date').showPicker();"
                >
                  <img
                    src="./assets/icons/calendarIcon.svg"
                    alt="Calendar Icon"
                  />
                </div>
              </div>
              <div id="errorDate" class="errorMessage">
                This field is required.
              </div>
            </div>

            <div class="overFieldChangeAddTask marginTop">
              <label>Prio</label>
              <div class="overPrioButtons">
                <button
                  id="urgentButton"
                  class="prioButtonsChangeAddTask"
                  onclick="selectPrio('urgent')"
                  type="button"
                >
                  Urgent<img
                    id="urgentButtonImg"
                    src="assets/icons/urgent.svg"
                    alt=""
                  />
                </button>
                <button
                  id="mediumButton"
                  class="prioButtonsChangeAddTask"
                  onclick="selectPrio('medium')"
                  type="button"
                >
                  Medium<img
                    id="mediumButtonImg"
                    src="assets/icons/medium.svg"
                    alt=""
                  />
                </button>
                <button
                  id="lowButton"
                  class="prioButtonsChangeAddTask"
                  onclick="selectPrio('low')"
                  type="button"
                >
                  Low<img id="lowButtonImg" src="assets/icons/low.svg" alt="" />
                </button>
              </div>
            </div>
            <div class="overFieldChangeAddTask">
              <label for="showSelectedCategory"
                >Category</label
              >

              <div id="costumSelect" class="costumSelect">
                <input
                  type="text"
                  id="showSelectedCategory"
                  class="fieldInput"
                  disabled
                  placeholder="Select a task category"
                />
              </div>
              <div id="errorCategory" class="errorMessage">
                This field is required.
              </div>
            </div><div class="overFieldChangeAddTask marginTopAssignedToChangeAddTask">
              <label for="inputAssignedTo">Assigned to</label>
              <div id="setBackground" class="overaddAssignedTo">
                <div class="overInputAssignedTo">
                  <input
                    id="inputAssignedTo"
                    class="fieldInput inputAssignedTo"
                    type="text"
                    onclick="toggleContactList()"
                    oninput="checkContacts()"
                    placeholder="Select contacts to assign"
                    autocomplete="off"
                  />
                  <div class="changeSymboles">
                    <img
                      id="arrowDropdown"
                      src="assets/icons/arrowDropdown.svg"
                      alt=""
                      onclick="toggleContactList()"
                    />
                  </div>
                </div>
                <div id="insertContactList" class="listContacts d-none"></div>
              </div>
              <div id="showPersons" class="showPersons"></div>
            </div>
            <div class="overFieldChangeAddTask marginTopChangeAddTask">
              <label for="subtasks">Subtasks</label>
              <div class="overAddSubtasks">
                <input
                  type="text"
                  id="subtasks"
                  class="fieldInput"
                  oninput="changeSymbols()"
                  onkeydown="handleEnterKey(event)"
                  placeholder="Add new subtask"
                />
                <div id="symbolsSubtasks" class="changeSymboles">
                  <img src="assets/icons/plus.svg" alt="" />
                </div>
              </div>
              <ul id="showSubtasks"></ul>
            </div>
          </div>
        </div>
      </div><div class="overConfirmChangeAddTaskButton"><button onclick="collectDataFromChangingAddTask()" type="button" class="confirmChangeAddTask">Ok<img class="imgCheckChangeAddTask" src="assets/icons/checkWhite.svg" alt="" /></button></div>
    </form>
    
    </div>
`;
}

/**
 * Returns the HTML structure for the "Add Task" form with a pre-selected process category.
 *
 * @param {string} selectedProcessCategory - The selected process category for the task (default: "medium" if not provided).
 * @returns {string} The HTML string representing the form for adding a task.
 */
function returnAddTaskForm(selectedProcessCategory, today) {
  /*let selectedProcessCategory = selectCat == null ? "medium" : selectCat;*/
  return `
  <div id="backgroundAssignedToInsert" onclick="toggleContactList()"></div>
  <div id="insertAddedToTaskConfirmation"></div>
  <div class="overAllFormAddTask">
        <div class="overheader">
          <h2 class="titleAddTask">Add Task</h2>
        </div>
        <form id="formAddTasks" class="formAddTasks">
          <div class="seperateSendButtons">
            <div class="overInputFields">
              <div class="fillOut">
                <div class="overField">
                  <label for="title"
                    >Title<span style="color: #ff8190">*</span></label
                  >
                  <input
                    type="text"
                    id="title"
                    class="fieldInput"
                    placeholder="Enter a Title"
                  />
                  <div id="errorTitle" class="errorMessage">
                    This field is required.
                  </div>
                </div>
                <div class="overField marginTop">
                  <label for="description">Description</label>
                  <textarea
                    type="text"
                    name="description"
                    id="description"
                    placeholder="Enter a Description"
                  ></textarea>
                </div>
                <div class="overField">
                  <label for="inputAssignedTo">Assigned to</label>
                  <div id="setBackground" class="overaddAssignedTo">
                    <div class="overInputAssignedTo">
                      <input
                        id="inputAssignedTo"
                        class="fieldInput inputAssignedTo"
                        type="text"
                        onclick="toggleContactList()"
                        oninput="checkContacts()"
                        placeholder="Select contacts to assign"
                        autocomplete="off"
                      />
                      <div class="changeSymboles">
                        <img
                          id="arrowDropdown"
                          src="assets/icons/arrowDropdown.svg"
                          alt=""
                          onclick="toggleContactList()"
                        />
                      </div>
                    </div>
                    <div id="insertContactList" class="listContacts"></div>
                  </div>
                  <div id="showPersons" class="showPersons"></div>
                </div>
              </div>
              <div class="line"></div>
              <div class="fillOut">
                <div class="overField">
                  <label for="date"
                    >Due date<span style="color: #ff8190">*</span></label
                  >
                  <div class="dateWrapper">
                    <input
                      type="date"
                      id="date"
                      min="${today}"
                      class="fieldInput dateInput"
                      onchange="checkDateInput()"
                    />
                    <div
                      class="dateIcon"
                      onclick="document.getElementById('date').showPicker();"
                    >
                      <img
                        src="./assets/icons/calendarIcon.svg"
                        alt="Calendar Icon"
                      />
                    </div>
                  </div>
                  <div id="errorDate" class="errorMessage">
                    This field is required.
                  </div>
                </div>
                <div class="overField marginTop">
                  <label>Prio</label>
                  <div class="overPrioButtons">
                    <button
                      id="urgentButton"
                      class="prioButtons"
                      onclick="selectPrio('urgent')"
                      type="button"
                    >
                      Urgent<img
                        id="urgentButtonImg"
                        src="assets/icons/urgent.svg"
                        alt=""
                      />
                    </button>
                    <button
                      id="mediumButton"
                      class="prioButtons"
                      onclick="selectPrio('medium')"
                      type="button"
                    >
                      Medium<img
                        id="mediumButtonImg"
                        src="assets/icons/medium.svg"
                        alt=""
                      />
                    </button>
                    <button
                      id="lowButton"
                      class="prioButtons"
                      onclick="selectPrio('low')"
                      type="button"
                    >
                      Low<img
                        id="lowButtonImg"
                        src="assets/icons/low.svg"
                        alt=""
                      />
                    </button>
                  </div>
                </div>
                <div class="overField">
                  <label for="showSelectedCategory"
                    >Category<span style="color: #ff8190">*</span></label
                  >
                  <div class="arrowCategory">
                    <img
                      id="categoryDropdown"
                      class="categoryDropdown"
                      src="assets/icons/arrowDropdown.svg"
                      onclick="showMeCategorys()"
                    />
                  </div>
                  <div id="costumSelect" class="costumSelect">
                    <input
                      type="text"
                      id="showSelectedCategory"
                      class="fieldInput"
                      readonly
                      placeholder="Select a task category"
                      onclick="showMeCategorys()"
                    />
                    <div id="showCategorys" class="showCategorys d-none">
                      <div
                        class="categoryItem"
                        onclick="putInput('Technical Task')"
                      >
                        Technical Task
                      </div>
                      <div
                        class="categoryItem"
                        onclick="putInput('User Story')"
                      >
                        User Story
                      </div>
                    </div>
                  </div>
                  <div id="errorCategory" class="errorMessage">
                    This field is required.
                  </div>
                </div>
                <div class="overField marginTop">
                  <label for="subtasks">Subtasks</label>
                  <div class="overAddSubtasks">
                    <input
                      type="text"
                      id="subtasks"
                      class="fieldInput"
                      oninput="changeSymbols()"
                      onkeydown="handleEnterKey(event)"
                      placeholder="Add new subtask"
                    />
                    <div id="symbolsSubtasks" class="changeSymboles">
                      <img src="assets/icons/plus.svg" alt="" />
                    </div>
                  </div>
                  <ul id="showSubtasks"></ul>
                </div>
              </div>
            </div>
            <div class="overFormButtons">
              <div class="requiredInformation">
                <span style="color: #ff8190">*</span>This field is required
              </div>
              <div class="setButtons">
                <div class="overSendButtons">
                  <button
                    class="formButtons clearButton"
                    type="button"
                    onclick="location.reload()"
                  >
                    Clear
                    <div class="iconX"></div>
                  </button>
                  <button
                    class="formButtons createButton"
                    type="button"
                    onclick="submitForm('${selectedProcessCategory}')"
                  >
                    Create Task <img src="assets/icons/checkWhite.svg" alt="" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
  `;
}
