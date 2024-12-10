/**
 * Returns the HTML string for a contact list item.
 * @param {string} contact - The contact name.
 * @param {number} index - The index of the contact in the list.
 * @param {boolean} isSelected - Whether the contact is selected.          
 * @returns {string} The HTML string for the contact list item. 
 */
function getContactListItemHTML(contact, index, isSelected) {
  return `
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
}

/**
 * Collects all selected contacts from the checkboxes and updates the `selectedContacts` array.
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
 * Returns the HTML string for a subtask item.
 * @function
 * @param {string} title - The title of the subtask.
 * @param {number} index - The index of the subtask.
 * @returns {string} The HTML string for the subtask item.  
 */
function getSubtaskHTML(title, index) {
  return `
    <li id="subtask${index}" class="">
      <div class="showEntrySubtask" onclick="changeText(${index})">
        <div class="subtaskText">${title}</div>
        <div id="edit${index}" class="edit">
          <div class="centerSymbol editTask"><img src="assets/icons/pencil.svg"></div>
          <div class="borderEditIcons"></div>
          <div class="centerSymbol basket" onclick="deleteSubtask(${index})">
            <img src="assets/icons/basketIcon.svg">
          </div>
        </div>
      </div>
    </li>`;
}

/**
 * Renders the subtasks into the subtask list.
 * @function
 */
function renderSubtasks() {
  document.getElementById("showSubtasks").innerHTML = "";
  for (let index = 0; index < subtasks.length; index++) {
    document.getElementById("showSubtasks").innerHTML += getSubtaskHTML(subtasks[index].title, index); 
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
                    placeholder="Select contacts to assign"
                    autocomplete="off"
                    oninput="checkContacts()"
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
 * @param {string} selectedProcessCategory - The selected process category for the task (default: "medium" if not provided).
 * @returns {string} The HTML string representing the form for adding a task.
 */
function returnAddTaskForm(selectedProcessCategory, today) {
  /*let selectedProcessCategory = selectCat == null ? "medium" : selectCat;*/
  return `
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
                        placeholder="Select contacts to assign"
                        autocomplete="off"
                        oninput="checkContacts()"
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

/**
 * Returns the HTML string for editing a subtask.
 * @param {string} changeText - The current text of the subtask.
 * @param {number} index - The index of the subtask.
 * @returns {string} The HTML string for the subtask edit UI.    
 */
function getSubtaskEditHTML(changeText, index) {
  return `
    <div class="overChangingSubtask">
      <input id="inputField${index}" class="changingTextInputField" value="${changeText}">
      <div class="overAllChange editTaskImg">
        <div class="centerSymbol" onclick="deleteSubtask(${index})">
          <img class="editIcons" src="assets/icons/basketIcon.svg">
        </div>
        <div class="borderEditIcons"></div>
        <div class="centerSymbol" onclick="saveEditSubtask(${index})">
          <img class="editIcons" src="assets/icons/check.svg">
        </div>
      </div>
    </div>`;
}

 /**
 * Renders a list item for each contact in the filtered contacts array.
 * Each list item includes the contact's profile, name, initials with a colored background,     
 * and a checkbox to select/deselect the contact. The checkbox state is pre-filled based on 
 * whether the contact is already selected.
 * @returns {string} - A string of HTML that represents the contact list item.
 * @description
 * This function dynamically creates a list item (`<li>`) for each contact in the `filteredContactsForTasks` array.
 * The list item includes:
 *  - A profile section with the contact's initials and name.
 *  - A background color for the initials, taken from the contact's data.
 *  - A checkbox that allows users to select/deselect the contact, with its checked state reflecting if the contact is already selected.
 * The checkbox also has event handlers to prevent event bubbling (`event.stopPropagation()`), and to trigger other functions such as `renderAddedPersons()`.
 * Additionally, an icon for the checkbox is added at the end of the list item.
 * @param {number} listPersonId - The unique ID for each contact in the list.
 * @param {Object[]} filteredContactsForTasks - Array of contact objects filtered based on the task.
 * @param {boolean} isSelected - Indicates whether the contact is already selected.
 * @param {string} initials - The initials of the contact, derived from their name.
 */
 function renderShowContacts(listPersonId, initials, isSelected, i) {
  return `
    <li id="listPerson${listPersonId}" class="backgroundOnHover assignedToItemElem" onclick="contactClickHandler(${listPersonId})">
      <div class="profile">
        <div class="initialsImg" id="initialsImg${listPersonId}" style="background-color: ${filteredContactsForTasks[i].color}">
          ${initials}
        </div>
        <div id="profilPerson${listPersonId}" class="profilePerson"></div>    
        <div class="contactPerson">${filteredContactsForTasks[i].name}</div>
      </div>
      <input type="checkbox" value="${filteredContactsForTasks[i].name}" class="contactListCheckbox" 
        id="checkbox${filteredContactsForTasks[i].id}" onchange="renderAddedPersons()" 
        onclick="event.stopPropagation()" 
        ${isSelected ? "checked" : ""}
      >
      <img id="checkboxId${listPersonId}" src="assets/icons/checkbox.svg">
    </li>
  `;
}

/**
 * Returns the HTML string for the task confirmation message.
 * @returns {string} The HTML string for the confirmation message.         
 */
function getTaskConfirmationHTML() {
  return `
    <div class="backgroundInformationForm">                                           
      <div id="addConfirmation" class="addedToBoard">
        <div class="taskAddedInformation">Task added to board</div>
        <img src="assets/icons/boardIcon.svg" alt="" />
      </div>
    </div>
  `;
}
