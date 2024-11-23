const inputFindTask = document.getElementById("name_of_task_input");
const targetElement = document.getElementById("find_task_ctn");
let flyingElement = document.createElement("div");
let elementIsFlying = false;
let currentDraggedElementID;
let currentDraggedElement;
let clonedElementForMoving;
let dragAndDropSections = [
  "to_do_tasks",
  "in_progress_tasks",
  "await_feedback_tasks",
  "done_tasks",
];

/**
 * Initializes the application by performing setup tasks such as including external resources or initializing components.
 * 
 * Steps performed:
 * 1. Calls `include()` to dynamically load or include necessary components or resources.
 * 2. Additional functions like `getIdAndData` and `loadContacts` can be uncommented for retrieving data or loading contact information as needed.
 * 
 * @param {Object} params - Optional parameters to configure the initialization process.
 */
function init(params) {
  // console.log('init()'); ///DEBUG
  // getIdAndData((pathData = ""));
  include();
  // loadContacts();
}


/**
 * Displays a dialog for adding a task or navigates to a new page depending on the screen width.
 * 
 * Functionality:
 * - If the screen width is less than 400 pixels, it redirects the user to `add_task.html`.
 * - Otherwise, it shows a dialog box for adding a task with a smooth animation and initializes the form.
 * 
 * Steps performed:
 * 1. Check if the window width is less than 400 pixels:
 *    - Redirect to `add_task.html` in the current window (`_self`).
 * 2. If the screen is wider:
 *    - Remove the `d-none` class from the background to make it visible.
 *    - Add the `showIt` class to the dialog box with a slight delay for animation.
 *    - Render the add-task form inside the dialog box using the selected process category.
 *    - Set the priority to "medium" by default using `selectPrio()`.
 *    - Fetch and initialize task-related data asynchronously using `getIdAndDataForAddTask()`.
 *    - Hide the contact list by adding the `d-none` class to the `insertContactList` element.
 * 
 * @param {string} selectedProcessCategory - The category for the process that is pre-selected in the add-task form.
 */

// UMZUG IN OPENCLOSEOVERLAY.JS
async function showDialog(selectedProcessCategory) {
  if (window.innerWidth < 400) {
    window.open("add_task.html", "_self");
  } else {
    document.getElementById("backgroundId").classList.remove("d-none");
    setTimeout(() => {
      document.getElementById("dialogBox").classList.add("showIt");
      document.getElementById("dialogBox").classList.add("testSabrinaAddTaskCtn");
    }, 10);
    let today = new Date().toISOString().split('T')[0];
    document.getElementById("dialogBox").innerHTML = renderFormAddTask(selectedProcessCategory, today);
    selectPrio("medium");
    await getIdAndDataForAddTask((pathData = ""));
    const contactList = document.getElementById("insertContactList");
    contactList.classList.add("d-none");
  }
}
// UMZUG IN OPENCLOSEOVERLAY.JS
/**
 * Displays a task dialog by removing the background's hidden class, adjusting styles, and adding an animation class.
 * The dialog content is cleared and background color reset during this process.
 */
function showTask() {
  document.getElementById("backgroundId").classList.remove("d-none");
  document.getElementById("dialogBox").style.backgroundColor = "unset";
  setTimeout(() => {
    document.getElementById("dialogBox").classList.add("showIt");
  }, 10);

  document.getElementById("dialogBox").innerHTML = "";
}
// UMZUG IN OPENCLOSEOVERLAY.JS
/**
 * Closes the task dialog by removing the animation class, then hides the background and resets dialog styles after a delay.
 * 
 * @param {Event} e - The event object passed from the calling action (not utilized in this function).
 */
function closeTask(e) {
  // e.stopPropagation()

  // if (document.getElementById("insertContactList").classList.contains("d-none")) {
  //   closeContactList()
  //   isListOpen = !isListOpen;
  // } 
  document.getElementById("dialogBox").style.transition = "all 225ms ease-in-out";
  document.getElementById("dialogBox").classList.remove("showIt");
  setTimeout(() => {
    document.getElementById("backgroundId").classList.add("d-none");
    document.getElementById("dialogBox").style.backgroundColor = "white";
  }, 225);
}
// UMZUG IN OPENCLOSEOVERLAY.JS
/**
 * Closes the dialog box by removing the animation class and hides the background after a delay.
 */
function closeDialog() {
  document.getElementById("dialogBox").classList.remove("showIt");
  setTimeout(() => {
    document.getElementById("backgroundId").classList.add("d-none");
  }, 225);
}


