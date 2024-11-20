

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
  let path = CONTACTS_PATH;
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
  if (contacts.length > 1) {
  }
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
/*## LOGIN ##*/
/*###########*/

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
      actualValue = actualValue.slice(0, input.value.length);
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

function maskPassword() {
  const inputs = [
      document.getElementById("passwordInput"),
      document.getElementById("signUpPasswordInput")
  ];

  for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      if (input) {
          let actualValue = input.dataset.actualValue || "";
          actualValue = supportForMaskPassword(input, actualValue);
          input.dataset.actualValue = actualValue;
      }
  }
}

function togglePasswordImg() {
  const inputs = [
      document.getElementById("passwordInput"),
      document.getElementById("signUpPasswordInput"),
  ];

  for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      if (input) {
          var lockImg = input.parentElement.querySelector('.password-Img');
          var eyeOffImg = input.parentElement.querySelector('.password-Img-eye-of');
          var eyeOnImg = input.parentElement.querySelector('.password-Img-eye-on');

          eyeLockVariations(input, lockImg, eyeOffImg, eyeOnImg);
      }
  }
}

function openEyePassword() {
  const inputs = [
      document.getElementById("passwordInput"),
      document.getElementById("signUpPasswordInput")
  ];

  for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      if (input) {
          var eyeOffImg = input.parentElement.querySelector('.password-Img-eye-of');
          var eyeOnImg = input.parentElement.querySelector('.password-Img-eye-on');

          if (eyeOffImg && eyeOnImg) {
              eyeOffImg.style.display = 'none';
              eyeOnImg.style.display = 'block';

              input.value = input.dataset.actualValue || "";
          }
      }
  }
}

function closeEyePassword() {
  const inputs = [
      document.getElementById("passwordInput"),
      document.getElementById("signUpPasswordInput")
  ];

  for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      if (input) {
          var eyeOffImg = input.parentElement.querySelector('.password-Img-eye-of');
          var eyeOnImg = input.parentElement.querySelector('.password-Img-eye-on');

          if (eyeOffImg && eyeOnImg) {
              eyeOffImg.style.display = 'block';
              eyeOnImg.style.display = 'none';

              input.value = '✶'.repeat(input.dataset.actualValue ? input.dataset.actualValue.length : 0);
          }
      }
  }
}

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
