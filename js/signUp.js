let users = [];

let nameInput;
let emailInput;
let passwordInput;
let passwordConfirmInput;
let privacyInput;

let nameInputFlag = false;
let emailInputFlag = false;
let emailAvailableFlag = false;
let passwordConfirmFlag = false;
let privacyFlag = false;

let emailInputLogin;
let passwordInputLogin;

let emailInputLoginFlag = false;
let validUserFlag = false;


/*##########*/
/*## INIT ##*/
/*##########*/

/**
 * Initializes the signup process by loading existing users and initializing the Multi-Page Application (MPA).
 * This function logs a debug message to indicate its execution.
 *
 * @function initSignup
 */
function initSignup() {
    console.log('initSignup()'); ///DEBUG
    loadUsers();
    initMPA();
}


/*
function initLogin() {
    loadUsers();
    initMPA();
}
*/

/**
 * Asynchronously loads user data from a specified path and populates the users array.
 * Retrieves data using the `getData` function and pushes each valid user object to the global `users` array.
 *
 * @async
 * @function loadUsers
 * @returns {Promise<void>} - A promise that resolves once user data has been loaded.
 */
async function loadUsers() {
    let usersObj = await getData(USERS_PATH);
    for (let keyI in usersObj) {
        if (usersObj[keyI]) users.push(usersObj[keyI]);
    }
}

/**
 * Prevents the default form submission behavior for the signup form.
 * Attaches an event listener to the form element with the ID 'signUpForm' to prevent page reloads on form submission.
 *
 * @function preventDefaultSignUp
 */
function preventDefaultSignUp() {
    document.getElementById('signUpForm').addEventListener('submit', event => event.preventDefault());
}


/*###########*/
/*## LOGIN ##*/
/*###########*/

/**
 * Handles the main login process by resetting flags, loading input values,
 * and validating the email input and user credentials.
 * If the input is valid, the user is authenticated and logged in; otherwise, relevant messages are logged.
 *
 * @function login
 */
function login() {
    resetFlagsLogin();
    loadInputValuesLogin();
    checkEmailInputLogin();
    checkValidUser();
    let flags = emailInputLoginFlag && validUserFlag;
    if (flags) {
        let user = getUserByEmail(emailInputLogin);
        let rememberMeInputElem = document.getElementById('rememberCheckbox');
        let rememberMeItem = rememberMeInputElem.checked ? user.id : null;
        loginMPA(user.id, rememberMeItem);
    } else {
        console.warn('Kein Login möglich'); ///DEBUG
        logFlagsLogin(); ///DEBUG
        logVarsLogin(); ///DEBUG
    }
}

/**
 * Loads the values of email and password input fields and assigns them to global variables.
 *
 * @function loadInputValuesLogin
 */
function loadInputValuesLogin() {
    emailInputLogin = document.getElementById('emailInput').value;
    passwordInputLogin = document.getElementById('passwordInput').value;
}

/**
 * Checks if the email input field has a value and sets the email input flag accordingly.
 * If the email input is empty, logs a debug message.
 *
 * @function checkEmailInputLogin
 */
function checkEmailInputLogin() {
    if (emailInputLogin) {
        emailInputLoginFlag = true;
    } else {
        emailInputLoginFlag = false;
        console.log('please input email'); ///DEBUG
        // TODO: Display validation message
    }
}

/**
 * Validates the user based on the input email and password.
 * If a user is found and the password matches, sets the valid user flag.
 * Logs appropriate debug messages if validation fails.
 *
 * @function checkValidUser
 */
function checkValidUser() {
    let user = getUserByEmail(emailInputLogin);
    if (user) {
        if (user.password == passwordInput) validUserFlag = true;
        else {
            console.log('Passwort falsch'); ///DEBUG
        }
    } else {
        validUserFlag = false;
        console.log('Kein User-Account gefunden'); ///DEBUG
    }
}


/*#############*/
/*## SIGN UP ##*/
/*#############*/

/**
 * Handles the signup process by resetting flags, loading input values, and checking user input validity.
 * If all flags are valid, a new user is added. Otherwise, logs debug information.
 *
 * @function signup
 */
function signup() {
    console.log('signup()'); ///DEBUG
    resetFlagsSignUp();
    loadInputValuesSignUp();
    checkNameInput();
    checkEmailInput();
    checkEmailAvailable();
    checkPasswordConfirm();
    checkPrivacy();
    let flags = nameInputFlag && emailInputFlag && emailAvailableFlag && passwordConfirmFlag && privacyFlag;
    if (flags) {
        addUser();
        // loadPage('./log_in.html'); //TODO: Future implementation for redirecting to the index page?
    } else {
        console.warn('Kein Signup möglich'); ///DEBUG
        logFlags(); ///DEBUG
        logVars(); ///DEBUG
    }
}

/**
 * Checks if a user already exists based on the entered email input.
 * Logs debug messages indicating whether a user exists or can be created.
 *
 * @function isUserExisting
 * @returns {boolean} - Returns false (placeholder functionality).
 */
