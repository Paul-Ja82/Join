// const BASE_URL =  "https://join-8e7b1-default-rtdb.europe-west1.firebasedatabase.app/";
const priorityClasses = ["low", "medium", "urgent"];
let subtasks = [];
let selectedPrio = "";
let selectedContacts = [];
/*
let contacts = [
  "Anna Müller",
  "Ben Schneider",
  "Clara Fischer",
  "David Wagner",
  "Eva Schmidt",
  "Felix Braun",
  "Greta Weber",
  "Hans Mayer",
  "Isabel Koch",
  "Jonas Lehmann",
];
*/
let isListOpen = false;

const avatarColors = ["#3498db", "#e74c3c", "#f39c12", "#2ecc71", "#9b59b6"];

async function initAddTasks() {
  document.getElementById("contentAddTaskContainer").innerHTML = returnAddTaskForm();
  const contactList = document.getElementById("insertContactList");
  contactList.classList.add("d-none");
  selectPrio("medium");
  await getIdAndDataForAddTask((pathData = ""));
}

function returnAddTaskForm(selectedProcessCategory) {
  /*let selectedProcessCategory = selectCat == null ? "medium" : selectCat;*/
  return `
  <div class="overAllFormAddTask">
        <div id="insertAddedToTaskConfirmation"></div>
        <div class="overheader">
          <h2 class="titleAddTask">Add Task</h2>
        </div>
        <form id="formAddTasks" class="formAddTasks">
          <div class="seperateSendButtons">
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
                      Low<img
                        id="lowButtonImg"
                        src="assets/icons/low.svg"
                        alt=""
                      />
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
                      <div
                        class="categoryItem"
                        onclick="putInput('Technical Task)"
                      >
                        Technical Task
                      </div>
                      <div
                        class="categoryItem"
                        onclick="putInput('User Story')"
                      >
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
      </div>
  `;
}

async function loadData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  console.log(responseToJson);
}

async function postData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  let responseToJson = await response.json();
  console.log(responseToJson);
}
/*
async function saveData() {
  let taskData = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    AssignedTo: selectedContacts,
    dueDate: document.getElementById("date").value,
    priority: selectedPrio == null ? "medium" : selectedPrio,
    category: document.getElementById("categoryToSelect").value,
    subtasks: subtasks,
    currentStatus: "todo",
  };

  await postData((path = "/tasks"), (data = taskData));
  location.reload();
}*/

function renderContactList(filteredContacts = contacts) {
  document.getElementById("setBackground").classList.add("whiteBG");
  const contactList = document.getElementById("insertContactList");
  contactList.classList.remove("d-none");

  contactList.innerHTML = "";
  document.getElementById("arrowDropdown").src =
    "/assets/icons/arrowUpDropdown.svg";

  if (filteredContacts.length === 0) {
    contactList.innerHTML =
      "<li class='emptyListMessage'>Ganz schön leer hier! :(</li>";
    return;
  }

  filteredContacts.forEach((contact, index) => {
    const isSelected = selectedContacts.includes(contact);
    contactList.innerHTML += `
      <li id="listPerson${index}" class="backgroundOnHover" onclick="changeCheckbox(${index})">
        <div class="profile">
          <div id="profilPerson${index}" class="profilePerson"></div>    
          <div class="contactPerson">${contact}</div>
        </div>
        <input type="checkbox" value="${contact}" class="contactListCheckbox" 
          id="checkbox${index}" onchange="renderAddedPersons()" 
          onclick="event.stopPropagation()" 
          ${isSelected ? "checked" : ""}>
        <img id="checkboxId${index}" src="assets/icons/checkbox.svg">
      </li>`;
    showProfilPicture(contact, index);
    if (isSelected) {
      document.getElementById(`checkboxId${index}`).src =
        "assets/icons/checkboxChecked.svg";
    }
  });

  document.addEventListener("click", function (event) {
    const inputAssignedTo = document.getElementById("inputAssignedTo");
    const contactList = document.getElementById("insertContactList");
    const arrowDrop = document.getElementById("arrowDropdown");

    if (
      !inputAssignedTo.contains(event.target) &&
      !contactList.contains(event.target) &&
      !arrowDrop.contains(event.target)
    ) {
      closeContactList();
    }
  });

  showPersons();
  colorSelectedContacts();
}
function colorSelectedContacts() {
  const selectedPersons = document.querySelectorAll(".contactListCheckbox");

  selectedPersons.forEach((person) => {
    person.parentNode.classList.remove("backgroundContact");
    if (person.checked) {
      person.parentNode.classList.add("backgroundContact");
      console.log("Erfolgreich");
    }
  });
}

