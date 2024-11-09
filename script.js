// const BASE_URL= "https://join-8e7b1-default-rtdb.europe-west1.firebasedatabase.app/";
let subtasks = [];

async function loadData(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  console.log(responseToJson);
}

async function postData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      // Korrigiert: headers statt header
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  let responseToJson = await response.json();
  console.log(responseToJson); // Optional: Ausgabe zur Überprüfung
}

/* async function saveData() {
  // let dueDate = document.getElementById("date").value;
  // let priority =
  //   document.querySelector(".prioButtons.active")?.innerText || "Medium";
  // let category = document.getElementById("category").value;
  // let subtasks = document.getElementById("subtasks").value;

  let taskData = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    assignedTo: document.getElementById("assignedTo").value,
  };

  console.log(taskData);
  postData((path = "/tasks"), (data = taskData)); // Daten werden an Firebase gesendet
} */

function saveSubtasks(params) {
  let textSubtask = document.getElementById("subtasks").value;
  subtasks.push(textSubtask);
  document.getElementById("subtasks").value = "";
  document.getElementById("symbolsSubtasks").innerHTML = "+";
  console.log(subtasks);
}

function changeSymbols() {
  document.getElementById("symbolsSubtasks").innerHTML = "";
  document.getElementById(
    "symbolsSubtasks"
  ).innerHTML = `<div onclick="clearInput()">X</div><div onclick="saveSubtasks()">J</div>`;
}

function clearInput() {
  document.getElementById("subtasks").value = "";
  document.getElementById("symbolsSubtasks").innerHTML = "+";
}

/*##########*/
/*## INIT ##*/
/*##########*/

let currentUser;

async function initJoin() {
  initMPA();
  initDialog();
  await loadCurrentUser();
  await loadContacts();
}

async function loadContacts() {
  contacts= [];
  let path= CONTACTS_PATH + currentUser.id + '/';
  let contactsObj= await getData(path);
  for (let contactObjKey in contactsObj) {
    contacts.push(contactsObj[contactObjKey]);
  }
}

async function loadCurrentUser() {
  let userId= getLoggedIn();
  let path= (USERS_PATH) + userId;
  currentUser= await getData(path);
}

/*##############*/
/*## CONTACTS ##*/
/*##############*/

let contacts= [];

function getContactById(id) {
  return contacts.find(contactI => contactI.id == id);
}

function getContactByEmail(email) {
  return contacts.find(contactI => contactI.email == email);
}

/*##########*/
/*## MISC ##*/
/*##########*/

function getFirstLetter(text) {
  return text.charAt(0);
}

function getNextASCIIchar(text) {
  let char= getFirstLetter(text).toUpperCase();
  console.log(char); ///DEBUG
  return String.fromCharCode(char.charCodeAt(0) + 1).toUpperCase();
}