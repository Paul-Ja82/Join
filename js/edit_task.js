/**
 * Opens the task currently being edited and displays its details.
 *
 * This function triggers the display of the task's details using `showTask()`. It then 
 * checks the position of the task being edited within the `allTasks` array by calling 
 * `checkIndexOfAllTasks`, passing the task's ID, the tasks list, and their corresponding keys.
 *
 * @returns {void}
 */
function openEditedTask() {
    showTask();
      checkIndexOfAllTasks(currentTaskForEdit, allTasks, allKeys);
}

/**
 * Finds the task currently being edited, retrieves its key, and populates the task editing form.
 *
 * This function identifies the task that is currently being edited by comparing its `single_ID` 
 * to the task stored in `currentTaskForEdit`. Once the matching task is found, it extracts the 
 * necessary details such as assigned contacts, priority image, and subtasks. It then updates 
 * the form inputs to allow further editing of the task's details.
 *
 * @returns {void}
 */
function returnChangeAddTask() {
    let keyToOpen;
    // console.log(currentTaskForEdit);
    // console.log(allTasks);
    for (let i = 0; i < allKeys.length; i++) {
      let key = allKeys[i];
      if (allTasks[key].single_ID == currentTaskForEdit) {
        keyToOpen = allKeys[i];
      }
    }
    let assignedToContacts = checkAssignedToOverlay(allTasks, keyToOpen);
    let priorityImg = checkPriorityImg(allTasks, keyToOpen);
    let subTasks = checkSubtasksOverlay(allTasks, keyToOpen);
    currentKeyToOpen = keyToOpen;
    fillOutInputChangeAddTask(allTasks, keyToOpen, priorityImg, assignedToContacts, subTasks);
}

/**
 * Populates an input form with the details of a selected task.
 *
 * This function fills out the input fields (such as title, description, due date, etc.) 
 * of a task editing form based on the details of a selected task from the `allTasks` object. 
 * It also updates the priority, category, and the current status of the task. Additionally, 
 * it triggers the rendering of subtasks associated with the selected task.
 *
 * @param {Object} allTasks - The object containing all tasks. Each task has properties like `title`, `description`, `due_date`, `priority`, etc.
 * @param {string|number} keyToOpen - The key or index to identify which task to access from `allTasks`.
 * @param {string} priorityImg - The image source for the priority indicator of the task (optional, not directly used in this function).
 * @param {Array} assignedToContacts - The array of contacts assigned to the task (optional, not directly used in this function).
 * @param {Array} subTasks - The array of subtasks for the task (optional, not directly used in this function).
 */
function fillOutInputChangeAddTask(allTasks, keyToOpen, priorityImg, assignedToContacts, subTasks) {
    document.getElementById("title").value = allTasks[keyToOpen].title;
    document.getElementById("description").value = allTasks[keyToOpen].description;
    document.getElementById("date").value = allTasks[keyToOpen].due_date;
    selectPrio(`${allTasks[keyToOpen].priority}`);
    selectedPrio = allTasks[keyToOpen].priority;
    document.getElementById("showSelectedCategory").value = allTasks[keyToOpen].category;
    currentStatusofChangingTask = allTasks[keyToOpen].currentStatus;
    document.getElementById("date").style.color = "black";
    getSubtasksChangeTaskAdded(keyToOpen, allTasks);
}

/**
 * Retrieves the subtasks of a specific task and renders them.
 *
 * This function accesses a specific task from the `allTasks` object based on
 * the provided `keyToOpen`. If the task has subtasks, it loops through them,
 * pushes each subtask into the `subtasks` array, and then triggers the rendering
 * of the subtasks using the `renderSubtasks` function.
 *
 * @param {string|number} keyToOpen - The key or index to identify which task to access from `allTasks`.
 * @param {Object} allTasks - The object containing all tasks. Each task may have a `subtasks` property, which is an array.
 */
function getSubtasksChangeTaskAdded(keyToOpen, allTasks) {
    subtasks = [];
    if (allTasks[keyToOpen].subtasks) {
      for (let index = 0; index < allTasks[keyToOpen].subtasks.length; index++) {
        subtasks.push(allTasks[keyToOpen].subtasks[index]);
        }
        renderSubtasks();
    }
}

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