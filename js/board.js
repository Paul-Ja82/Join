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
 * Initializes the board by performing necessary setup tasks.
 * - Retrieves data and element IDs using `getIdAndData()`.
 * - Prepares the elements on the board with `preparingElements()`.
 * - Disables the default drag image during drag operations with `disableDragImage()`.
 * - Initializes the header JS functionality asynchronously with `include()` and `initHeaderJs()`.
 */
function initBoard() {
  initMPA();
  getIdAndData(pathData='');
  preparingElements();
  disableDragImage();
  include().then(initHeaderJs);
}

/**
 * Prepares specific elements by adding classes and IDs to the flying element, and sets up event listeners for input focus and blur actions.
 * When focused, the target element's border is highlighted; on blur, the border reverts to its original style.
 */
function preparingElements() {
  flyingElement.classList.add("flying_element_ctn");
  flyingElement.id = "flying_element_ctn";
  inputFindTask.addEventListener("focus", () => {targetElement.style.border = "1px solid #29ABE2";});
  inputFindTask.addEventListener("blur", () => {targetElement.style.border = "1px solid #a8a8a8";});
}

/**
 * Disables the default drag image when dragging an element.
 * Listens for the 'dragstart' event and prevents the default drag image
 * from being displayed by setting a transparent image as the drag image.
 */
function disableDragImage() {
  document.addEventListener('dragstart', function(event) {
    event.dataTransfer.setDragImage(new Image(), 0, 0);
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
  let keyForPath = checkIndexOfTaskToMove(currentDraggedElementID, allTasks, allKeys);
  let path = `tasks/${keyForPath}/currentStatus`;
  await putNewSection(path, newSection);
  await getIdAndData((pathData = ""));
}

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