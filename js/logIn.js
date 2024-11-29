/**
 * Initializes the login functionality by performing the necessary setup steps.
 * 
 * Steps performed:
 * 1. Calls `loadUsers()` to load user data (e.g., from a server or local storage).
 * 2. Calls `initMPA()` to initialize the Multi-Page Application (MPA) functionality.
 */
function initLogin() {
    loadUsers();
    initMPA();
}

/**
 * Animates the logo element by adding CSS classes to control its position and animation.
 * The function selects an element with the class `j-logo-img` and adds a `start-position` class immediately.
 * After a 500ms delay, it adds an `animate-logo` class to trigger further animations.
 *
 * @function animateLogo
 */
function animateLogo() {
    const logo = document.querySelector(".j-logo-img");
    logo.classList.add("start-position");
    setTimeout(function() {
        logo.classList.add("animate-logo");
    }, 500);
}

document.addEventListener("DOMContentLoaded", function() {
    
});

/**
 * Delays the display of elements on the page by changing their opacity and visibility properties.
 * The function targets elements with the classes `log-in-div`, `sign-up-under-div`, and the `footer` element,
 * making them fully visible after a delay of 900 milliseconds.
 *
 * @function showDivsDelayed
 */
function showDivsDelayed() {
    const logIn = document.querySelector(".log-in-div");
    const signUpDiv = document.querySelector(".sign-up-under-div");
    const footer = document.querySelector("footer");

    setTimeout(() => {
        logIn.style.opacity = "1";
        logIn.style.visibility = "visible";
        signUpDiv.style.opacity = "1";
        signUpDiv.style.visibility = "visible";
        footer.style.opacity = "1";
        footer.style.visibility = "visible";
    }, 1000);
}

/**
 * Changes the background color of the body element based on screen width.
 * If the screen width is less than or equal to 950 pixels, it changes the body's background color to a dark color,
 * then reverts it back to a light color after a 700ms delay.
 *
 * @function colorBody
 */
function colorBody() {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 1010) {
        const body = document.body;

        body.style.backgroundColor = "rgba(9, 25, 49, 1)";

        setTimeout(() => {
            body.style.backgroundColor = "rgb(246,247,248,1)";
        }, 700);
    }
}

/**
 * Changes the custom CSS property `--logo-color` based on screen width.
 * If the screen width is less than or equal to 950 pixels, it changes the `--logo-color` to white,
 * then reverts it to a dark color after a 700ms delay.
 *
 * @function colorLogo
 */
function colorLogo() {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 1010) {
        document.documentElement.style.setProperty('--logo-color', '#ffffff');

        setTimeout(() => {
            document.documentElement.style.setProperty('--logo-color', '#2a3647');
        }, 700);
    }
}

/**
 * Controls the visibility of the forgot password message based on the email input value.
 * If the input matches a valid email format, the message is shown; otherwise, it is hidden.
 */
function showForgotPasswordMsg() {
    const emailInput = document.getElementById('emailInput');
    const forgotPassword = document.getElementById('forgotPassword'); 

    if (emailInput && forgotPassword) {
        const emailValue = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailPattern.test(emailValue)) {
            forgotPassword.style.opacity = '1'; 
        } else {
            forgotPassword.style.opacity = '0'; 
        }
    }
}


/**
 * Displays a message indicating incorrect email format by setting the opacity
 * of elements with the 'incorrect-email-format' class to 1 and adding the 
 * 'input-error' class to the email input field.
 */
function showIncorrectFormatMsg() {
    let elements = document.querySelectorAll('.incorrect-email-format');
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.opacity = '1';
    }

    let emailInput = document.getElementById('emailInput');
    if (emailInput) {
        emailInput.classList.add('input-error');
    }
}

/**
 * Enables or disables the password input field based on the validity of the email input.
 * If the email input is empty, contains less than one character, or does not match the expected email format,
 * the password input is disabled and an error message is displayed using the showIncorrectFormatMsg function.
 */
function ablePasswordInput() {
    let emailInput = document.getElementById('emailInput');
    let passwordInput = document.getElementById('passwordInput');

    if (emailInput) {
        let emailValue = emailInput.value.trim();
        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

        if (emailPattern.test(emailValue) && emailValue.length > 0) {
            passwordInput.disabled = false; 
        } else {
            passwordInput.disabled = true; 
            showIncorrectFormatMsg(); 
        }
    }
}

/**
 * Shows the "not registered" message by setting elements with the class "not-registered-msg" to an opacity of 1
 * and adds the 'input-error' class to the email input element.
 */
function showNotRegisteredMsg() {
    const elements = document.querySelectorAll('.not-registered-msg');
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.opacity = '1';
    }

    const emailInput = document.getElementById('emailInput');
    if (emailInput) {
        emailInput.classList.add('input-error'); 
    }
}

/**
 * Checks if the user exists by testing the email input value.
 * If the user exists, the function redirects to 'new_password.html'.
 */
