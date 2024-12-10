let currentUser;

/**
 * Initializes the join functionality by setting up MPA, dialogs, and loading contacts.
 * @async
 * @function
 */
async function initJoin() {
  initMPA();
  initDialog();
  await loadContacts();
}

/**
 * Loads contact data, processes it into an array, and sorts it by name.
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
 * Placeholder for obtaining a person's icon.
 * @function
 * @param {number|string} id - The ID of the person.
 */
function getPersonIcon(id) {}

/**
 * Sorts the contacts array alphabetically by name.
 * @function
 */
function sortContactsByName() {
  contacts.sort((contactI, contactJ) => contactI.name.localeCompare(contactJ.name));
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
 * Gets the next ASCII character of the first letter of a string.
 * @function
 * @param {string} text - The input string.
 * @returns {string} The next ASCII character in uppercase.
 */
function getNextASCIIchar(text) {
  let char = getFirstLetter(text).toUpperCase();
  return String.fromCharCode(char.charCodeAt(0) + 1).toUpperCase();
}

/**
 * Handles the masking of password input fields by updating the visible input value
 * with masked characters or the actual value depending on the state of an associated eye icon.
 * It updates the stored actual value to reflect the current input state.
 *
 * @function supportForMaskPassword
 * @param {HTMLInputElement} input - The input element whose value is being masked.
 * @param {string} actualValue - The current actual (unmasked) value of the input.
 * @returns {string} - The updated actual value of the input.
 */
function supportForMaskPassword(input, actualValue) {
  const lastChar = input.value.slice(-1);
  if (input.value.length < actualValue.length) {
      actualValue = actualValue.slice(-1, input.value.length);
  } else {
      actualValue += lastChar;
  }
  const eyeOnImg = input.parentElement.querySelector('.password-Img-eye-on'); 
  if (eyeOnImg && eyeOnImg.style.display === 'block') {
      input.value = actualValue;
  } else {
      input.value = '✶'.repeat(actualValue.length);
  }

  return actualValue;
}

/**
 * Masks the password input fields by replacing their displayed values with masked characters
 * and storing the actual values in a dataset attribute.
 */
function maskPassword() {
  const inputs = [
      document.getElementById("passwordInput"),
      document.getElementById("signUpPasswordInput")
  ];

  for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      if (input) {
          let actualvalue = input.dataset.actualvalue || "";
          actualvalue = supportForMaskPassword(input, actualvalue);
          input.dataset.actualvalue = actualvalue;
      }
  }
}

/**
 * Toggles the visibility of the password-related icons (lock, eye-off, eye-on)
 * for the specified input fields based on their state.
 */
function togglePasswordImg() {
  const inputs = [
      document.getElementById("passwordInput"),
      document.getElementById("signUpPasswordInput"),
  ];

  for (let i = 0; i < inputs.length; i++) {
      let input = inputs[i];
      if (input) {
          let lockImg = input.parentElement.querySelector('.password-Img');
          let eyeOffImg = input.parentElement.querySelector('.password-Img-eye-of');
          let eyeOnImg = input.parentElement.querySelector('.password-Img-eye-on');

          eyeLockVariations(input, lockImg, eyeOffImg, eyeOnImg);
      }
  }
}

/**
 * Reveals the actual password values for the specified input fields by
 * updating the input's display value and toggling the visibility of the eye icons.
 */
function openEyePassword() {
  const inputs = [
      document.getElementById("passwordInput"),
      document.getElementById("signUpPasswordInput")
  ];

  for (let i = 0; i < inputs.length; i++) {
      let input = inputs[i];
      if (input) {
          let eyeOffImg = input.parentElement.querySelector('.password-Img-eye-of');
          let eyeOnImg = input.parentElement.querySelector('.password-Img-eye-on');

          if (eyeOffImg && eyeOnImg) {
              eyeOffImg.style.display = 'none';
              eyeOnImg.style.display = 'block';
              input.value = input.dataset.actualvalue || ""; 
          }
      }
  }
}

/**
 * Hides the actual password values for the specified input fields by
 * replacing the display value with masked characters and toggling the visibility of the eye icons.
 */
function closeEyePassword() {
  const inputs = [
      document.getElementById("passwordInput"),
      document.getElementById("signUpPasswordInput")
  ];

  for (let i = 0; i < inputs.length; i++) {
      let input = inputs[i];
      if (input) {
          let eyeOffImg = input.parentElement.querySelector('.password-Img-eye-of');
          let eyeOnImg = input.parentElement.querySelector('.password-Img-eye-on');

          if (eyeOffImg && eyeOnImg) {
              eyeOffImg.style.display = 'block';
              eyeOnImg.style.display = 'none'; 
              input.value = '✶'.repeat(input.dataset.actualvalue ? input.dataset.actualvalue.length : 0);
          }
      }
  }
}

/**
 * Toggles the visibility of lock and eye icons for password inputs based on the input's content.
 * If the input contains text, the lock icon is hidden and the eye-off icon is shown.
 * Otherwise, the lock icon is displayed, and the eye icons are hidden.
 * @param {HTMLInputElement} input - The password input field.
 * @param {HTMLElement} lockImg - The lock icon element.
 * @param {HTMLElement} eyeOffImg - The eye-off icon element.
 * @param {HTMLElement} eyeOnImg - The eye-on icon element.
 */
function eyeLockVariations(input, lockImg, eyeOffImg, eyeOnImg) {
  if (input.value.length > 0) {
      if (lockImg) lockImg.style.display = 'none';
      if (eyeOffImg) eyeOffImg.style.display = 'block';
      if (eyeOnImg) eyeOnImg.style.display = 'none';
  } else {
      if (lockImg) lockImg.style.display = 'block';
      if (eyeOffImg) eyeOffImg.style.display = 'none';
      if (eyeOnImg) eyeOnImg.style.display = 'none';
  }
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
 * Deletes a user by their ID and logs the updated list of users.
 * @function
 * @param {number|string} userId - The ID of the user to delete.
 */
function deleteUser(userId) {
  let path = USERS_PATH + '/' + userId;
  deleteData(path)
    .then(logUsers);
}

/**
 * Toggles the display of user message and main frames.
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

