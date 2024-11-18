// let users=[];

/*##########*/
/*## INIT ##*/
/*##########*/

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
    }, 900);
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

    if (screenWidth <= 950) {
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

    if (screenWidth <= 950) {
        document.documentElement.style.setProperty('--logo-color', '#ffffff');

        setTimeout(() => {
            document.documentElement.style.setProperty('--logo-color', '#2a3647');
        }, 700);
    }
}


document.getElementById('emailInput').addEventListener('input', function() {
    const emailValue = this.value.trim();
    const passwordInput = document.getElementById('passwordInput');

    if (emailValue.length > 0) {                                                     
        passwordInput.disabled = false;
    } else {                                                                         
        passwordInput.disabled = true;
    }
});
// Hier mussen wir noch integrieren das die email auch registriert seien muss bevor wir password eingeben ,ausserdem stört der addEventlistner die signUp seite 
// Dann mussen wir verhindern das wenn ich email eingegeben habe anfange die password zu schreiben und dann wieder in das email fehlde gehe das password mit zeichen bleibt oder auch nicht ?

/**
 * Displays or hides the forgot password message based on the state of the password input field.
 * If the password input field is not disabled, the forgot password message is shown by setting its opacity to 1.
 * If the password input field is disabled, the message is hidden by setting its opacity to 0.
 *
 * @function showForgotPasswordMsg
 */
function showForgotPasswordMsg() {
    const forgotPasswordElement = document.getElementById('forgotPassword');
    const passwordInput = document.getElementById('passwordInput');

    if (forgotPasswordElement) {
        if (passwordInput && !passwordInput.disabled) {
            forgotPasswordElement.style.opacity = '1';
        } else {
            forgotPasswordElement.style.opacity = '0';
        }
    }
}


/**
 * Adds an input event listener to the element with the ID 'emailInput'.
 * Enables or disables the password input field based on the value entered in the email input field.
 * If the email input field contains text, the password input field is enabled. If the email input field is empty,
 * the password input field is disabled and the forgot password message's opacity is set to 0, hiding it.
 */
document.getElementById('emailInput').addEventListener('input', function() {
    const emailValue = this.value.trim();
    const passwordInput = document.getElementById('passwordInput');

    if (emailValue.length > 0) {
        passwordInput.disabled = false;
    } else {
        passwordInput.disabled = true;
        const forgotPasswordElement = document.getElementById('forgotPassword');
        if (forgotPasswordElement) {
            forgotPasswordElement.style.opacity = '0';
        }
    }
});

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

/**
 * Masks the password input values for specified input fields.
 * It loops over an array of input elements and calls `supportForMaskPassword` to manage
 * the masking behavior based on the current value and state of the input.
 *
 * @function maskPassword
 */
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

/**
 * Toggles the display of lock and eye icons based on the input field's value.
 * If the input has a value, the lock image is hidden and the eye-off image is shown,
 * while the eye-on image is hidden. If the input is empty, the lock image is displayed.
 *
 * @function eyeLockVariations
 * @param {HTMLInputElement} input - The input element being evaluated.
 * @param {HTMLElement} lockImg - The lock image element.
 * @param {HTMLElement} eyeOffImg - The eye-off image element (closed eye icon).
 * @param {HTMLElement} eyeOnImg - The eye-on image element (open eye icon).
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
 * Toggles the visibility of lock and eye icons for password input fields.
 * It loops through a list of specified input fields and calls `eyeLockVariations` to adjust the icons.
 *
 * @function togglePasswordImg
 */
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

/**
 * Opens the eye (show password) for password input fields.
 * When the eye-on icon is shown, the actual value of the input is revealed.
 *
 * @function openEyePassword
 */
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

/**
 * Closes the eye (mask password) for password input fields.
 * When the eye-off icon is shown, the password value is masked.
 *
 * @function closeEyePassword
 */
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
        let user = getUserByEmail(emailInputLogin);
        let rememberMeInputElem = document.getElementById('rememberCheckbox');
        let rememberMeItem = rememberMeInputElem.checked ? user.id : null;
        loginMPA(user.id, rememberMeItem);

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
    console.warn('Kein Login möglich'); ///DEBUG
    logFlagsLogin(); ///DEBUG
    logVarsLogin(); ///DEBUG

    handleValidationResult(emailInput, passwordInput, flags, errorMessage);
}

/**
 * Main login function that initializes and processes the login.
 *
 * @function login
 */
function login() {
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
 * Removes the input error styling from email and password input fields.
 * Also hides the error message by setting its opacity to 0 if it exists.
 *
 * @function removeInputError
 */
function removeInputError() {
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.querySelector('.error-input-message');

    emailInput.classList.remove('input-error');
    passwordInput.classList.remove('input-error');

    if (errorMessage) {
        errorMessage.style.opacity = '0'; 
    }
}