function filterContacts() {
  const input = document.getElementById("inputAssignedTo").value.toLowerCase();
  const filteredContacts = contacts.filter((contact) =>
    contact.toLowerCase().includes(input)
  );
  renderContactList(filteredContacts);
}

function closeContactList() {
  const contactList = document.getElementById("insertContactList");
  contactList.innerHTML = "";
  contactList.classList.add("d-none");
  document.getElementById("arrowDropdown").src =
    "/assets/icons/arrowDropdown.svg";
  document.getElementById("setBackground").classList.remove("whiteBG");
}

function changeCheckbox(index) {
  const checkbox = document.getElementById(`checkbox${index}`);

  checkbox.checked = !checkbox.checked;

  document.getElementById(`checkboxId${index}`).src =
    "assets/icons/checkbox.svg";

  if (checkbox.checked) {
    document.getElementById(`checkboxId${index}`).src =
      "assets/icons/checkboxChecked.svg";
  }
  renderAddedPersons();
  colorSelectedContacts();
}

function renderAddedPersons() {
  selectedContacts = [];
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedContacts.push(checkbox.value);
    }
  });
  console.log("Ausgewählte Kontakte:", selectedContacts);
  showPersons();
  return selectedContacts;
}

function toggleContactList() {
  const inputField = document.getElementById("inputAssignedTo");

  if (isListOpen) {
    closeContactList();
  } else {
    renderContactList();
  }
  isListOpen = !isListOpen;
}

function checkDateInput() {
  let valueDate = document.getElementById("date");
  if (valueDate.value === "") {
    valueDate.classList.add("dateInput");
  } else {
    valueDate.classList.remove("dateInput");
  }

  const dateInput = document.getElementById("date");
  if (dateInput.value) {
    // Wenn ein Datum ausgewählt ist, setze die Klasse 'filled', damit die Farbe schwarz wird
    dateInput.classList.add("filled");
  } else {
    // Wenn das Datum leer ist, setze die Farbe zurück auf grau
    dateInput.classList.remove("filled");
  }
}

function showProfilPicture(contact, index) {
  let linkProfil = document.getElementById(`profilPerson${index}`);
  linkProfil.innerHTML = "";
  const initials = getInitials(contact);
  const bgColor = avatarColors[index % avatarColors.length];
  const svgAvatar = createAvatarSVG(initials, bgColor);
  linkProfil.appendChild(svgAvatar);
}

function showPersons() {
  const avatarContainer = document.getElementById("showPersons");
  avatarContainer.innerHTML = "";

  selectedContacts.forEach((contact, index) => {
    const initials = getInitials(contact);
    const bgColor = avatarColors[index % avatarColors.length];
    const svgAvatar = createAvatarSVG(initials, bgColor);
    avatarContainer.appendChild(svgAvatar);
  });
}

function getInitials(name) {
  const nameParts = name.split(" ");
  const firstNameInitial = nameParts[0][0].toUpperCase();
  const lastNameInitial = nameParts[1][0].toUpperCase();
  return firstNameInitial + lastNameInitial;
}

function createAvatarSVG(initials, bgColor) {
  const svgNS = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "42");
  svg.setAttribute("height", "42");
  svg.setAttribute("viewBox", "0 0 44 44");
  svg.setAttribute("class", "contact-avatar-svg");

  const circle = document.createElementNS(svgNS, "circle");
  circle.setAttribute("cx", "22");
  circle.setAttribute("cy", "22");
  circle.setAttribute("r", "20");
  circle.setAttribute("fill", bgColor);
  circle.setAttribute("stroke", "#fff");
  circle.setAttribute("stroke-width", "2");

  const text = document.createElementNS(svgNS, "text");
  text.setAttribute("x", "50%");
  text.setAttribute("y", "50%");
  text.setAttribute("dy", ".35em");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("font-size", "12");
  text.setAttribute("fill", "#fff");
  text.setAttribute("font-family", "Arial, sans-serif");
  text.textContent = initials;

  svg.appendChild(circle);
  svg.appendChild(text);

  return svg;
}

