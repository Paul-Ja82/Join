let users = [];

/*
let emailInputLogin;
let passwordInputLogin;

let emailInputLoginFlag = false;
let validUserFlag = false;
*/


/*##########*/
/*## INIT ##*/
/*##########*/

function initSignup() {
    loadUsers();
    initMPA();
    initForms();
    addValidation('signUpForm', isEmailAvailable, 'emailVmsg', 'You already have an account');
    addValidation('signUpForm', isPasswordConfirm, 'confirmPwVmsg', 'The passwords dont match');
    addSubmitHandler('signUpForm', addUser);
    addSubmitHandler('signUpForm', afterSignupHandler);
}

async function loadUsers() {
    let usersObj = await getData(USERS_PATH);
    for (let keyI in usersObj) {
        if (usersObj[keyI]) users.push(usersObj[keyI]);
    }
}

function preventDefaultSignUp() {
    document.getElementById('signUpForm').addEventListener('submit', event => event.preventDefault());
}

/*###########*/
/*## LOGIN ##*/
/*###########*/

function handleValidationResult(emailInput, passwordInput, isValidUser, errorMessage) {
    
    if (!isValidUser) {
        emailInput.classList.add('input-error');
        passwordInput.classList.add('input-error');

        console.log(emailInput, passwordInput);
    } else {
        emailInput.classList.remove('input-error');
        passwordInput.classList.remove('input-error');  //jetz funktionieren die input-error wieder 

    }
}

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

function loginGuestSU() {
    setLoggedIn(true);
    loadPage(STARTPAGE_URL);
}

function loadInputValuesLogin() {
    emailInputLogin = document.getElementById('emailInput').value;
    // passwordInputLogin = document.getElementById('passwordInput').value;
    passwordInputLogin = document.getElementById('passwordInput').dataset.actualvalue;
}

function checkEmailInputLogin() {
    if (emailInputLogin) {
        emailInputLoginFlag = true;
    } else {
        emailInputLoginFlag = false;
        // TODO Validation-Message anzeigen
    }
}

function checkValidUser() {
    let user = getUserByEmail(emailInputLogin);
    // let passwordInput= document.getElementById('passwordInput').value;
    if (user) {
        if (user.pw == passwordInputLogin) validUserFlag = true;
        else {
            showInvalidUserVmsgLogin();
        }
    } else {
        validUserFlag= false;
        showInvalidUserVmsgLogin();
    }
}

function showInvalidUserVmsgLogin() {
    let vmsgElem= document.getElementById('vmsgPwLogin');
    vmsgElem.style.opacity= 1;
}

/*#############*/
/*## SIGN UP ##*/
/*#############*/

/* function signup() {
    console.log('signup()'); ///DEBUG
    console.log(isEmailAvailable()); ///DEBUG
    // resetFlagsSignUp();
    // loadInputValuesSignUp();
    // checkNameInput();
    // checkEmailInput();
    // isEmailAvailable();
    isPasswordConfirm();
    // checkPrivacy();
    // let flags = nameInputFlag && emailInputFlag && emailAvailableFlag && passwordConfirmFlag && privacyFlag;
    if (flags) {
        addUser();
        // loadPage('./log_in.html'); //TODO wird in Zukunft Index-Page sein? 
    } else {
        console.warn('Kein Signup möglich'); ///DEBUG
    }
   addUser();
} */

/*
function isUserExisting() {
    let emailInput= document.getElementById('emailInput').value;
    let user= getUser(emailInput);
    console.log(user); ///DEBUG
    if (user) console.log('Fehler. User existiert'); ///DEBUG
    else console.log('User kann angelegt werden'); ///DEBUG
    return false;
}
*/

/*
function loadInputValuesSignUp() {
    nameInput = document.getElementById('nameInput').value;
    emailInput = document.getElementById('emailInput').value;
    passwordInput = document.getElementById('signUpPasswordInput').value;
    passwordConfirmInput = document.getElementById('confirmPasswordInput').value;
    privacyInput = document.getElementById('privacyCheckbox').checked;
}
*/

function getUserByEmail(email) {
    return users.find((userI) => userI.email == email);
}

function getUserById(id) {
    return users.find((userI) => userI.id == id);
}

