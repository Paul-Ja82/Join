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
    }
}

function loadInputValuesLogin() {
    emailInputLogin = document.getElementById('emailInput').value;
    passwordInputLogin = document.getElementById('passwordInput').value;
}

function checkEmailInputLogin() {
    if (emailInputLogin) {
        emailInputLoginFlag = true;
    } else {
        emailInputLoginFlag = false;
        console.log('please input email'); ///DEBUG
        // TODO Validation-Message anzeigen
    }
}

function checkValidUser() {
    let user = getUserByEmail(emailInputLogin);
    if (user) {
        if (user.password == passwordInput) validUserFlag = true;
        else {
            console.log('Passwort falsch'); ///DEBUG
        }
    } else {
        validUserFlag= false;
        console.log('Kein User-Account gefunden'); ///DEBUG
    }
}

/*#############*/
/*## SIGN UP ##*/
/*#############*/

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
        // loadPage('./log_in.html'); //TODO wird in Zukunft Index-Page sein? 
    } else {
        console.warn('Kein Signup möglich'); ///DEBUG
    }
}

function isUserExisting() {
    let emailInput= document.getElementById('emailInput').value;
    let user= getUser(emailInput);
    console.log(user); ///DEBUG
    if (user) console.log('Fehler. User existiert'); ///DEBUG
    else console.log('User kann angelegt werden'); ///DEBUG
    return false;
}

function loadInputValuesSignUp() {
    nameInput = document.getElementById('nameInput').value;
    emailInput = document.getElementById('emailInput').value;
    passwordInput = document.getElementById('signUpPasswordInput').value;
    passwordConfirmInput = document.getElementById('confirmPasswordInput').value;
    privacyInput = document.getElementById('rememberCheckbox').checked;
}

function getUserByEmail(email) {
    return users.find((userI) => userI.email == email);
}

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
    //TODO Show Toast
    console.log('addUser(): User wird angelegt.', user); ///DEBUG
}

function resetFlagsSignUp() {
    nameInputFlag = false;
    emailInputFlag = false;
    emailAvailableFlag = false;
    passwordConfirmFlag = false;
    privacyFlag = false;
}

function resetFlagsLogin() {
    emailInputLoginFlag = false;
    validUserFlag = false;
}

/*################*/
/*## VALIDATION ##*/
/*################*/

function checkNameInput() {
    if (nameInput) {
        nameInputFlag = true;
    } else {
        nameInputFlag = false;
        console.log('please input name'); ///DEBUG
        // TODO Validation-Message anzeigen
    }
}

function checkEmailInput() {
    if (emailInput) {
        emailInputFlag = true;
    } else {
        emailInputFlag = false;
        console.log('please input email'); ///DEBUG
        // TODO Validation-Message anzeigen
    }
}

function checkEmailAvailable() {
    let user = getUserByEmail(emailInput);
    if (!user) emailAvailableFlag = true;
    else {
        emailAvailableFlag = false;
        console.log('Ein User mit dieser email-Adresse existiert bereits'); ///DEBUG
    }
}

function checkPasswordConfirm() {
    if (passwordInput == passwordConfirmInput) passwordConfirmFlag = true;
    else {
        passwordConfirmFlag = false;
        console.log('Die Passwörter sind nicht gleich'); ///DEBUG
    }
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

function checkPrivacy() {
    privacyFlag = privacyInput;
    if (!privacyFlag) console.log('Please accept the Privacy Policy'); ///DEBUG
}

/*###########*/
/*## DEBUG ##*/
/*###########*/

function tuEsSignup() {
    getData('/users')

}

function logFlags() {
    console.log('nameInputFlag: ' + nameInputFlag); ///DEBUG
    console.log('emailInputFlag: ' + emailInputFlag); ///DEBUG
    console.log('emailAvailableFlag: ' + emailAvailableFlag); ///DEBUG    
    console.log('passwordConfirmFlag: ' + passwordConfirmFlag); ///DEBUG
    console.log('privacyFlag: ' + privacyFlag); ///DEBUG
}

function logVars() {
    console.log('nameInput: ' + nameInput); ///DEBUG
    console.log('emailInput: ' + emailInput); ///DEBUG                
    console.log('passwordInput: ' + passwordInput); ///DEBUG    Paul: hier war ein sintax Fehler (paswwordInput)
    console.log('passwordConfirmInput: ' + passwordConfirmInput); ///DEBUG
}

function logFlagsLogin() {
    console.log('emailInputFlagLogin: ' + emailInputLoginFlag); ///DEBUG
    console.log('validUserFlag: ' + validUserFlag); ///DEBUG
}

function logVarsLogin() {
    console.log('emailInputLoginFlag: ' + emailInputLogin); ///DEBUG    
    console.log('passwordInputLogin: ' + passwordInputLogin); ///DEBUG    

}

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
        let actualValue = input.dataset.actualValue || "";
        actualValue = supportForConfirmMaskPassword(input, actualValue);
        input.dataset.actualValue = actualValue;
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
        var lockImg = input.parentElement.querySelector('.password-Img');
        var eyeOffImg = input.parentElement.querySelector('.password-Img-eye-of');
        var eyeOnImg = input.parentElement.querySelector('.password-Img-eye-on');

        eyeLockVariationsForConfirm(input, lockImg, eyeOffImg, eyeOnImg);
    }
}

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
