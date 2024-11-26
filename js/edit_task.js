function openEditedTask() {
    showTask();
      checkIndexOfAllTasks(currentTaskForEdit, allTasks, allKeys);
}

function returnChangeAddTask() {
    let keyToOpen;
    console.log(currentTaskForEdit);
    console.log(allTasks);
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