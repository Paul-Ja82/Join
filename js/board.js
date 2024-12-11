const inputFindTask = document.getElementById("name_of_task_input");
const targetElement = document.getElementById("find_task_ctn");
let flyingElement = document.createElement("div");
let elementIsFlying = false;
let currentDraggedElementID;
let currentDraggedElement;
let clonedElementForMoving;
let dragAndDropSections = [
  "tasks_area_add_task",
  "to_do_tasks",
  "tasks_area_in_progress",
  "in_progress_tasks",
  "tasks_area_await_feedback",
  "await_feedback_tasks",
  "done_tasks",
  "tasks_area_done"
];

/**
 * Initializes the board by setting up data, elements, drag behavior, and header functionality.
 */
async function initBoard() {
  await initMPA();
  await getIdAndData(pathData='');
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
 * Disables the default drag image by setting a transparent image.
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
 * Handles the drop operation for a dragged element.
 * @param {DragEvent} e - The drag event.
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
 * Determines the new section based on the drop area ID.
 * @param {string} idFromSectionToDrop - ID of the drop area.
 * @returns {string} The new section or "noDropArea" if invalid.
 */
function checkNewSection(idFromSectionToDrop) {
  if (idFromSectionToDrop == 'to_do_tasks' || idFromSectionToDrop == 'tasks_area_add_task') {
      newSection = 'todo';
  } else if (idFromSectionToDrop == 'in_progress_tasks' || idFromSectionToDrop == 'tasks_area_in_progress') {
      newSection = 'inProgress';
  } else if (idFromSectionToDrop == 'await_feedback_tasks' || idFromSectionToDrop == 'tasks_area_await_feedback') {
      newSection = 'awaitFeedback';
  } else if (idFromSectionToDrop == 'done_tasks' || idFromSectionToDrop == 'tasks_area_done') {
      newSection = 'done';
  } else {
      newSection = 'noDropArea';
  }    
  return newSection;
}

/**
 * Determines the section ID under the cursor during drag.
 * @param {number} cursorX - Cursor X-coordinate.
 * @param {number} cursorY - Cursor Y-coordinate.
 * @returns {string} Section ID or "noDropArea" if none.
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
 * Moves a task to a new section by updating its status.
 * @param {string} newSection - Target section for the task.
 */
async function moveTo(newSection) {
  let keyForPath = checkIndexOfTaskToMove(currentDraggedElementID, allTasks, allKeys);
  let path = `tasks/${keyForPath}/currentStatus`;
  await putNewSection(path, newSection);
  await getIdAndData((pathData = ""));
}

/**
 * Finds the key of a task to move based on its ID.
 * @param {string} currentDraggedElementID - ID of the dragged task.
 * @param {Object} allTasks - All tasks mapped by keys.
 * @param {Array} allKeys - Keys of all tasks.
 * @returns {string|undefined} Key of the task to move.
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
 * Toggles the move menu for a task and adjusts its appearance.
 * @param {Event} e - Event object.
 * @param {number} single_ID - Unique ID of the task.
 * @param {string} currentStatus - Current status of the task.
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
 * Highlights the current section of a task in the move menu.
 * @param {string} currentStatus - Current task status.
 * @param {number} single_ID - Task unique ID.
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
 * Finds the key of a task to move based on its ID.
 * @param {Object} allTasks - All tasks keyed by IDs.
 * @param {Array} allKeys - Keys of all tasks.
 * @param {number} id - Task unique ID.
 * @returns {string|undefined} Key of the task.
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
 * Moves a task to a new section using the menu.
 * @param {number} id - Task unique ID.
 * @param {string} toSection - Target section.
 */
async function moveTaskWithMenu(id, toSection) {
  let keytoChangeSection = checkKeyToMove(allTasks, allKeys, id);
  let path = `tasks/${keytoChangeSection}/currentStatus`;
  await putNewSection(path, toSection);
  await getIdAndData((pathData = ""));
}