function checkUserExist() {
    const emailInput = document.getElementById('emailInput');
    if (emailInput) {
        const emailValue = emailInput.value.trim();
        const user = getUserByEmail(emailValue);

        if (user) {
            // window.location.href = 'new_password.html'; 
            window.location.href = 'new_password.html' + `?id=${user.id}`; 
        } else {
            showNotRegisteredMsg();
        }
    }
}

/**
 * Finds a user by their email address.
 * @param {string} email - The email address to search for.
 * @returns {Object|undefined} - The user object if found, otherwise undefined.
 */
function getUserByEmail(email) {
    return users.find((userI) => userI.email == email);
}

/**
 * Displays a message for incorrect email format and highlights the email input field.
 * Applies a visible error message and adds an error class to the input field.
 */
function showIncorrectFormatMsg() {
    let elements = document.querySelectorAll('.incorrect-email-format');
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.opacity = '1';
    }

    let emailInput = document.getElementById('emailInput');
    if (emailInput) {
        emailInput.classList.add('input-error');
    }
}

/**
 * Initializes the login process by resetting flags, loading input values,
 * and checking the validity of email input and user data.
 *
 * @function initializeLogin
 */
function initializeLogin() {
    resetFlagsLogin();
    loadInputValuesLogin();
    checkEmailInputLogin();
    checkValidUser();
}

/**
 * Handles the main processing of the login flow.
 * If flags are valid, retrieves the user and logs in.
 * Otherwise, handles login failure.
 *
 * @function supportForProcess
 * @param {boolean} flags - Indicates whether the login input and user data are valid.
 * @param {HTMLInputElement} emailInput - The email input element.
 * @param {HTMLInputElement} passwordInput - The password input element.
 * @param {HTMLElement} errorMessage - The error message element.
 */
function supportForProcess(flags, emailInput, passwordInput, errorMessage) {
    if (flags) {
        let user = getUserByEmail(emailInput);
        let rememberMeInputElem = document.getElementById('rememberCheckbox');
        let rememberMeItem = rememberMeInputElem.checked ? user.id : null;
        loginMPA(user.id, rememberMeItem);
        if (rememberMeInputElem.checked) localStorage.setItem('loggedInUserName', user.name);
        sessionStorage.setItem('loggedInUserName', user.name);
        sessionStorage.setItem('loggedInUserId', user.id);
    } else {
        handleLoginFailure(emailInput, passwordInput, flags, errorMessage);
    }
}

/**
 * Processes the login by checking flags and calling the support function.
 *
 * @function processLogin
 */
function processLogin() {
    let flags = emailInputLoginFlag && validUserFlag;
    let emailInput = document.getElementById('emailInput');
    let passwordInput = document.getElementById('passwordInput');
    let errorMessage = document.querySelector('.error-input-message');

    supportForProcess(flags, emailInput, passwordInput, errorMessage);
}

/**
 * Handles the case when login fails by showing appropriate messages and logging debug info.
 *
 * @function handleLoginFailure
 * @param {HTMLInputElement} emailInput - The email input element.
 * @param {HTMLInputElement} passwordInput - The password input element.
 * @param {boolean} flags - Indicates whether the login input and user data are valid.
 * @param {HTMLElement} errorMessage - The error message element.
 */
function handleLoginFailure(emailInput, passwordInput, flags, errorMessage) {
    logFlagsLogin();
    logVarsLogin(); 

    handleValidationResult(emailInput, passwordInput, flags, errorMessage);
}

/**
 * Main login function that initializes and processes the login.
 *
 * @function login
 */
function login() {
    console.log('login()'); 
    initializeLogin();
    processLogin();
}

/**
 * Handles validation results by adding or removing error classes and setting error message visibility.
 *
 * @function handleValidationResult
 * @param {HTMLInputElement} emailInput - The email input element.
 * @param {HTMLInputElement} passwordInput - The password input element.
 * @param {boolean} isValidUser - Indicates whether the user data is valid.
 * @param {HTMLElement} errorMessage - The error message element.
 */
function handleValidationResult(emailInput, passwordInput, isValidUser, errorMessage) {
    
    if (!isValidUser) {
        emailInput.classList.add('input-error');
        passwordInput.classList.add('input-error');

        if (errorMessage) {
            errorMessage.style.opacity = '1'; 
        }
    } else {
        emailInput.classList.remove('input-error');
        passwordInput.classList.remove('input-error');

        if (errorMessage) {
            errorMessage.style.opacity = '0'; 
        }
    }
}
/**
 * Removes input error states and restores the enabled state of the password input field.
 * This function removes the 'input-error' class from the email and password input fields,
 * hides any displayed error messages by setting their opacity to 0, and re-enables the password input.
 */
function removeInputError() {
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.querySelector('.error-input-message');
    const incorrectMessage = document.querySelector('.incorrect-email-format');
    const notRegisteredMessage = document.querySelector('.not-registered-msg');

    emailInput.classList.remove('input-error');
    passwordInput.classList.remove('input-error');
    passwordInput.disabled = false;
    if (errorMessage) {
        errorMessage.style.opacity = '0'; 
    }
    if (incorrectMessage) {
        incorrectMessage.style.opacity = '0'; 
    }
    if (notRegisteredMessage) {
        notRegisteredMessage.style.opacity = '0'; 
    }
}














