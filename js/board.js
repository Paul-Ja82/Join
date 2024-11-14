const inputFindTask = document.getElementById('name_of_task_input');
const targetElement = document.getElementById('find_task_ctn');
let flyingElement = document.createElement("div")
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
// let sectionToSaveTask;
function init(params) {
  // console.log('init()'); ///DEBUG
  // getIdAndData((pathData = ""));
  include();
  // loadContacts();
}

async function showDialog(selectedProcessCategory) {
  if (window.innerWidth < 400) {
    window.open("add_task.html", "_self");
  } else {
    document.getElementById("backgroundId").classList.add("showIt");
    document.getElementById("dialogBox").innerHTML = renderFormAddTask(
      selectedProcessCategory
    );
    selectPrio("medium");
    await getIdAndDataForAddTask((pathData = ""));
    const contactList = document.getElementById("insertContactList");
    contactList.classList.add("d-none");
  }
}

function closeDialog() {
  document.getElementById("backgroundId").classList.remove("showIt");
}

function preparingElements() {
    flyingElement.classList.add('flying_element_ctn');
    flyingElement.id = 'flying_element_ctn';
    inputFindTask.addEventListener('focus', () => {
        targetElement.style.border = '1px solid #29ABE2';
    });
    inputFindTask.addEventListener('blur', () => {
        targetElement.style.border = '1px solid #a8a8a8';
    });
}

function cloneElement(id, e) {
    currentDraggedElementID = `single_task_ctn${id}`;
    currentDraggedElement = document.getElementById(currentDraggedElementID);
    clonedElementForMoving = currentDraggedElement.cloneNode(true);
    clonedElementForMoving.id = 'clonedElement';
    document.getElementById('board_body').appendChild(flyingElement)
    elementIsFlying = true;
    return elementIsFlying
}

function startDragging(e) {
    let rect = currentDraggedElement.getBoundingClientRect();
    styleClonedElement(rect, event)
    currentDraggedElement.classList.add("hide_original_task");
    flyingElement.appendChild(clonedElementForMoving);
    flyingElement.style.position = "absolute";
    clonedElementForMoving.style.position = 'absolute';
    e.dataTransfer.setDragImage(new Image(), 0, 0);
}

function styleClonedElement(rect,e) {
    clonedElementForMoving.style.left = `0px`;
    clonedElementForMoving.style.top = `0px`;
    clonedElementForMoving.style.right = `0px`;
    clonedElementForMoving.style.bottom = `0px`;
    clonedElementForMoving.style.height = `${rect.height}px`;
    clonedElementForMoving.style.width = `${rect.width}px`;
}

function whileDragging(e) {
    let width = window.innerWidth;
    let xStart;
    if (width >= 1440) {
         xStart = width / 2 - 720 
    } else {
        xStart = 0;
    }
    flyingElement.style.left = e.pageX - xStart + 'px';
    flyingElement.style.top = e.pageY + 'px';
}

function endDragging() {
    if (elementIsFlying == true) {
        flyingElement.removeChild(clonedElementForMoving)
        clonedElementForMoving.remove();
        document.getElementById('board_body').removeChild(flyingElement)
    }
    return elementIsFlying = false
}

async function checkDraggableArea(e) {
    let cursorX = e.clientX;
    let cursorY = e.clientY;
    let idFromSectionToDrop = checkIdFromSectionToDrop(cursorX, cursorY); 
    let newSection = checkNewSection(idFromSectionToDrop);    
    // console.log(newSection);
    if (newSection == 'noDropArea') {
        endDragging()
        removeShadow(id)
        getIdAndData(pathData='') 
    } else {
        moveTo(newSection)
        endDragging()
        getFilter()
    }
}

function checkNewSection(idFromSectionToDrop) {
    // console.log(idFromSectionToDrop);
    if (idFromSectionToDrop == 'to_do_tasks') {
        newSection = 'todo';
    } else if (idFromSectionToDrop == 'in_progress_tasks') {
        newSection = 'inProgress';
    } else if (idFromSectionToDrop == 'await_feedback_tasks') {
        newSection = 'awaitFeedback'
    } else if (idFromSectionToDrop == 'done_tasks') {
        newSection = 'done'
    } else {
        newSection = 'noDropArea'
    }    
    return newSection
}