function isUserExisting() {
    let emailInput = document.getElementById('emailInput').value;
    let user = getUser(emailInput);
    console.log(user); ///DEBUG
    if (user) console.log('Fehler. User existiert'); ///DEBUG
    else console.log('User kann angelegt werden'); ///DEBUG
    return false;
}

/**
 * Loads input values for the signup form and assigns them to global variables.
 *
 * @function loadInputValuesSignUp
 */
function loadInputValuesSignUp() {
    nameInput = document.getElementById('nameInput').value;
    emailInput = document.getElementById('emailInput').value;
    passwordInput = document.getElementById('passwordInput').value;
    passwordConfirmInput = document.getElementById('confirmPasswordInput').value;
    privacyInput = document.getElementById('rememberCheckbox').checked;
}

/**
 * Retrieves a user object by matching the provided email with existing users.
 *
 * @function getUserByEmail
 * @param {string} email - The email address to search for.
 * @returns {Object|undefined} - The matching user object, or undefined if no match is found.
 */
function getUserByEmail(email) {
    return users.find((userI) => userI.email == email);
}

/**
 * Adds a new user to the user list by generating a unique ID and saving the user data.
 * The new user is pushed to the global users array.
 *
 * @async
 * @function addUser
 */
async function addUser() {
    console.log('addUser()'); ///DEBUG
    let newId = await getId();
    let path = USERS_PATH + newId;
    let user = {
        id: newId,
        name: nameInput,
        email: emailInput,
        pw: passwordInput
    };
    saveData(path, user);
    users.push(user);
    //TODO: Show Toast message or notification
    console.log('addUser(): User wird angelegt.', user); ///DEBUG
}

/**
 * Resets all signup-related flags to their default false values.
 *
 * @function resetFlagsSignUp
 */
function resetFlagsSignUp() {
    nameInputFlag = false;
    emailInputFlag = false;
    emailAvailableFlag = false;
    passwordConfirmFlag = false;
    privacyFlag = false;
}

/**
 * Resets all login-related flags to their default false values.
 *
 * @function resetFlagsLogin
 */
function resetFlagsLogin() {
    emailInputLoginFlag = false;
    validUserFlag = false;
}


/*################*/
/*## VALIDATION ##*/
/*################*/

/**
 * Checks if the name input has a value and sets the name input flag accordingly.
 * If the input is empty, logs a debug message.
 *
 * @function checkNameInput
 */
function checkNameInput() {
    if (nameInput) {
        nameInputFlag = true;
    } else {
        nameInputFlag = false;
        console.log('please input name'); ///DEBUG
        // TODO: Display validation message
    }
}

/**
 * Checks if the email input has a value and sets the email input flag accordingly.
 * If the input is empty, logs a debug message.
 *
 * @function checkEmailInput
 */
function checkEmailInput() {
    if (emailInput) {
        emailInputFlag = true;
    } else {
        emailInputFlag = false;
        console.log('please input email'); ///DEBUG
        // TODO: Display validation message
    }
}

/**
 * Checks if an email is available by verifying if a user already exists with the given email.
 * Sets the email availability flag and logs a debug message if the email is already in use.
 *
 * @function checkEmailAvailable
 */
function checkEmailAvailable() {
    let user = getUserByEmail(emailInput);
    if (!user) emailAvailableFlag = true;
    else {
        emailAvailableFlag = false;
        console.log('Ein User mit dieser email-Adresse existiert bereits'); ///DEBUG
    }
}

/**
 * Checks if the password and confirm password inputs match.
 * Sets the password confirmation flag accordingly and handles mismatch cases.
 *
 * @function checkPasswordConfirm
 */
function checkPasswordConfirm() {
    const passwordInput = document.getElementById('passwordInput').value;
    const passwordConfirmInput = document.getElementById('confirmPasswordInput').value;
    if (passwordInput === passwordConfirmInput) {
        passwordConfirmFlag = true;
    } else {
        passwordConfirmFlag = false;
        console.log('Die Passwörter sind nicht gleich'); ///DEBUG
        
        handlePasswordMatchConfirm();
    }
}

/**
 * Handles the visual feedback for password confirmation mismatches.
 * Adds or removes an input error class and shows or hides an error message accordingly.
 *
 * @function handlePasswordMatchConfirm
 */
function handlePasswordMatchConfirm() {
    const passwordConfirmInput = document.getElementById('confirmPasswordInput');
    const errorMessage = document.querySelector('.no-match-confirm-message'); 

    if (!passwordConfirmFlag) {
        passwordConfirmInput.classList.add('input-error');

        if (errorMessage) {
            errorMessage.style.opacity = '1'; 
        }
    } else {
        passwordConfirmInput.classList.remove('input-error');          

        if (errorMessage) {
            errorMessage.style.opacity = '0'; 
        }
    }
}

/**
 * Checks if the privacy policy checkbox has been accepted and sets the privacy flag.
 * Logs a debug message if the policy is not accepted.
 *
 * @function checkPrivacy
 */
