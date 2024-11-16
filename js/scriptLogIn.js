// let users=[];

/*##########*/
/*## INIT ##*/
/*##########*/

function initLogin() {
    loadUsers();
    initMPA();
}

function animateLogo() {
    const logo = document.querySelector(".j-logo-img");
    logo.classList.add("start-position");
    setTimeout(function() {
        logo.classList.add("animate-logo");
    }, 500);
}


document.addEventListener("DOMContentLoaded", function() {
    
});


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

function colorBody() {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 1050) {
        const body = document.body;

        body.style.backgroundColor = "rgba(9, 25, 49, 1)";

        setTimeout(() => {
            body.style.backgroundColor = "rgb(246,247,248,1)";
        }, 700);
    }
}

function colorLogo() {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 1050) {
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
// Hier mussen wir noch integrieren das die email auch registriert seien muss bevor wir password eingeben 
// Dann mussen wir verhindern das wenn ich email eingegeben habe anfange die password zu schreiben und dann wieder in das email fehlde gehe das password mit zeichen bleibt oder auch nicht ?

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

function login() {
    resetFlagsLogin();
    loadInputValuesLogin();
    checkEmailInputLogin();
    checkValidUser();
    let flags = emailInputLoginFlag && validUserFlag;
    let emailInput = document.getElementById('emailInput');
    let passwordInput = document.getElementById('passwordInput');
    let errorMessage = document.querySelector('.error-input-message');

    if (flags) {
        let user = getUserByEmail(emailInputLogin);
        let rememberMeInputElem = document.getElementById('rememberCheckbox');
        let rememberMeItem = rememberMeInputElem.checked ? user.id : null;
        loginMPA(user.id, rememberMeItem);

        sessionStorage.setItem('loggedInUserName', user.name);
        sessionStorage.setItem('loggedInUserId', user.id);
    } else {
        console.warn('Kein Login möglich'); ///DEBUG
        logFlagsLogin(); ///DEBUG
        logVarsLogin(); ///DEBUG

        handleValidationResult(emailInput, passwordInput, flags, errorMessage);
    }
}

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


/*function validateUser(email, password) {
    let userExists = false;
    let loggedInUser = null;

    for (let i = 0; i < dummyDatabase.length; i++) {
        if (dummyDatabase[i].email === email && dummyDatabase[i].password === password) {
            userExists = true;
            loggedInUser = dummyDatabase[i];
            break;
        }
    }

    return { userExists, loggedInUser };
}



function handleSuccessfulLogin(loggedInUser, emailInput, passwordInput) {
    if (loggedInUser && loggedInUser.name) {
        sessionStorage.setItem('loggedInUserName', loggedInUser.name);
    }

    emailInput.value = '';
    passwordInput.value = '';
    window.location.href = "./summary_user.html";
}

function checkEmailAndPassword() {                                           //Paul login funktionen
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.querySelector('.error-input-message');
    const actualPasswordValue = passwordInput.dataset.actualValue || '';

    const { userExists, loggedInUser } = validateUser(emailInput.value, actualPasswordValue);
    handleValidationResult(userExists, emailInput, passwordInput, errorMessage);

    if (userExists) {
        handleSuccessfulLogin(loggedInUser, emailInput, passwordInput);
    }
}*/

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













