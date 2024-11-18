

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
  contacts = [];
  let path = CONTACTS_PATH + currentUser.id + "/";
  let contactsObj = await getData(path);
  for (let contactObjKey in contactsObj) {
    contacts.push(contactsObj[contactObjKey]);
  }
  sortContactsByName();
}

async function loadCurrentUser() {
  let userId = getLoggedIn();
  let path = USERS_PATH + userId;
  currentUser = await getData(path);
}

/*##############*/
/*## CONTACTS ##*/
/*##############*/

let contacts = [];

function getContactById(id) {
  return contacts.find((contactI) => contactI.id == id);
}

function getContactByEmail(email) {
  return contacts.find((contactI) => contactI.email == email);
}

function getPersonIcon(id) {

}

function sortContactsByName() {
  contacts.sort((contactI, contactJ) => contactI.name.localeCompare(contactJ.name));
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



/*###########*/
/*## DEBUG ##*/
/*###########*/

function logUsers() {
  getData(USERS_PATH)
    .then(users => console.log(users));
}

function deleteUser(userId) {
  let path= USERS_PATH + '/' + userId;
  deleteData(path)
    .then(logUsers);
}

function toggleDisplay() {
  const userMsgFrame = document.querySelector('.user-msg-frame');
  const mainFrameDiv = document.querySelector('.main-frame-div');

  if (userMsgFrame) {
      userMsgFrame.style.display = 'none';
  }

  if (mainFrameDiv) {
      mainFrameDiv.style.display = 'block';
  }
}