/**
 * Prepares specific elements by adding classes and IDs to the flying element, and sets up event listeners for input focus and blur actions.
 * When focused, the target element's border is highlighted; on blur, the border reverts to its original style.
 */
function preparingElements() {
  flyingElement.classList.add("flying_element_ctn");
  flyingElement.id = "flying_element_ctn";
  inputFindTask.addEventListener("focus", () => {
    targetElement.style.border = "1px solid #29ABE2";
  });
  inputFindTask.addEventListener("blur", () => {
    targetElement.style.border = "1px solid #a8a8a8";
  });
}

/**
 * Clones a specified element by its ID, creates a new flying element for moving operations, 
 * and appends it to the board body for further interactions. Updates relevant variables to manage the state.
 * 
 * @param {string} id - The ID of the element to be cloned.
 * @param {Event} e - The event that triggered the cloning (not directly used in the function).
 * @returns {boolean} Returns `true` to indicate that the element is flying.
 */
function cloneElement(id, e) {
  currentDraggedElementID = `single_task_ctn${id}`;
  currentDraggedElement = document.getElementById(currentDraggedElementID);
  clonedElementForMoving = currentDraggedElement.cloneNode(true);
  clonedElementForMoving.id = "clonedElement";
  document.getElementById("board_body").appendChild(flyingElement);
  elementIsFlying = true;
  return elementIsFlying;
}


/**
 * Starts the drag operation by styling and positioning the cloned element, hiding the original task, 
 * and appending the cloned element to the flying container. Configures the drag image to be invisible.
 * 
 * @param {DragEvent} e - The drag event object.
 */
function startDragging(e) {
  let rect = currentDraggedElement.getBoundingClientRect();
  styleClonedElement(rect, event);
  currentDraggedElement.classList.add("hide_original_task");
  flyingElement.appendChild(clonedElementForMoving);
  flyingElement.style.position = "absolute";
  clonedElementForMoving.style.position = "absolute";
  e.dataTransfer.setDragImage(new Image(), 0, 0);
}

/**
 * Styles the cloned element to match the dimensions of the original task element and positions it within the flying container.
 * 
 * @param {DOMRect} rect - The bounding rectangle of the original task element.
 * @param {Event} e - The event object (not directly used in this function).
 */
function styleClonedElement(rect, e) {
  clonedElementForMoving.style.left = `0px`;
  clonedElementForMoving.style.top = `0px`;
  clonedElementForMoving.style.right = `0px`;
  clonedElementForMoving.style.bottom = `0px`;
  clonedElementForMoving.style.height = `${rect.height}px`;
  clonedElementForMoving.style.width = `${rect.width}px`;
}

/**
 * Updates the position of the flying element during the drag operation based on cursor movement.
 * Adjusts for different screen widths to position the element correctly.
 * 
 * @param {DragEvent} e - The drag event object containing cursor position data.
 */
function whileDragging(e) {
  let width = window.innerWidth;
  let xStart;
  if (width >= 1440) {
    xStart = width / 2 - 720;
  } else {
    xStart = 0;
  }
  flyingElement.style.left = e.pageX - xStart + "px";
  flyingElement.style.top = e.pageY + "px";
}

/**
 * Ends the drag operation by removing the cloned element and the flying container from the DOM.
 * Resets the `elementIsFlying` flag to indicate that no element is currently being dragged.
 * 
 * @returns {boolean} Returns `false` to indicate that dragging has ended.
 */
function endDragging() {
  if (elementIsFlying == true) {
    flyingElement.removeChild(clonedElementForMoving);
    clonedElementForMoving.remove();
    document.getElementById("board_body").removeChild(flyingElement);
  }
  return (elementIsFlying = false);
}


/**
 * Checks whether the dragged element is over a valid drop area and handles the drop operation.
 * 
 * Steps performed:
 * 1. Gets the current cursor position (X, Y) from the drag event.
 * 2. Determines the ID of the section where the cursor is located using `checkIdFromSectionToDrop`.
 * 3. Identifies the new section for the task based on the ID using `checkNewSection`.
 * 4. If the new section is not a valid drop area:
 *    - Ends the dragging process.
 *    - Removes any drag shadows.
 *    - Retrieves and refreshes task data using `getIdAndData`.
 * 5. If the new section is valid:
 *    - Moves the task to the new section using `moveTo`.
 *    - Ends the dragging process.
 *    - Filters tasks to reflect the changes using `getFilter`.
 * 
 * @param {DragEvent} e - The drag event object containing cursor position data.
 */
