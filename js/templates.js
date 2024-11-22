/* Für das Ändern der Task im Board */

function returnChangingAddTask(today) {
  return `
<div class="overAllFormAddTask overAllChangeAddTask">
  <div class="closeButtonChangeAddTask"><div class="overImgCloser"><img onclick="closeChangeTaskValues()" class="imgCloseChangeAddTask" src="assets/icons/close.svg"></div></div>
<form id="formAddTasks" class="formChangeAddTasks">
      <div class="seperateSendButtons"><div class="titleSectionChangeAddTask"><h2 class="titleAddTask">Add Task</h2><div class="iconImage"><img onclick="closeDialog()" src="assets/icons/close.svg"></div></div>
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
                    src="/assets/icons/calendarIcon.svg"
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
                  placeholder="Select a option"
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
                <ul id="insertContactList" class="listContacts d-none"></ul>
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
      </div>
    </form>
    <div class="overConfirmChangeAddTaskButton"><button onclick="collectDataFromChangingAddTask()" type="button" class="confirmChangeAddTask">Ok<img class="imgCheckChangeAddTask" src="assets/icons/checkWhite.svg" alt="" /></button></div>
    </div>
`;
}
