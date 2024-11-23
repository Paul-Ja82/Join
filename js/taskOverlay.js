let currentTaskInOverlay;
let currentUserLoggedIn = sessionStorage.getItem('loggedInUserName');
console.log(currentUserLoggedIn);

let currentTaskForEdit;
let inChangeSubtasksTask = [];
let currentKeyToOpen;
let currentStatusofChangingTask;

/*Wird ersetzt durch showTask() 
function openTaskOverlay(e) {
  document.getElementById(`task_overlay_ctn`).style.display = "flex";
  document.getElementById(`task_overlay_ctn`).style.tr = "0";
  document.body.style.overflow = "hidden";
}*/

function checkTask(e) {
  e.stopPropagation();
  let container = e.target.closest('[id^="single_task_ctn"]');
  if (container) {
    let clickedSingleID = container.id.slice(15);
    showTask();
    checkIndexOfAllTasks(clickedSingleID, allTasks, allKeys);
    currentTaskForEdit = clickedSingleID;
    // console.log(allTasks);
  }
}

function openEditedTask() {
  showTask();
    checkIndexOfAllTasks(currentTaskForEdit, allTasks, allKeys);
}

function fillTaskOverlay(allTasks, keyToOpen, priorityImg, assignedToContacts, subTasks) {
  document.getElementById(`dialogBox`).innerHTML = `
  <div onclick="event.stopPropagation(); closeTask(event)" class="task_overlay_ctn">
  <div onclick="event.stopPropagation()" id="boxTask" class="task_overlay_card_ctn single_task_ctn">
            <div class="overlay_task_header">
                    <div class="single_task_header_category_and_close">
                        <div class="single_task_category_overlay">${allTasks[keyToOpen].category}</div>
                        <diy onclick="closeTask(event)" id="close_task_overlay" class="close_task_overlay">
                            <svg id="close_task_overlay_svg" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.99999 8.40005L2.09999 13.3C1.91665 13.4834 1.68332 13.575 1.39999 13.575C1.11665 13.575 0.883321 13.4834 0.699988 13.3C0.516654 13.1167 0.424988 12.8834 0.424988 12.6C0.424988 12.3167 0.516654 12.0834 0.699988 11.9L5.59999 7.00005L0.699988 2.10005C0.516654 1.91672 0.424988 1.68338 0.424988 1.40005C0.424988 1.11672 0.516654 0.883382 0.699988 0.700049C0.883321 0.516715 1.11665 0.425049 1.39999 0.425049C1.68332 0.425049 1.91665 0.516715 2.09999 0.700049L6.99999 5.60005L11.9 0.700049C12.0833 0.516715 12.3167 0.425049 12.6 0.425049C12.8833 0.425049 13.1167 0.516715 13.3 0.700049C13.4833 0.883382 13.575 1.11672 13.575 1.40005C13.575 1.68338 13.4833 1.91672 13.3 2.10005L8.39999 7.00005L13.3 11.9C13.4833 12.0834 13.575 12.3167 13.575 12.6C13.575 12.8834 13.4833 13.1167 13.3 13.3C13.1167 13.4834 12.8833 13.575 12.6 13.575C12.3167 13.575 12.0833 13.4834 11.9 13.3L6.99999 8.40005Z" fill="#2A3647"/>
                            </svg>    
                        </diy>
                    </div>
                <div class="single_task_headline">${allTasks[keyToOpen].title}</div>
            </div>
             <div class="overlay_task_main"> 
                <div class="overlay_single_task_description">${allTasks[keyToOpen].description}</div>
                <div class="single_task_due_date_ctn">
                    <div class="single_task_line_header">Due date:</div>
                    <div class="single_task_line_date">${allTasks[keyToOpen].due_date}</div>
                </div>
                <div class="single_task_pritoity_ctn">
                    <div class="single_task_line_header">Priority:</div>
                    <div class="single_task_line_priority">
                        <span>${allTasks[keyToOpen].priority}</span>
                        ${priorityImg}
                    </div>
                </div>
                <div class="single_task_assigned_to_ctn">
                    <div class="single_task_line_header">Assigned To:</div>
                    <div class="single_task_contacts_ctn">
                    ${assignedToContacts}
                    </div>
                </div>
                <div class="single_task_subtasks_ctn">
                    <div class="single_task_line_header">Subtasks</div>
                    <div class="single_task_subtask_collection">
                        ${subTasks}
                    </div>
                </div>
                <div class="single_task_delete_or_edit_ctn">
                    <div class="delete_or_edit_buttons">
                        <div onclick="deleteTask(event, '${keyToOpen}')" id="btnDel${keyToOpen}" class="delete_or_edit_button">
                            <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" fill="#2A3647"/>
                            </svg>
                            <span>Delete</span>
                        </div>
                        <div onclick="changeTaskValues(event)" id="id="btnEdt${keyToOpen}" class="delete_or_edit_button">
                            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 17H3.4L12.025 8.375L10.625 6.975L2 15.6V17ZM16.3 6.925L12.05 2.725L13.45 1.325C13.8333 0.941667 14.3042 0.75 14.8625 0.75C15.4208 0.75 15.8917 0.941667 16.275 1.325L17.675 2.725C18.0583 3.10833 18.2583 3.57083 18.275 4.1125C18.2917 4.65417 18.1083 5.11667 17.725 5.5L16.3 6.925ZM14.85 8.4L4.25 19H0V14.75L10.6 4.15L14.85 8.4Z" fill="#2A3647"/>
                            </svg>
                            <span>Edit</span>
                        </div>
                    </div>
                </div>            
             </div>
        </div>
        </div>
    `;
  checkTaskCategoryColor("single_task_category_overlay");
}

