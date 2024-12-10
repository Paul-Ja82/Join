let currentUser;

/**
 * Initializes the join functionality by setting up MPA, dialogs, and loading user data and contacts.
 * @async
 * @function
 */
async function initJoin() {
  initMPA();
  initDialog();
  await loadCurrentUser();
  await loadContacts();
}

/**
 * Loads and processes contact data, sorting them by name.
 * @async
 * @function
 */
async function loadContacts() {
  contacts = [];
  let path = CONTACTS_PATH;
  let contactsObj = await getData(path);
  for (let contactObjKey in contactsObj) {
    contacts.push(contactsObj[contactObjKey]);
  }
  sortContactsByName();
}

/**
 * Loads the currently logged-in user's data.
 * @async
 * @function
 */
async function loadCurrentUser() {
  let userId = getLoggedIn();
  let path = USERS_PATH + userId;
  currentUser = await getData(path);
}

let contacts = [];

/**
 * Retrieves a contact by its ID.
 * @function
 * @param {number|string} id - The ID of the contact.
 * @returns {Object|undefined} The contact object or undefined if not found.
 */
function getContactById(id) {
  return contacts.find((contactI) => contactI.id == id);
}

/**
 * Retrieves a contact by its email address.
 * @function
 * @param {string} email - The email of the contact.
 * @returns {Object|undefined} The contact object or undefined if not found.
 */
function getContactByEmail(email) {
  return contacts.find((contactI) => contactI.email == email);
}

/**
 * Placeholder for retrieving a person's icon.
 * @function
 * @param {number|string} id - The ID of the person.
 */
function getPersonIcon(id) {}

/**
 * Sorts the contacts array alphabetically by name if it contains more than one contact.
 * @function
 */
function sortContactsByName() {
  if (contacts.length > 1) {
    contacts.sort((contactI, contactJ) => contactI.name.localeCompare(contactJ.name));
  }
}

/**
 * Gets the first letter of a given string.
 * @function
 * @param {string} text - The input string.
 * @returns {string} The first letter of the string.
 */
function getFirstLetter(text) {
  return text.charAt(0);
}

/**
 * Gets the next ASCII character of the first letter of a string in uppercase.
 * @function
 * @param {string} text - The input string.
 * @returns {string} The next ASCII character in uppercase.
 */
function getNextASCIIchar(text) {
  let char = getFirstLetter(text).toUpperCase();
  return String.fromCharCode(char.charCodeAt(0) + 1).toUpperCase();
}
/**
 * Logs all users to the console.
 * @function
 */
function logUsers() {
  getData(USERS_PATH)
    .then(users => console.log(users));
}

/**
 * Deletes a user by ID and logs the updated user list.
 * @function
 * @param {number|string} userId - The ID of the user to delete.
 */
function deleteUser(userId) {
  let path = USERS_PATH + '/' + userId;
  deleteData(path)
    .then(logUsers);
}

/**
 * Toggles the display between user message and main frame.
 * @function
 */
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