function saveSubtasks() {
  let textSubtask = document.getElementById("subtasks").value;
  console.log(textSubtask);
  pushTextSubtask(textSubtask);
  document.getElementById("subtasks").value = "";
  document.getElementById(
    "symbolsSubtasks"
  ).innerHTML = `<img src="assets/icons/plus.svg" alt="" />`;
  renderSubtasks();
}
/*
document.addEventListener("DOMContentLoaded", function () {
  let getInputfieldSubtask = document.getElementById("subtasks");

  getInputfieldSubtask.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("subtaskSaver").click();
    }
  });
});*/

function pushTextSubtask(textSubtask) {
  const newSubtask = {
    title: textSubtask,
    checked: false,
  };

  subtasks.push(newSubtask);
  console.log(newSubtask);
  console.log(subtasks);
}

function saveEditSubtask(index) {
  let changedSubtask = document.getElementById(`inputField${index}`).value;
  subtasks[index].title = changedSubtask;
  renderSubtasks();
}

function changeSymbols() {
  let checkInput = document.getElementById("subtasks").value;

  document.getElementById("symbolsSubtasks").innerHTML = "";
  document.getElementById(
    "symbolsSubtasks"
  ).innerHTML = `<div class="centerSymbol" onclick="clearInput()"><img src="assets/icons/close.svg"></div><div class="borderEditIcons"></div><div id="subtaskSaver" class="centerSymbol" onclick="saveSubtasks()"><img src="assets/icons/check.svg"></div>`;

  if (checkInput.length <= 0) {
    document.getElementById(
      "symbolsSubtasks"
    ).innerHTML = `<img src="assets/icons/plus.svg" alt="">`;
  }

  let getInputfieldSubtask = document.getElementById("subtasks");

  getInputfieldSubtask.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();

      let subtaskSaver = document.getElementById("subtaskSaver");
      if (subtaskSaver) {
        subtaskSaver.click();
      }
    }
  });
}

function clearInput() {
  document.getElementById("subtasks").value = "";
  document.getElementById(
    "symbolsSubtasks"
  ).innerHTML = `<img src="assets/icons/plus.svg" alt="">`;
}

function renderSubtasks() {
  document.getElementById("showSubtasks").innerHTML = "";
  for (let index = 0; index < subtasks.length; index++) {
    document.getElementById(
      "showSubtasks"
    ).innerHTML += `<li id="subtask${index}" class="
    ">
    <div class="showEntrySubtask" onclick="changeText(${index})">
    <div class="subtaskText">${subtasks[index].title}</div>
    <div id="edit${index}" class="edit">
      <div class="centerSymbol editTask"><img src="assets/icons/pencil.svg"></div><div class="borderEditIcons"></div>
      <div class="centerSymbol basket" onclick="deleteSubtask(${index})"><img src="assets/icons/basketIcon.svg"></div>
    </div>
    </div>
    </li>`;
  }
}

function changeText(index) {
  let changeText = subtasks[index].title;

  renderSubtasks();

  document.getElementById(
    `subtask${index}`
  ).innerHTML = `<div class="overChangingSubtask"><input id="inputField${index}" class="changingTextInputField" value="${changeText}"><div class="overAllChange editTaskImg"><div class="centerSymbol" onclick="deleteSubtask(${index})" ><img class="editIcons" src="assets/icons/basketIcon.svg"></div><div class="borderEditIcons"></div><div class="centerSymbol" onclick="saveEditSubtask(${index})"><img class="editIcons" src="assets/icons/check.svg"></div></div>`;

  let inputField = document.getElementById(`inputField${index}`);

  document
    .getElementById(`subtask${index}`)
    .classList.add("changeTextSubtasks");
  inputField.classList.add("fullWidth");

  inputField.value = changeText;
  focusAtEnd(inputField);
}

function focusAtEnd(inputField) {
  inputField.focus();

  let textLength = inputField.value.length;
  inputField.setSelectionRange(textLength, textLength);
}

function deleteSubtask(index) {
  subtasks.splice(index, 1);
  renderSubtasks();
}

