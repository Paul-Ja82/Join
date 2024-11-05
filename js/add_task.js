const BASE_URL =
  "https://join-8e7b1-default-rtdb.europe-west1.firebasedatabase.app/";
const priorityClasses = ["low", "medium", "urgent"];
let subtasks = [];
let selectedPrio = "";
let selectedContacts = [];
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
let isListOpen = false;

const avatarColors = ["#3498db", "#e74c3c", "#f39c12", "#2ecc71", "#9b59b6"];

function init() {
  const contactList = document.getElementById("insertContactList");
  contactList.style.height = 0;
  selectPrio("medium");
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
  const contactList = document.getElementById("insertContactList");
  contactList.style.height = "250px";
  contactList.innerHTML = ""; // Reset the list
  document.getElementById("arrowDropdown").src =
    "/assets/icons/arrowUpDropdown.svg";

  // Überprüfe, ob die gefilterten Kontakte leer sind
  if (filteredContacts.length === 0) {
    contactList.innerHTML =
      "<li class='emptyListMessage'>Ganz schön leer hier! :(</li>";
    return; // Beende die Funktion, da keine Kontakte gerendert werden müssen
  }

  // Render die Kontakte, wenn die Liste nicht leer ist
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
  contactList.style.height = 0;
  document.getElementById("arrowDropdown").src =
    "/assets/icons/arrowDropdown.svg";
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
  return selectedContacts
}

function changeArrow() {
  const categoryDropdownIcon = document.getElementById("categoryDropdown");
  categoryDropdownIcon.src = "assets/icons/arrowUpDropdown.svg";

  // Setze den Event Listener für den Dropdown auf "resetArrow"
  document
    .getElementById("categoryToSelect")
    .removeEventListener("click", changeArrow);
  document
    .getElementById("categoryToSelect")
    .addEventListener("click", resetArrow);
}

function resetArrow() {
  const categoryDropdownIcon = document.getElementById("categoryDropdown");
  categoryDropdownIcon.src = "assets/icons/arrowDropdown.svg";

  // Setze den Event Listener wieder auf "changeArrow"
  document
    .getElementById("categoryToSelect")
    .removeEventListener("click", resetArrow);
  document
    .getElementById("categoryToSelect")
    .addEventListener("click", changeArrow);
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

function saveSubtasks(index) {
  let textSubtask = document.getElementById("subtasks").value;
  pushTextSubtask(textSubtask);
  //subtasks.push(textSubtask);
  document.getElementById("subtasks").value = "";
  document.getElementById(
    "symbolsSubtasks"
  ).innerHTML = `<img src="assets/icons/plus.svg" alt="" />`; // Hier Image noch einfügen
  renderSubtasks();
}

function pushTextSubtask(textSubtask) {
  const newSubtask = {
    subtask: textSubtask,
    checked: false
  };
  
  subtasks.push(newSubtask);
}

function saveEditSubtask(index) {
  let changedSubtask = document.getElementById(`inputField${index}`).value;
  subtasks[index] = changedSubtask;
  renderSubtasks();
}

function changeSymbols() {
  let checkInput = document.getElementById("subtasks").value;

  document.getElementById("symbolsSubtasks").innerHTML = "";
  document.getElementById(
    "symbolsSubtasks"
  ).innerHTML = `<div class="centerSymbol" onclick="clearInput()"><img src="assets/icons/close.svg"></div><div class="borderEditIcons"></div><div class="centerSymbol" onclick="saveSubtasks()"><img src="assets/icons/check.svg"></div>`;
  if (checkInput.length <= 0) {
    document.getElementById(
      "symbolsSubtasks"
    ).innerHTML = `<img src="assets/icons/plus.svg" alt="">`;
  }
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
    ).innerHTML += `<li id="subtask${index}" class="overallListItem">
    <div class="showEntrySubtask" onclick="changeText(${index})">
    <div class="subtaskText">${subtasks[index].subtask}</div>
    <div id="edit${index}" class="edit">
      <div class="centerSymbol editTask"><img src="assets/icons/pencil.svg"></div><div class="borderEditIcons"></div>
      <div class="centerSymbol basket" onclick="deleteSubtask(${index})"><img src="assets/icons/basketIcon.svg"></div>
    </div>
    </div>
    </li>`;
  }
}

function changeText(index) {
  let changeText = subtasks[index];

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

function changeImage(button, isHover) {
  const img = button.querySelector("img");
  img.src = isHover ? "assets/icons/vectorBlue.svg" : "assets/icons/close.svg";
}

async function submitForm() {
  let hasError = false;

  const title = document.getElementById("title").value.trim();
  const dueDate = document.getElementById("date").value;
  const category = document.getElementById("categoryToSelect").value;

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
    document.getElementById("categoryToSelect").style.border =
      "1px solid #FF8190";
    document.getElementById("errorCategory").style.display = "block";
    hasError = true;
  } else {
    document.getElementById("categoryToSelect").style.border = "none";
    document.getElementById("errorCategory").style.display = "none";
  }

  if (!hasError) {
   
    await collectDataFromAddTask(); //senden an loadTasks.js zum hochladen ins Firebase
    window.location.href = './board.html';
    // reloadPage();
  }
}

function reloadPage() {
  location.reload();
}