async function checkDraggableArea(e) {
  let cursorX = e.clientX;
  let cursorY = e.clientY;
  let idFromSectionToDrop = checkIdFromSectionToDrop(cursorX, cursorY); 
  let newSection = checkNewSection(idFromSectionToDrop);  
  if (newSection == 'noDropArea') {
      endDragging();
      removeShadow(id);
      getIdAndData(pathData = '');
  } else {
      moveTo(newSection);
      endDragging();
      getFilter();
  }
}

/**
* Determines the new section based on the ID of the section where the task is dropped.
* 
* Mapping of section IDs to their corresponding new section values:
* - "to_do_tasks" -> "todo"
* - "in_progress_tasks" -> "inProgress"
* - "await_feedback_tasks" -> "awaitFeedback"
* - "done_tasks" -> "done"
* 
* If the section ID does not match any of the above, returns "noDropArea".
* 
* @param {string} idFromSectionToDrop - The ID of the section where the task is dropped.
* @returns {string} The new section or "noDropArea" if invalid.
*/
function checkNewSection(idFromSectionToDrop) {
  if (idFromSectionToDrop == 'to_do_tasks') {
      newSection = 'todo';
  } else if (idFromSectionToDrop == 'in_progress_tasks') {
      newSection = 'inProgress';
  } else if (idFromSectionToDrop == 'await_feedback_tasks') {
      newSection = 'awaitFeedback';
  } else if (idFromSectionToDrop == 'done_tasks') {
      newSection = 'done';
  } else {
      newSection = 'noDropArea';
  }    
  return newSection;
}

/**
* Determines the ID of the section under the cursor during the drag operation.
* 
* Iterates through all predefined drag-and-drop sections and checks if the cursor is within the boundaries of each section.
* If the cursor is within a section, returns the corresponding section ID; otherwise, returns "noDropArea".
* 
* @param {number} cursorX - The X-coordinate of the cursor.
* @param {number} cursorY - The Y-coordinate of the cursor.
* @returns {string} The ID of the section under the cursor or "noDropArea" if none.
*/
function checkIdFromSectionToDrop(cursorX, cursorY) {
  let idFromSectionToDrop = 'noDropArea';
  for (let i = 0; i < dragAndDropSections.length; i++) {
      let sectionLeft = document.getElementById(`${dragAndDropSections[i]}`).getBoundingClientRect().left;
      let sectionRight = document.getElementById(`${dragAndDropSections[i]}`).getBoundingClientRect().right;
      let sectionTop = document.getElementById(`${dragAndDropSections[i]}`).getBoundingClientRect().top;
      let sectionBottom = document.getElementById(`${dragAndDropSections[i]}`).getBoundingClientRect().bottom;
      if ((cursorX > sectionLeft && cursorX < sectionRight) && (cursorY > sectionTop && cursorY < sectionBottom)) {
          idFromSectionToDrop = dragAndDropSections[i];
          break;
      }
  }
  return idFromSectionToDrop;
}


/**
 * Allows the dragged element to be dropped by preventing the default behavior of the dragover event.
 * 
 * @param {DragEvent} e - The drag event object.
 */
function allowDrop(e) {
  e.preventDefault();
}

/**
 * Displays a shadow indicator for the target section during a drag-and-drop operation.
 * All other shadows are hidden, and the specified shadow element is made visible.
 * 
 * @param {string} id - The ID of the shadow element to display.
 */
function showShadow(id) {
  document.getElementById("shadow_move_to_to_do_tasks").style.display = "none";
  document.getElementById("shadow_move_to_in_progress_tasks").style.display = "none";
  document.getElementById("shadow_move_to_await_feedback_tasks").style.display = "none";
  document.getElementById("shadow_move_to_done_tasks").style.display = "none";
  document.getElementById(id).style.display = "flex";
}

/**
 * Removes all shadow indicators during or after a drag-and-drop operation.
 * Ensures that no shadow elements remain visible.
 * 
 * @param {string} id - The ID of the shadow element to hide (not used directly but kept for potential extension).
 */
function removeShadow(id) {
  document.getElementById("shadow_move_to_to_do_tasks").style.display = "none";
  document.getElementById("shadow_move_to_in_progress_tasks").style.display = "none";
  document.getElementById("shadow_move_to_await_feedback_tasks").style.display = "none";
  document.getElementById("shadow_move_to_done_tasks").style.display = "none";
}