function selectPrio(priority) {
  selectedPrio = priority;
  priorityClasses.forEach((prio) => {
    document.getElementById(`${prio}Button`).classList.remove(`${prio}Button`);
    document.getElementById(
      `${prio}ButtonImg`
    ).src = `assets/icons/${prio}.svg`;
  });

  if (priority === "low") {
    lowPrio(priority);
  } else if (priority === "medium") {
    mediumPrio(priority);
  } else if (priority === "urgent") {
    urgentPrio(priority);
  }
}

function lowPrio(priority) {
  let button = `${priority}Button`;
  document.getElementById(button).classList.add(`${priority}Button`);
  document.getElementById(`${button}Img`).src = "assets/icons/lowWhite.svg";
}

function mediumPrio(priority) {
  let button = `${priority}Button`;
  document.getElementById(button).classList.add(`${priority}Button`);
  document.getElementById(`${button}Img`).src = "assets/icons/mediumWhite.svg";
}

function urgentPrio(priority) {
  let button = `${priority}Button`;
  document.getElementById(button).classList.add(`${priority}Button`);
  document.getElementById(`${button}Img`).src = "assets/icons/upWhite.svg";
}

function closeDropdown() {
  document.getElementById("showSelectedCategory").onclick = showMeCategorys;
  document.getElementById("categoryDropdown").onclick = showMeCategorys;
  document.getElementById("showCategorys").classList.add("d-none");
  document.getElementById("costumSelect").classList.remove("whiteBG");
  document.getElementById("categoryDropdown").src =
    "assets/icons/arrowDropdown.svg";
}

function putInput(value) {
  document.getElementById("showSelectedCategory").value = value;
  closeDropdown();
}

function showMeCategorys() {
  putInput(``);
  document.getElementById("showSelectedCategory").onclick = closeDropdown;
  document.getElementById("showCategorys").classList.remove("d-none");
  document.getElementById("costumSelect").classList.add("whiteBG");
  document.getElementById("categoryDropdown").onclick = closeDropdown;
  document.getElementById("categoryDropdown").src =
    "assets/icons/arrowUpDropdown.svg";

  document.addEventListener("click", function (event) {
    const catImage = document.getElementById("categoryDropdown");
    const dropdown = document.getElementById("showSelectedCategory");
    const selectBox = document.getElementById("showCategorys");

    if (
      !dropdown.contains(event.target) &&
      !selectBox.contains(event.target) &&
      !catImage.contains(event.target)
    ) {
      closeDropdown();
    }
  });
}

async function submitForm(selectedProcessCategory) {
  let hasError = false;

  const title = document.getElementById("title").value.trim();
  const dueDate = document.getElementById("date").value;
  const category = document.getElementById("showSelectedCategory").value;

  if (title.length === 0) {
    document.getElementById("title").style.border = "1px solid #FF8190";
    document.getElementById("errorTitle").style.display = "block";
    hasError = true;
  } else {
    document.getElementById("title").style.border = "none";
    document.getElementById("errorTitle").style.display = "none";
  }

  if (!dueDate) {
    document.getElementById("date").style.border = "1px solid #FF8190";
    document.getElementById("errorDate").style.display = "block";
    hasError = true;
  } else {
    document.getElementById("date").style.border = "none";
    document.getElementById("errorDate").style.display = "none";
  }

  if (category.length === 0) {
    document.getElementById("showSelectedCategory").style.border =
      "1px solid #FF8190";
    document.getElementById("errorCategory").style.display = "block";
    hasError = true;
  } else {
    document.getElementById("showSelectedCategory").style.border = "none";
    document.getElementById("errorCategory").style.display = "none";
  }

  if (!hasError) {
    await collectDataFromAddTask(selectedProcessCategory, selectedContacts); //senden an loadTasks.js zum hochladen ins Firebase
    document.getElementById(
      "insertAddedToTaskConfirmation"
    ).innerHTML = `<div class="backgroundInformationForm"><div id="addConfirmation" class="addedToBoard">
<div class="taskAddedInformation">Task added to board</div>
<img src="assets/icons/boardIcon.svg" alt="" />
</div></div>`;
    setTimeout(() => {
      window.open("board.html", "_self");
    }, 2000);
  }
}

function reloadPage() {
  location.reload();
}