function checkAssignedToOverlay(allTasks, keyToOpen) {
    let contactsTemplate = "";
    if (allTasks[keyToOpen].assigned_to == 'nobody') {
        contactsTemplate = "";
    } else {
        for (let j = 0; j < allTasks[keyToOpen].assigned_to.length; j++) {          
          let fullName = allTasks[keyToOpen].assigned_to[j];
          let charOneFirstName = "";
          let charOneLastName = "";
          if (fullName.includes(" ")) {
          let partsOfName = fullName.split(" ");
          charOneFirstName = partsOfName[0][0].toUpperCase();
          charOneLastName = partsOfName[1][0].toUpperCase();
          } else {
              charOneFirstName = fullName[0].toUpperCase();
          }
            let currentUser = checkCurrentUser(currentUserLoggedIn, fullName);
            console.log();
            let backgroundColorInitials = checkContactColor(fullName, allContactsForTasks);
            contactsTemplate += `
                <div class="single_task_single_contact">
                    <div style="background-color: ${backgroundColorInitials}" class="task_contact_name_icon">${charOneFirstName}${charOneLastName}</div>
                    <div class="task_contact_name">${fullName} ${currentUser}</div>
                </div>
            `
        }
    }
    return contactsTemplate
} 

function checkContactColor(fullName, allContactsForTasks) {
  // console.log(allContactsForTasks, fullName);
  let colorForInitials; 
  for (let i = 0; i < allContactsForTasks.length; i++) {
    if (allContactsForTasks[i].name == fullName) {
      colorForInitials = allContactsForTasks[i].color;
      // console.log(colorForInitials);      
      break;
    }
  }
  return colorForInitials
}

function checkCurrentUser(currentUserLoggedIn, fullName) {
    let currentUserForAssignedTo = '';
    if (currentUserLoggedIn == fullName) {
        currentUserForAssignedTo = '(You)'
    } else {
        currentUserForAssignedTo = ''
    }
    return currentUserForAssignedTo
}
   
function checkSubtasksOverlay(allTasks, keyToOpen) {
    let subtasks = allTasks[keyToOpen].subtasks;
    let subtaskTemplate = "";
    if (typeof subtasks === 'undefined') {
       subtaskTemplate = `keine Subtasks vorhanden`
    } else {
        for (let j = 0; j < allTasks[keyToOpen].subtasks.length; j++) {    
            let subtaskCheckbox = checkSubtaskStatus(allTasks, keyToOpen, j);     
            subtaskTemplate += `
                <div onclick="event.stopPropagation()" class="single_task_subtask">
                    ${subtaskCheckbox}
                    <label id="subtask${j}_${keyToOpen}" for="checkbox${j}_${keyToOpen}" onclick="changeSubtaskStatus(allTasks, event, labelID='${j}_${keyToOpen}')">
                        <div class="subtask_checkbox">
                            <div class="checkbox_empty">
                                <svg id="checkbox_empty" width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="1.38818" y="1" width="16" height="16" rx="3" stroke="#2A3647" stroke-width="2"/>
                                </svg>
                            </div>
                            <div class="checkbox_checked">
                                <svg id="checkbox_border" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 8V14C17 15.6569 15.6569 17 14 17H4C2.34315 17 1 15.6569 1 14V4C1 2.34315 2.34315 1 4 1H12" stroke="#2A3647" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                                <svg id="checkbox_checkmark" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 9L5 13L13 1.5" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                        </div> 
                        <span id="descriptionSubtask${j}_${keyToOpen}">${allTasks[keyToOpen].subtasks[j].title}</span>
                    </label>
                </div>
            `;
    }
  }
  return subtaskTemplate;
}