async function addUser() {
    let newId = await getId();
    let path = USERS_PATH + newId;
    let nameInput= document.getElementById('nameInput').value;
    let emailInput= document.getElementById('emailInput').value;
    let passwordInput= document.getElementById('signUpPasswordInput').dataset.actualvalue;
    let user = {
        id: newId,
        name: nameInput,
        email: emailInput,
        pw: passwordInput
    };
    saveData(path, user);
    users.push(user);
}

/*
function resetFlagsSignUp() {
    nameInputFlag = false;
    emailInputFlag = false;
    emailAvailableFlag = false;
    passwordConfirmFlag = false;
    privacyFlag = false;
}
*/

function resetFlagsLogin() {
    emailInputLoginFlag = false;
    validUserFlag = false;
}

function afterSignupHandler() {
    showToast('signupToast', ()=> loadPage(INDEXPAGE_URLS[0]));
}

/*################*/
/*## VALIDATION ##*/
/*################*/

/*
function checkNameInput() {
    if (nameInput) {
        nameInputFlag = true;
    } else {
        nameInputFlag = false;
        console.log('please input name'); ///DEBUG
        // TODO Validation-Message anzeigen
    }
}
*/

/* function checkEmailInput() {
    if (emailInput) {
        emailInputFlag = true;
    } else {
        emailInputFlag = false;
        console.log('please input email'); ///DEBUG
        // TODO Validation-Message anzeigen
    }
} */

/*
function isEmailAvailable() {
    let user = getUserByEmail(emailInput);
    if (!user) emailAvailableFlag = true;
    else {
        emailAvailableFlag = false;
        console.log('Ein User mit dieser email-Adresse existiert bereits'); ///DEBUG
    }
}
*/
async function isEmailAvailable() {
    let emailInput= document.getElementById('emailInput').value;
    let user = await getUserByEmail(emailInput);
    console.log(user); ///DEBUG
    if (user) {
        console.log('user gefunden. --> false'); ///DEBUG
        return false;
    }
    else {
        console.log('kein user gefunden. --> true'); ///DEBUG
        return true;
    }
}

/* 
function isPasswordConfirm() {
    if (passwordInput == passwordConfirmInput) passwordConfirmFlag = true;
    else {
        passwordConfirmFlag = false;
        console.log('Die Passwörter sind nicht gleich'); ///DEBUG
    }
} 
*/
function isPasswordConfirm() {
    let passwordInput= document.getElementById('signUpPasswordInput').dataset.actualvalue;
    let passwordInputConfirm= document.getElementById('confirmPasswordInput').dataset.actualvalue;
    console.log(passwordInput == passwordInputConfirm); ///DEBUG
    if (passwordInput == passwordInputConfirm) return true;
    else return false;
} 

function handlePasswordMatchConfirm() {
    if (false) {
        passwordConfirmInput.classList.add('input-error');

        if (errorMessage) {
            errorMessage.style.opacity = '1'; 
        }
    } else {
        passwordConfirmInput.remove('input-error');           ///Paul noch vergleichjen mit log in JS 

        if (true) {
            errorMessage.style.opacity = '0'; 
        }
    }
}

/*
function checkPrivacy() {
    privacyFlag = privacyInput;
    if (!privacyFlag) console.log('Please accept the Privacy Policy'); ///DEBUG
}
*/

/*######################*/
/*## PASSWORD MASKING ##*/
/*######################*/

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

function maskConfirmPassword() { 
    const input = document.getElementById("confirmPasswordInput");

    if (input) {
        let actualvalue = input.dataset.actualvalue || "";
        actualvalue = supportForConfirmMaskPassword(input, actualvalue);
        input.dataset.actualvalue = actualvalue;
    }
}

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

function togglePasswordImgForConfirm() {
    const input = document.getElementById("confirmPasswordInput");

    if (input) {
        let lockImg = input.parentElement.querySelector('.password-Img');
        let eyeOffImg = input.parentElement.querySelector('.password-Img-eye-of');
        let eyeOnImg = input.parentElement.querySelector('.password-Img-eye-on');

        eyeLockVariationsForConfirm(input, lockImg, eyeOffImg, eyeOnImg);
    }
}

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