/**
 * Moves a task to a new section by updating its status in the database or data source.
 * 
 * Steps performed:
 * 1. Determines the unique key or path of the dragged task using `checkIndexOfTaskToMove`.
 * 2. Constructs the path for updating the task's status.
 * 3. Calls `putNewSection` to update the task's section in the data source.
 * 4. Refreshes the data by calling `getIdAndData` to ensure UI consistency.
 * 
 * @param {string} newSection - The target section where the task should be moved.
 */
async function moveTo(newSection) {
  let keyForPath = checkIndexOfTaskToMove(
    currentDraggedElementID,
    allTasks,
    allKeys
  );
  let path = `tasks/${keyForPath}/currentStatus`;
  await putNewSection(path, newSection);
  await getIdAndData((pathData = ""));
}


// function openAddTaskForm(section) {
//   sectionToSaveTask = section;
//   console.log(section);

//   window.location.href = "/add_task.html";
//   return sectionToSaveTask;
// }

/**
 * Finds the key corresponding to a task to be moved based on its ID.
 * 
 * Steps performed:
 * 1. Extracts the numeric ID from the `currentDraggedElementID`.
 * 2. Iterates through the list of all keys to find the task whose `single_ID` matches the extracted ID.
 * 3. Returns the key of the task for updating its category.
 * 
 * @param {string} currentDraggedElementID - The ID of the currently dragged element.
 * @param {Object} allTasks - An object containing all tasks, keyed by unique IDs.
 * @param {Array} allKeys - An array of all task keys in the `allTasks` object.
 * @returns {string|undefined} The key of the task to change category, or undefined if not found.
 */
function checkIndexOfTaskToMove(currentDraggedElementID, allTasks, allKeys) {
  let id = currentDraggedElementID.slice(15);
  let keytoChangeCategory;
  for (let i = 0; i < allKeys.length; i++) {
      if (allTasks[`${allKeys[i]}`].single_ID == Number(id)) {
          keytoChangeCategory = allKeys[i];
          break;
      }
  }
  return keytoChangeCategory;
}

/**
* Toggles the visibility of the menu for moving a task and adjusts the task's appearance.
* 
* Steps performed:
* 1. Stops event propagation to prevent unintended actions.
* 2. Toggles the visibility of the menu element associated with the given `single_ID`.
* 3. Applies a grayscale filter to the task container when the menu is visible; removes it when hidden.
* 4. Calls `enableCurrentSection` to enable or highlight the section corresponding to the task's current status.
* 
* @param {Event} e - The event object triggered by the user interaction.
* @param {number} single_ID - The unique ID of the task.
* @param {string} currentStatus - The current status/category of the task.
*/
function openCloseMenuMovingTask(e, single_ID, currentStatus) {
e.stopPropagation();
single_ID = single_ID;
currentStatus = currentStatus;
let menuForMoving = document.getElementById(`move_task_menu_${single_ID}`);
menuForMoving.classList.toggle("visible");
if (menuForMoving.classList.contains("visible")) {
  document.getElementById(`single_task_ctn${single_ID}`).style.filter =
    "grayscale(0.75)";
} else {
  document.getElementById(`single_task_ctn${single_ID}`).style.filter =
    "grayscale(0)";
}
enableCurrentSection(currentStatus, single_ID);
}


/**
 * Highlights the current section of a task in the move menu by changing its text color.
 * Resets the color of all other sections to black and sets the current section to light gray.
 * 
 * @param {string} currentStatus - The current status/category of the task.
 * @param {number} single_ID - The unique ID of the task.
 */
function enableCurrentSection(currentStatus, single_ID) {
  let moveToID = `move_${single_ID}_to_${currentStatus}`;
  document.getElementById(`move_${single_ID}_to_todo`).style.color = "black";
  document.getElementById(`move_${single_ID}_to_inProgress`).style.color = "black";
  document.getElementById(`move_${single_ID}_to_awaitFeedback`).style.color = "black";
  document.getElementById(`move_${single_ID}_to_done`).style.color = "black";
  document.getElementById(`${moveToID}`).style.color = "lightgray";
}

/**
 * Finds the key corresponding to a task to be moved based on its ID.
 * Iterates through all keys in the `allTasks` object and returns the key of the matching task.
 * 
 * @param {Object} allTasks - An object containing all tasks, keyed by unique IDs.
 * @param {Array} allKeys - An array of all task keys in the `allTasks` object.
 * @param {number} id - The unique ID of the task.
 * @returns {string|undefined} The key of the task to change section, or undefined if not found.
 */