function checkPrivacy() {
    privacyFlag = privacyInput;
    if (!privacyFlag) console.log('Please accept the Privacy Policy'); ///DEBUG
}

/*###########*/
/*## DEBUG ##*/
/*###########*/

/**
 * Logs the checked state of the privacy input element (checkbox) to the console.
 *
 * @function tuEsSignup
 */
function tuEsSignup() {
    let privacyInputElem = document.getElementById('rememberCheckbox');
    console.log(privacyInputElem.checked);
}

/**
 * Logs the values of various flags used in the signup process for debugging purposes.
 *
 * @function logFlags
 */
function logFlags() {
    console.log('nameInputFlag: ' + nameInputFlag); ///DEBUG
    console.log('emailInputFlag: ' + emailInputFlag); ///DEBUG
    console.log('emailAvailableFlag: ' + emailAvailableFlag); ///DEBUG    
    console.log('passwordConfirmFlag: ' + passwordConfirmFlag); ///DEBUG
    console.log('privacyFlag: ' + privacyFlag); ///DEBUG
}

/**
 * Logs the values of various input variables used in the signup process for debugging purposes.
 *
 * @function logVars
 */
function logVars() {
    console.log('nameInput: ' + nameInput); ///DEBUG
    console.log('emailInput: ' + emailInput); ///DEBUG                
    console.log('passwordInput: ' + passwordInput); ///DEBUG // Paul: hier war ein sintax Fehler (paswwordInput)
    console.log('passwordConfirmInput: ' + passwordConfirmInput); ///DEBUG
}

/**
 * Logs the values of various flags used in the login process for debugging purposes.
 *
 * @function logFlagsLogin
 */
function logFlagsLogin() {
    console.log('emailInputFlagLogin: ' + emailInputLoginFlag); ///DEBUG
    console.log('validUserFlag: ' + validUserFlag); ///DEBUG
}

/**
 * Logs the values of various input variables used in the login process for debugging purposes.
 *
 * @function logVarsLogin
 */
function logVarsLogin() {
    console.log('emailInputLoginFlag: ' + emailInputLogin); ///DEBUG    
    console.log('passwordInputLogin: ' + passwordInputLogin); ///DEBUG    
}


/**
 * Masks the input for the confirm password field by updating the visible input value
 * with masked characters or the actual value depending on the state of an associated eye icon.
 * It updates the stored actual value to reflect the current input state.
 *
 * @function supportForConfirmMaskPassword
 * @param {HTMLInputElement} input - The input element whose value is being masked.
 * @param {string} actualValue - The current actual (unmasked) value of the input.
 * @returns {string} - The updated actual value of the input.
 */
function supportForConfirmMaskPassword(input, actualValue) {
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

/**
 * Masks the confirm password input field by calling a support function to handle the masking logic.
 * Updates the input's dataset with the actual value.
 *
 * @function maskConfirmPassword
 */
function maskConfirmPassword() { 
    const input = document.getElementById("confirmPasswordInput");

    if (input) {
        let actualValue = input.dataset.actualValue || "";
        actualValue = supportForConfirmMaskPassword(input, actualValue);
        input.dataset.actualValue = actualValue;
    }
}

/**
 * Toggles the display of lock and eye icons based on the confirm password input field's value.
 * If the input has a value, the lock image is hidden and the eye-off image is shown,
 * while the eye-on image is hidden. If the input is empty, the lock image is displayed.
 *
 * @function eyeLockVariationsForConfirm
 * @param {HTMLInputElement} input - The input element being evaluated.
 * @param {HTMLElement} lockImg - The lock image element.
 * @param {HTMLElement} eyeOffImg - The eye-off image element (closed eye icon).
 * @param {HTMLElement} eyeOnImg - The eye-on image element (open eye icon).
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
 * Toggles the visibility of lock and eye icons for the confirm password input field.
 * Calls a support function to handle the display logic for the icons.
 *
 * @function togglePasswordImgForConfirm
 */
function togglePasswordImgForConfirm() {
    const input = document.getElementById("confirmPasswordInput");

    if (input) {
        var lockImg = input.parentElement.querySelector('.password-Img');
        var eyeOffImg = input.parentElement.querySelector('.password-Img-eye-of');
        var eyeOnImg = input.parentElement.querySelector('.password-Img-eye-on');

        eyeLockVariationsForConfirm(input, lockImg, eyeOffImg, eyeOnImg);
    }
}

/**
 * Opens the eye icon (reveals the confirm password) for the confirm password input field.
 * Shows the open eye icon, hides the closed eye icon, and sets the input value to its actual value.
 *
 * @function openEyePasswordForConfirm
 */
function openEyePasswordForConfirm() {
    const input = document.getElementById("confirmPasswordInput");

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

/**
 * Closes the eye icon (masks the confirm password) for the confirm password input field.
 * Shows the closed eye icon, hides the open eye icon, and masks the input value with asterisks.
 *
 * @function closeEyePasswordForConfirm
 */
function closeEyePasswordForConfirm() {
    const input = document.getElementById("confirmPasswordInput");

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