function checkIdFromSectionToDrop(cursorX, cursorY) {
    let idFromSectionToDrop = 'noDropArea';
    for (let i = 0; i < dragAndDropSections.length; i++) {
      let sectionLeft = document.getElementById(`${dragAndDropSections[i]}`).getBoundingClientRect().left;
      let sectionRight = document.getElementById(`${dragAndDropSections[i]}`).getBoundingClientRect().right;
      let sectionTop = document.getElementById(`${dragAndDropSections[i]}`).getBoundingClientRect().top;
      let sectionBottom = document.getElementById(`${dragAndDropSections[i]}`).getBoundingClientRect().bottom;
      if ((cursorX > sectionLeft && cursorX < sectionRight) && (cursorY > sectionTop && cursorY < sectionBottom)) {
        idFromSectionToDrop = dragAndDropSections[i];
        // console.log(idFromSectionToDrop);
        break
      } 
    }
  return idFromSectionToDrop;
}
 
function allowDrop(e) {
  e.preventDefault();
}

function showShadow(id) {
  document.getElementById("shadow_move_to_to_do_tasks").style.display = "none";
  document.getElementById("shadow_move_to_in_progress_tasks").style.display =
    "none";
  document.getElementById("shadow_move_to_await_feedback_tasks").style.display =
    "none";
  document.getElementById("shadow_move_to_done_tasks").style.display = "none";
  document.getElementById(id).style.display = "flex";
}

function removeShadow(id) {
  document.getElementById("shadow_move_to_to_do_tasks").style.display = "none";
  document.getElementById("shadow_move_to_in_progress_tasks").style.display =
    "none";
  document.getElementById("shadow_move_to_await_feedback_tasks").style.display =
    "none";
  document.getElementById("shadow_move_to_done_tasks").style.display = "none";
}

async function moveTo(newSection) {
    // console.log(newSection);
    let keyForPath = checkIndexOfTaskToMove(currentDraggedElementID, allTasks, allKeys)
    // console.log(keyForPath);
    let path = `tasks/${keyForPath}/currentStatus`;
    // console.log(path);
    await putNewSection(path, newSection);
    await getIdAndData(pathData='')
}

// function openAddTaskForm(section) {
//   sectionToSaveTask = section;
//   console.log(section);

//   window.location.href = "/add_task.html";
//   return sectionToSaveTask;
// }

function checkIndexOfTaskToMove(currentDraggedElementID, allTasks, allKeys) {
    let id = currentDraggedElementID.slice(15);
    let keytoChangeCategory;
    for (let i = 0; i < allKeys.length; i++) {
        if (allTasks[`${allKeys[i]}`].single_ID == Number(id)) {
            // console.log(i, allKeys[i])
            keytoChangeCategory = allKeys[i]
            break
        }
    }
    return keytoChangeCategory
}

function openCloseMenuMovingTask(e, single_ID, currentStatus) {
    e.stopPropagation()
    single_ID = single_ID
    currentStatus = currentStatus
    let menuForMoving = document.getElementById(`move_task_menu_${single_ID}`)
    menuForMoving.classList.toggle("visible");
    if(menuForMoving.classList.contains('visible')) {
        document.getElementById(`single_task_ctn${single_ID}`).style.filter = "grayscale(0.75)";
    } else {
        document.getElementById(`single_task_ctn${single_ID}`).style.filter = "grayscale(0)";
    }
    enableCurrentSection(currentStatus, single_ID)
}

function enableCurrentSection(currentStatus, single_ID) {
    let moveToID = `move_${single_ID}_to_${currentStatus}`
    document.getElementById(`move_${single_ID}_to_todo`).style.color = "black";
    document.getElementById(`move_${single_ID}_to_inProgress`).style.color = "black";
    document.getElementById(`move_${single_ID}_to_awaitFeedback`).style.color = "black";
    document.getElementById(`move_${single_ID}_to_done`).style.color = "black";
    document.getElementById(`${moveToID}`).style.color = "lightgray";
}

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

async function moveTaskWithMenu(id, toSection) {
  let keytoChangeSection = checkKeyToMove(allTasks, allKeys, id);
  let path = `tasks/${keytoChangeSection}/currentStatus`;
  await putNewSection(path, toSection);
  await getIdAndData((pathData = ""));
}

function renderFormAddTask(selectedProcessCategory) {
  console.log(selectedProcessCategory);
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
                    placeholder="Assigned To"
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
                  class="fieldInput dateInput"
                  onchange="checkDateInput()"
                />
                <div
                  class="dateIcon"
                  onclick="document.getElementById('date').showPicker();"
                >
                  <img
                    src="/assets/icons/calendarIcon.svg"
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
                  placeholder="Select a option"
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
                  placeholder="Add new Subtask"
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