function checkKeyToMove(allTasks, allKeys, id) {
  let keytoChangeSection;
  for (let i = 0; i < allKeys.length; i++) {
    if (allTasks[`${allKeys[i]}`].single_ID == id) {
      console.log(i, allKeys[i]);
      keytoChangeSection = allKeys[i];
    }
  }
  return keytoChangeSection;
}

/**
 * Moves a task to a new section using the menu option.
 * 
 * Steps performed:
 * 1. Finds the key of the task to be moved using `checkKeyToMove`.
 * 2. Constructs the path to update the task's current status in the data source.
 * 3. Updates the task's status to the new section using `putNewSection`.
 * 4. Refreshes task data by calling `getIdAndData` to ensure the UI reflects the changes.
 * 
 * @param {number} id - The unique ID of the task to be moved.
 * @param {string} toSection - The target section where the task should be moved.
 */
async function moveTaskWithMenu(id, toSection) {
  let keytoChangeSection = checkKeyToMove(allTasks, allKeys, id);
  let path = `tasks/${keytoChangeSection}/currentStatus`;
  await putNewSection(path, toSection);
  await getIdAndData((pathData = ""));
}
// UMZUG IN EDIT_TASK.JS

/**
 * Updates the dialog box to display the form for changing task values.
 * 
 * Steps performed:
 * 1. Clears the existing content of the dialog box.
 * 2. Resets the dialog box's transition and sets its background color to white.
 * 3. Adjusts the dialog box's width and box-sizing property.
 * 4. Inserts the HTML for the change-task form using `returnChangingAddTask`.
 * 5. Calls `returnChangeAddTask` to initialize the form functionality or additional logic.
 */
function changeTaskValues(e) {
  e.stopPropagation();
  document.getElementById("dialogBox").innerHTML = "";
  document.getElementById("dialogBox").style.transition = "unset";
  document.getElementById("dialogBox").style.backgroundColor = "white";
  document.getElementById("dialogBox").style.width = "525px";
  document.getElementById("dialogBox").style.boxSizing = "border-box";
  let today = new Date().toISOString().split('T')[0];
  document.getElementById("dialogBox").innerHTML = returnChangingAddTask(today);

  returnChangeAddTask();
}
// UMZUG IN EDIT_TASK.JS
/**
 * Closes the dialog box for changing task values and restores its original styles.
 * 
 * Steps performed:
 * 1. Clears all inline styles applied to the dialog box using `style.cssText`.
 * 2. Removes the animation class (`showIt`) from the dialog box.
 * 3. After a delay (225ms), hides the background element and sets the dialog box's background color to white.
 */
function closeChangeTaskValues() {
  if (document.getElementById("insertContactList").classList.contains(!"d-none")) {
    console.log('d-none nicht enthalten, Liste geöffnet');
    
    closeContactList()
  isListOpen = !isListOpen;
  }

  document.getElementById("dialogBox").style.cssText = "";
  document.getElementById("dialogBox").classList.remove("showIt");
  setTimeout(() => {
    document.getElementById("backgroundId").classList.add("d-none");
    document.getElementById("dialogBox").style.backgroundColor = "white";
  }, 225);
}

//UMZUG IN OPENCLOSEOVERLAY.JS ODER ADD_TASK.JS
/** 
 * Renders the HTML form for adding a task based on the selected process category.
 * 
 * @param {string} selectedProcessCategory - The category selected for the task, used to customize the form.
 * @returns {string} The HTML string for the add-task form, ready to be inserted into the DOM.
 */

function renderFormAddTask(selectedProcessCategory, today) {
  // console.log(selectedProcessCategory);
  return `
  <div class="overAllFormAddTask">
  <form id="formAddTasks" class="formAddTasks">
      <div class="seperateSendButtons"><div class="titleSectionAddTask"><h2 class="titleAddTask">Add Task</h2><div class="iconImage"><img onclick="closeDialog()" src="assets/icons/close.svg"></div></div>
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
                    oninput="filterContacts()"
                    placeholder="Select contacts to assign"
                  />
                  <div class="changeSymboles">
                    <img
                      id="arrowDropdown"
                      src="./assets/icons/arrowDropdown.svg"
                      alt=""
                      onclick="toggleContactList()"
                    />
                  </div>
                </div>
                <ul id="insertContactList" class="listContacts"></ul>
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
                  Low<img id="lowButtonImg" src="assets/icons/low.svg" alt="" />
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
                  <div class="categoryItem" onclick="putInput('Technical Task')">
                    Technical Task
                  </div>
                  <div class="categoryItem" onclick="putInput('User Story')">
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
                onclick="reloadPage()"
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
    </div>`;
}