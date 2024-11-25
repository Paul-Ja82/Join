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
async function showDialog(selectedProcessCategory) {
    if (window.innerWidth < 400) {
      window.open("add_task.html", "_self");
    } else {
      document.getElementById("backgroundId").classList.remove("d-none");
      setTimeout(() => {
        document.getElementById("dialogBox").classList.add("showIt");
        // document.getElementById("dialogBox").classList.add("testSabrinaAddTaskCtn");
      }, 10);
      let today = new Date().toISOString().split('T')[0];
      document.getElementById("dialogBox").innerHTML = renderFormAddTask(selectedProcessCategory, today);
      selectPrio("medium");
      await getIdAndDataForAddTask((pathData = ""));
      const contactList = document.getElementById("insertContactList");
      contactList.classList.add("d-none");
    }
}

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
 * Renders the HTML form for adding a task based on the selected process category.
 * 
 * @param {string} selectedProcessCategory - The category selected for the task, used to customize the form.
 * @returns {string} The HTML string for the add-task form, ready to be inserted into the DOM.
 */
function renderFormAddTask(selectedProcessCategory, today) {
    // console.log(selectedProcessCategory);
    return `
    <div class="overAllFormAddTaskBoard">
    <form id="formAddTasks" class="formAddTasks">
        <div class="seperateSendButtons"><div class="titleSectionAddTask"><h2 class="titleAddTask">Add Task</h2><div class="iconImage"><img onclick="closeDialog()" src="assets/icons/close.svg"></div></div>
          <div class="overInputFieldsBoard">
            <div class="fillOutBoard">
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
                  <div id="insertContactList" class="listContacts"></div>
                </div>
                <div id="showPersons" class="showPersons"></div>
              </div>
            </div>
            <div class="lineBoard"></div>
            <div class="fillOutBoard">
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
                <div class="overPrioButtonsBoard">
                  <button
                    id="urgentButton"
                    class="prioButtonsBoard"
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
                    class="prioButtonsBoard"
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
                    class="prioButtonsBoard"
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
          <div class="overFormButtonsBoard">
            <div class="requiredInformationBoard">
              <span style="color: #ff8190">*</span>This field is required
            </div>
            <div class="setButtons">
              <div class="overSendButtonsBoard">
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