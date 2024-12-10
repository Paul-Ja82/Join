let users = [];

/**
 * Initializes the signup process by loading users, setting up the multi-page application (MPA),
 * initializing forms, adding validation rules, and attaching submit handlers.
 */
function initSignup() {
    loadUsers();
    initMPA();
    initForms();
    addValidation('signUpForm', isEmailAvailable, 'emailVmsg', 'You already have an account');
    addValidation('signUpForm', isPasswordConfirm, 'confirmPwVmsg', 'The passwords dont match');
    addSubmitHandler('signUpForm', addUser);
    addSubmitHandler('signUpForm', afterSignupHandler);
}

/**
 * Asynchronously loads user data from a specified path and adds it to the global users array.
 * @async
 */
async function loadUsers() {
    let usersObj = await getData(USERS_PATH);
    for (let keyI in usersObj) {
        if (usersObj[keyI]) users.push(usersObj[keyI]);
    }
}

/**
 * Prevents the default behavior of the signup form's submit event.
 * Adds an event listener to stop the form from submitting normally.
 */
function preventDefaultSignUp() {
    document.getElementById('signUpForm').addEventListener('submit', event => event.preventDefault());
}

/**
 * Handles the result of validation for user login inputs.
 * Adds or removes error classes on the email and password input elements based on validation status.
 * @param {HTMLElement} emailInput - The email input element to validate.
 * @param {HTMLElement} passwordInput - The password input element to validate.
 * @param {boolean} isValidUser - Indicates whether the user is valid.
 * @param {string} errorMessage - The error message to display if validation fails.
 */
function handleValidationResult(emailInput, passwordInput, isValidUser, errorMessage) {
    if (!isValidUser) {
        emailInput.classList.add('input-error');
        passwordInput.classList.add('input-error');
    } else {
        emailInput.classList.remove('input-error');
        passwordInput.classList.remove('input-error');
    }
}

/**
 * Handles the login process by resetting flags, validating inputs, and managing session and local storage.
 * Redirects the user to the appropriate section of the application upon successful login.
 */
function loginSU() {
    resetFlagsLogin();
    loadInputValuesLogin();
    checkEmailInputLogin();
    checkValidUser();
    let flags = emailInputLoginFlag && validUserFlag;
    if (flags) {
        let user = getUserByEmail(emailInputLogin);
        let rememberMeInputElem = document.getElementById('rememberCheckbox');
        let rememberMeItem = rememberMeInputElem.checked ? user.name : null;
        if (rememberMeInputElem.checked) localStorage.setItem('loggedInUserName', user.name);
        sessionStorage.setItem('loggedInUserName', user.name);
        sessionStorage.setItem('loggedInUserId', user.id);
        loginMPA(user.id, rememberMeItem);
    } else {
        handleValidationResult(emailInput, passwordInput);
    }
}

/**
 * Logs in a guest user by setting the logged-in status and redirecting to the start page.
 */
function loginGuestSU() {
    setLoggedIn(true);
    loadPage(STARTPAGE_URL);
}

/**
 * Loads input values from the login form into global variables.
 * Retrieves the email input value and the actual password value from the dataset.
 */
function loadInputValuesLogin() {
    emailInputLogin = document.getElementById('emailInput').value;
    passwordInputLogin = document.getElementById('passwordInput').dataset.actualvalue;
}

/**
 * Checks whether the email input field has a value.
 * Sets the email input validation flag accordingly.
 */
function checkEmailInputLogin() {
    if (emailInputLogin) {
        emailInputLoginFlag = true;
    } else {
        emailInputLoginFlag = false;
    }
}

/**
 * Validates the user credentials by checking the email and password against stored data.
 * Updates the valid user flag and displays a validation message if the user is invalid.
 */
function checkValidUser() {
    let user = getUserByEmail(emailInputLogin);
    if (user) {
        if (user.pw == passwordInputLogin) validUserFlag = true;
        else {
            showInvalidUserVmsgLogin();
        }
    } else {
        validUserFlag = false;
        showInvalidUserVmsgLogin();
    }
}

/**
 * Displays the invalid user validation message for the login process.
 * Makes the validation message visible by adjusting the opacity.
 */
function showInvalidUserVmsgLogin() {
    let vmsgElem = document.getElementById('vmsgPwLogin');
    vmsgElem.style.opacity = 1;
}

/**
 * Retrieves a user object from the users array based on their email address.
 * @param {string} email - The email address to search for.
 * @returns {Object|null} The user object if found, otherwise null.
 */
function getUserByEmail(email) {
    return users.find((userI) => userI.email == email);
}

/**
 * Retrieves a user object from the users array based on their unique ID.
 * @param {string|number} id - The ID to search for.
 * @returns {Object|null} The user object if found, otherwise null.
 */
function getUserById(id) {
    return users.find((userI) => userI.id == id);
}