function checkSubtaskStatus(allTasks, keyToOpen, j) {
  let checkboxSubtaskHTML = "";
  if (allTasks[keyToOpen].subtasks[j].checked == true) {
    checkboxSubtaskHTML = `
         <input checked type="checkbox" name="subtask_done" id="checkbox${j}_${keyToOpen}">
        `;
  } else {
    checkboxSubtaskHTML = `
        <input type="checkbox" name="subtask_done" id="checkbox${j}_${keyToOpen}">
       `;
  }
  return checkboxSubtaskHTML;
}

async function changeSubtaskStatus(allTasks, e, labelID) {
    e.stopPropagation()
    let keyAndIndex = labelID.split('_')
    let thisSubtaskIndex = keyAndIndex[0];
    let thisTaskKey = keyAndIndex.slice(1).join('_');
    if (allTasks[thisTaskKey].subtasks[thisSubtaskIndex].checked == true) {
        allTasks[thisTaskKey].subtasks[thisSubtaskIndex].checked = false
    } else {
       allTasks[thisTaskKey].subtasks[thisSubtaskIndex].checked = true
    }
    let pathToStatus = `tasks/${thisTaskKey}/subtasks/${thisSubtaskIndex}/checked`
    await putNewCheckedStatus(pathToStatus, allTasks[thisTaskKey].subtasks[thisSubtaskIndex].checked);
    await getIdAndData(pathData='')
}

function checkIndexOfAllTasks(clickedSingleID, allTasks, allKeys) {
  let keyToOpen;
  for (let i = 0; i < allKeys.length; i++) {
    let key = allKeys[i];
    if (allTasks[key].single_ID == clickedSingleID) {
      keyToOpen = allKeys[i];
    }
  }
  let assignedToContacts = checkAssignedToOverlay(allTasks, keyToOpen);
  let priorityImg = checkPriorityImg(allTasks, keyToOpen);
  let subTasks = checkSubtasksOverlay(allTasks, keyToOpen);
  fillTaskOverlay(
    allTasks,
    keyToOpen,
    priorityImg,
    assignedToContacts,
    subTasks
  );
  return (currentTaskInOverlay = allTasks[keyToOpen]);
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

  fillOutInputChangeAddTask(
    allTasks,
    keyToOpen,
    priorityImg,
    assignedToContacts,
    subTasks
  );
}

function fillOutInputChangeAddTask(
  allTasks,
  keyToOpen,
  priorityImg,
  assignedToContacts,
  subTasks
) {
  document.getElementById("title").value = allTasks[keyToOpen].title;
  document.getElementById("description").value =
    allTasks[keyToOpen].description;
  document.getElementById("date").value = allTasks[keyToOpen].due_date;
  selectPrio(`${allTasks[keyToOpen].priority}`);
  selectedPrio = allTasks[keyToOpen].priority;
  document.getElementById("showSelectedCategory").value =
    allTasks[keyToOpen].category;
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

/*
function clickCloseTaskOverlay(event) {
  document.getElementById("close_task_overlay").click();
  event.stopPropagation();
}*/

// function closeTaskOverlay(e) {
//   document.getElementById(`task_overlay_ctn`).style.right = "-100%";
//   document.getElementById(`task_overlay_ctn`).style.display = "none";
//   document.body.style.overflow = "";
// }

async function deleteTask(e, keyToDelete) {
  e.stopPropagation();
  console.log(keyToDelete);
  let pathToDelete = `tasks/${keyToDelete}`;
  await deleteTaskID(pathToDelete);
  // document.getElementById(`task_overlay_ctn`).style.right = "-100%";
  // document.getElementById(`task_overlay_ctn`).style.display = "none";
  closeTask(event)
  document.body.style.overflow = "";
  await getIdAndData((pathData = ""));
}