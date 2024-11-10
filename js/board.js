let currentDraggedElementID;
let currentDraggedElement;
let clonedElementForMoving;
let dragAndDropSections = [
  "to_do_tasks",
  "in_progress_tasks",
  "await_feedback_tasks",
  "done_tasks",
];
let sectionToSaveTask;

function init(params) {
  getIdAndData((pathData = ""));
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

function cloneElement(id, e) {
  currentDraggedElementID = `single_task_ctn${id}`;
  // console.log(currentDraggedElementID);
  currentDraggedElement = document.getElementById(currentDraggedElementID);
  clonedElementForMoving = currentDraggedElement.cloneNode(true);
  clonedElementForMoving.id = "clonedElement";
}

function whileDragging(e) {
  // console.log(e);
  clonedElementForMoving.style.left = `${e.pageX - 50}px`;
  clonedElementForMoving.style.top = `${e.pageY}px`;
}

function startDragging(e) {
  let rect = currentDraggedElement.getBoundingClientRect();
  // console.log(rect);
  // console.log(e);
  styleClonedElement(rect, event);
  currentDraggedElement.classList.add("hide_original_task");
  document.body.appendChild(clonedElementForMoving);
  clonedElementForMoving.classList.add("show_cloned_task");
  e.dataTransfer.setDragImage(new Image(), 0, 0); // Offset für das Drag-Bild
}

function styleClonedElement(rect, e) {
  clonedElementForMoving.style.height = `${rect.height}px`;
  clonedElementForMoving.style.left = `${e.pageX - 50}px`;
  clonedElementForMoving.style.top = `${e.pageY}px`;
  clonedElementForMoving.style.width = `${rect.width}px`;
  clonedElementForMoving.style.right = `${rect.right}px`;
  clonedElementForMoving.style.position = "absolute";
  clonedElementForMoving.style.zIndex = 100;
}

function endDragging() {
  if (clonedElementForMoving) {
    currentDraggedElement.style.opacity = "1";
    clonedElementForMoving.remove();
    clonedElementForMoving = null;
    document.removeEventListener("mouseup", endDragging);
  }
}

async function checkDraggableArea(e) {
  let cursorX = e.clientX;
  let cursorY = e.clientY;
  let idFromSectionToDrop = checkIdFromSectionToDrop(cursorX, cursorY);
  let newSection = checkNewSection(idFromSectionToDrop);
  // console.log(newSection);

  if (newSection == "noDropArea") {
    endDragging();
    removeShadow(id);
    return;
  } else {
    moveTo(newSection);
    endDragging();
    // await getIdAndData(pathData='')
  }
}

function checkNewSection(idFromSectionToDrop) {
  if (idFromSectionToDrop == "to_do_tasks") {
    newSection = "todo";
  } else if (idFromSectionToDrop == "in_progress_tasks") {
    newSection = "inProgress";
  } else if (idFromSectionToDrop == "await_feedback_tasks") {
    newSection = "awaitFeedback";
  } else if (idFromSectionToDrop == "done_tasks") {
    newSection = "done";
  } else {
    newSection = "noDropArea";
  }
  return newSection;
}

function checkIdFromSectionToDrop(cursorX, cursorY) {
  let idFromSectionToDrop = "noDropArea";
  for (let i = 0; i < dragAndDropSections.length; i++) {
    // console.log(document.getElementById(`${dragAndDropSections[i]}`).getBoundingClientRect());
    let sectionLeft = document
      .getElementById(`${dragAndDropSections[i]}`)
      .getBoundingClientRect().left;
    let sectionRight = document
      .getElementById(`${dragAndDropSections[i]}`)
      .getBoundingClientRect().right;
    let sectionTop = document
      .getElementById(`${dragAndDropSections[i]}`)
      .getBoundingClientRect().top;
    let sectionBottom = document
      .getElementById(`${dragAndDropSections[i]}`)
      .getBoundingClientRect().bottom;
    // console.log('x: ', cursorX, 'l: ', sectionLeft, 'r: ', sectionRight, 'y: ', cursorY, 't: ', sectionTop, 'b: ', sectionBottom);
    if (
      cursorX > sectionLeft &&
      cursorX < sectionRight &&
      cursorY > sectionTop &&
      cursorY < sectionBottom
    ) {
      idFromSectionToDrop = dragAndDropSections[i];
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
  // console.log("Dropping into category:", newSection);
  // console.log("Current dragged element:", currentDraggedElementID)
  let keyForPath = checkIndexOfTaskToMove(
    currentDraggedElementID,
    allTasks,
    allKeys
  );
  // console.log(keyForPath);

  let path = `tasks/${keyForPath}/currentStatus`;
  // console.log(path);
  // console.log(newSection);

  await putNewSection(path, newSection);
  await getIdAndData((pathData = ""));
}

function openAddTaskForm(section) {
  sectionToSaveTask = section;
  console.log(section);

  window.location.href = "/add_task.html";
  return sectionToSaveTask;
}

function checkIndexOfTaskToMove(currentDraggedElementID, allTasks, allKeys) {
  let id = currentDraggedElementID.slice(15);
  let keytoChangeCategory;
  for (let i = 0; i < allKeys.length; i++) {
    if (allTasks[`${allKeys[i]}`].single_ID == id) {
      // console.log(i, allKeys[i])
      keytoChangeCategory = allKeys[i];
    }
  }
  return keytoChangeCategory;
}

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

function enableCurrentSection(currentStatus, single_ID) {
  // console.log(currentStatus);
  let moveToID = `move_${single_ID}_to_${currentStatus}`;
  // console.log(moveToID);
  document.getElementById(`move_${single_ID}_to_todo`).style.color = "black";
  document.getElementById(`move_${single_ID}_to_inProgress`).style.color =
    "black";
  document.getElementById(`move_${single_ID}_to_awaitFeedback`).style.color =
    "black";
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
                  <div class="categoryItem" onclick="putInput('Technik Task')">
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
    </form>`;
}