/**
 * Asynchronously adds a new user to the system by generating a unique ID,
 * saving their data, and adding them to the global users array.
 * @async
 */
async function addUser() {
    let newId = await getId();
    let path = USERS_PATH + newId;
    let nameInput = document.getElementById('nameInput').value;
    let emailInput = document.getElementById('emailInput').value;
    let passwordInput = document.getElementById('signUpPasswordInput').dataset.actualvalue;
    let user = {
        id: newId,
        name: nameInput,
        email: emailInput,
        pw: passwordInput
    };
    saveData(path, user);
    users.push(user);
}

/**
 * Resets the login validation flags for email input and user validity.
 * Ensures a clean state before processing login validation.
 */
function resetFlagsLogin() {
    emailInputLoginFlag = false;
    validUserFlag = false;
}

/**
 * Handles actions after the signup process is completed.
 * Displays a toast notification and redirects to the index page.
 */
function afterSignupHandler() {
    showToast('signupToast', () => loadPage(INDEXPAGE_URLS[0]));
}

/**
 * Checks asynchronously if the email entered in the signup form is available.
 * Searches for a user with the provided email and returns the availability status.
 * @async
 * @returns {Promise<boolean>} A promise resolving to true if the email is available, otherwise false.
 */
async function isEmailAvailable() {
    let emailInput = document.getElementById('emailInput').value;
    let user = await getUserByEmail(emailInput);
    if (user) { 
        return false;
    } else {
        
        return true;
    }
}

/**
 * Verifies whether the password and password confirmation inputs match.
 * Compares the actual values of the password fields and returns the result.
 * @returns {boolean} True if the passwords match, otherwise false.
 */
function isPasswordConfirm() {
    let passwordInput = document.getElementById('signUpPasswordInput').dataset.actualvalue;
    let passwordInputConfirm = document.getElementById('confirmPasswordInput').dataset.actualvalue; 
    return passwordInput == passwordInputConfirm;
}

/**
 * Handles the visual validation for password confirmation matching.
 * Adds or removes error classes and adjusts the visibility of the error message based on the match status.
 */
function handlePasswordMatchConfirm() {
    if (false) {
        passwordConfirmInput.classList.add('input-error');

        if (errorMessage) {
            errorMessage.style.opacity = '1';
        }
    } else {
        passwordConfirmInput.remove('input-error');

        if (true) {
            errorMessage.style.opacity = '0';
        }
    }
}

/**
 * Provides support for masking the confirmation password input field.
 * Updates the actual value and adjusts the displayed value based on user input and the visibility state of the password.
 * @param {HTMLInputElement} input - The password input element.
 * @param {string} actualValue - The actual value of the password without masking.
 * @returns {string} The updated actual value of the password.
 */
function supportForConfirmMaskPassword(input, actualValue) {
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
 * Masks the confirm password input field by replacing its visible value with masked characters
 * and storing the actual value in a dataset attribute.
 */
function maskConfirmPassword() { 
    const input = document.getElementById("confirmPasswordInput");

    if (input) {
        let actualvalue = input.dataset.actualvalue || "";
        actualvalue = supportForConfirmMaskPassword(input, actualvalue);
        input.dataset.actualvalue = actualvalue;
    }
}

/**
 * Toggles the display of lock and eye icons for the confirm password field based on the input's content.
 * Manages the visibility of lock, eye-off, and eye-on icons according to the state of the password field.
 * @param {HTMLInputElement} input - The confirm password input element.
 * @param {HTMLElement} lockImg - The lock icon element.
 * @param {HTMLElement} eyeOffImg - The eye-off icon element.
 * @param {HTMLElement} eyeOnImg - The eye-on icon element.
 */
function eyeLockVariationsForConfirm(input, lockImg, eyeOffImg, eyeOnImg) {
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
 * Toggles the visibility state of the password-related icons (lock, eye-off, eye-on)
 * for the confirm password input field based on the input's content.
 */
function togglePasswordImgForConfirm() {
    const input = document.getElementById("confirmPasswordInput");

    if (input) {
        let lockImg = input.parentElement.querySelector('.password-Img');
        let eyeOffImg = input.parentElement.querySelector('.password-Img-eye-of');
        let eyeOnImg = input.parentElement.querySelector('.password-Img-eye-on');

        eyeLockVariationsForConfirm(input, lockImg, eyeOffImg, eyeOnImg);
    }
}

/**
 * Opens the "eye" icon for the confirm password input, revealing the actual password value.
 * Updates the input's display value to the actual password.
 */
function openEyePasswordForConfirm() {
    const input = document.getElementById("confirmPasswordInput");

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

/**
 * Closes the "eye" icon for the confirm password input, hiding the actual password value.
 * Updates the input's display value to a masked format.
 */
function closeEyePasswordForConfirm() {
    const input = document.getElementById("confirmPasswordInput");

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
