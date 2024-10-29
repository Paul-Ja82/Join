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

async function saveData() {
  /*let dueDate = document.getElementById("date").value;
  let priority =
    document.querySelector(".prioButtons.active")?.innerText || "Medium";
  let category = document.getElementById("category").value;
  let subtasks = document.getElementById("subtasks").value;*/

  let taskData = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    assignedTo: document.getElementById("assignedTo").value,
    priority: selectedPrio == null ? medium : selectedPrio,
  };

  console.log(taskData);
  postData((path = "/tasks"), (data = taskData));
}

function renderContactList() {
  document.getElementById("insertContactList").innerHTML = "";
  for (let index = 0; index < contacts.length; index++) {
    document.getElementById("insertContactList").innerHTML += `<li>
    <div class="contactPerson">${contacts[index]}</div><input type="checkbox" value="${contacts[index]}" class="contactList-checkbox" onchange="renderAddedPersons()"> 
</li>`;
  }
}

function renderAddedPersons() {
  selectedContacts = [];
  const checkboxes = document.querySelectorAll('.contactList-checkbox');
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
        selectedContacts.push(checkbox.value); 
    }
});

console.log(selectedContacts);
}


function saveSubtasks(index) {
  let textSubtask = document.getElementById("subtasks").value;
  subtasks.push(textSubtask);
  document.getElementById("subtasks").value = "";
  document.getElementById("symbolsSubtasks").innerHTML = "+";
  renderSubtasks();
  console.log(subtasks);
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
  ).innerHTML = `<div class="centerSymbol" onclick="clearInput()"><img src="assets/icons/close.svg"></div><div class="centerSymbol" onclick="saveSubtasks()"><img src="assets/icons/check.svg"></div>`;
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
    ).innerHTML += `<li id="subtask${index}">
    <div class="showEntrySubtask" onclick="changeText(${index})">
    <div>${subtasks[index]}</div>
    <div id="edit${index}" class="edit">
      <div class="centerSymbol editTask"><img src="assets/icons/pencil.svg"></div>
      <div class="centerSymbol basket" onclick="deleteSubtask(${index})"><img src="assets/icons/basket.svg"></div>
    </div>
    </div>
    </li>`;
  }
}

/*function showEdit(index) {
  let element = document.getElementById(`edit${index}`);
  element.style.display = "flex";
}

function showNoEdit(index) {
  let element = document.getElementById(`edit${index}`);
  element.style.display = "none";
}*/

function changeText(index) {
  let changeText = subtasks[index];

  renderSubtasks();

  document.getElementById(
    `subtask${index}`
  ).innerHTML = `<div class="overChangingSubtask"><input id="inputField${index}" class="changingTextInputField" value="${changeText}"><div class="overAllChange editTaskImg"><div class="centerSymbol" onclick="deleteSubtask(${index})" ><img src="assets/icons/basket.svg"></div><div class="centerSymbol" onclick="saveEditSubtask(${index})"><img src="assets/icons/check.svg"></div></div>`;

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
