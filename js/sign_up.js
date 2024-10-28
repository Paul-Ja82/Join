let users;

let nameInput;
let emailInput;
let passwordInput;
let passwordConfirmInput;

let nameInputFlag= false;
let emailInputFlag= false;
let emailAvailableFlag= false;
let passwordConfirmFlag= false;

/*##########*/
/*## INIT ##*/
/*##########*/

function initSignup() {
    loadUsers();
}

async function loadUsers() {
    users= await getData(USERS_PATH);
}

/*#############*/
/*## SIGN UP ##*/
/*#############*/

function signup() {
    loadInputValuesSingUp();
    checkNameInput();
    checkEmailInput();
    checkEmailAvailable();
    checkPasswordConfirm();
    let flags= nameInputFlag && emailInputFlag && emailAvailableFlag && passwordConfirmFlag;
    if (flags) {
        console.log('signup kann stattfinden'); ///DEBUG
    } else {
        console.warn('Kein Signup möglich'); ///DEBUG
        logFlags(); ///DEBUG
        logVars(); ///DEBUG
    }
}

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

function loadInputValuesSignUp() {   
    console.log('loadInputValuesSignup()'); ///DEBUG
    nameInput= document.getElementById('nameInput').value;
    // emailInput= document.getElementById('emailInput').value;
    let emailInputElem= document.getElementById('emailInput');
    console.log(emailInputElem); ///DEBUG
    emailInput= emailInputElem.value;
    console.log(emailInput); ///DEBUG
    passwordInput= document.getElementById('passwordInput').value;
    passwordConfirmInput= document.getElementById('confirmPasswordInput').value;
}

function getUserByEmail(email) {
    return users.find((userI)=> userI.email == email);
}

/*################*/
/*## VALIDATION ##*/
/*################*/

function checkNameInput() {
    if (nameInput) {
        nameInputFlag= true;
    } else {
        nameInputFlag= false;
        console.log('please input name'); ///DEBUG
        // TODO Validation-Message anzeigen
    }
}

function checkEmailInput() {
    if (emailInput) {
        emailInputFlag= true;
    } else {
        emailInputFlag= false;
        console.log('please input email'); ///DEBUG
        // TODO Validation-Message anzeigen
    }
}

function checkEmailAvailable() {
    let user= getUserByEmail(emailInput);
    console.log(user); ///DEBUG
    if (!user) emailAvailableFlag= true;
    else {
        emailAvailableFlag= false;
        console.log('Ein User mit dieser email-Adresse existiert bereits'); ///DEBUG
    }
}

function checkPasswordConfirm() {
    if (passwordInput == passwordConfirmInput) passwordConfirmFlag= true;
    else {
        passwordConfirmFlag= false;
        console.log('Die Passwörter sind nicht gleich'); ///DEBUG
    }
}

/*###########*/
/*## DEBUG ##*/
/*###########*/

function tuEsSignup() {
    loadInputValuesSignUp();
    checkEmailAvailable();
}

function logFlags() {
    console.log(nameInputFlag); ///DEBUG
    console.log(Flag); ///DEBUG
    console.log(emailAvailableFlag); ///DEBUG    
    console.log(passwordConfirmFlag); ///DEBUG
}

function logVars() {
    console.log(nameInput); ///DEBUG
    console.log(emailInput); ///DEBUG
    console.log(passwordInput); ///DEBUG    
    console.log(passwordConfirmInput); ///DEBUG
}