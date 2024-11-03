/*##########*/
/*## INIT ##*/
/*##########*/

let currentUser;

async function initJoin() {
  initMPA();
  await loadCurrentUser();
  loadContacts();
}

async function loadContacts() {
  contacts = [];
  let path = CONTACTS_PATH + currentUser.id + "/";
  let contactsObj = await getData(path);
  for (let contactObjKey in contactsObj) {
    contacts.push(contactsObj[contactObjKey]);
  }
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

function getPersonIcon(id) {}
