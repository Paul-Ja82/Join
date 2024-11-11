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

function supportForMaskPassword(input, actualValue) {
    const lastChar = input.value.slice(-1);
    if (input.value.length < actualValue.length) {
        actualValue = actualValue.slice(0, input.value.length);
    } else {
        actualValue += lastChar;
    }
    const eyeOnImg = document.querySelector('.password-Img-eye-on');
    if (eyeOnImg && eyeOnImg.style.display === 'block') {
        input.value = actualValue;
    } else {
        input.value = '✹'.repeat(actualValue.length);
    }

    return actualValue;
}

function maskPassword() {
    const input = document.getElementById("passwordInput");
    let actualValue = input.dataset.actualValue || ""; 

    actualValue = supportForMaskPassword(input, actualValue);
    input.dataset.actualValue = actualValue;
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
    const input = document.getElementById("passwordInput");
    const lockImg = document.querySelector('.password-Img');
    const eyeOffImg = document.querySelector('.password-Img-eye-of');
    const eyeOnImg = document.querySelector('.password-Img-eye-on');

    eyeLockVariations(input, lockImg, eyeOffImg, eyeOnImg);
}


function openEyePassword() {
    const eyeOffImg = document.querySelector('.password-Img-eye-of');
    const eyeOnImg = document.querySelector('.password-Img-eye-on');
    const input = document.getElementById("passwordInput");

    if (eyeOffImg && eyeOnImg) {
        eyeOffImg.style.display = 'none';
        eyeOnImg.style.display = 'block';

        input.value = input.dataset.actualValue || "";
    }
}

function closeEyePassword() {
    const eyeOffImg = document.querySelector('.password-Img-eye-of');
    const eyeOnImg = document.querySelector('.password-Img-eye-on');
    const input = document.getElementById("passwordInput");

    if (eyeOffImg && eyeOnImg) {
        eyeOffImg.style.display = 'block';
        eyeOnImg.style.display = 'none';

        input.value = '✹'.repeat(input.dataset.actualValue ? input.dataset.actualValue.length : 0);
    }
}

const dummyDatabase = [
    {
        "id": "1111",
        "name": "Paul Dietrich",
        "email": "user@example.com",
        "password": "password123"
    },
    {    
        "id": "2222",
        "name": "Maximilian Mustermann",
        "email": "user2@example2.com",
        "password": "password321"
    }

];

function validateUser(email, password) {
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

function handleValidationResult(userExists, emailInput, passwordInput, errorMessage) {
    if (!userExists) {
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

function handleSuccessfulLogin(loggedInUser, emailInput, passwordInput) {
    if (loggedInUser && loggedInUser.name) {
        localStorage.setItem('loggedInUserName', loggedInUser.name);
    }

    emailInput.value = '';
    passwordInput.value = '';
    window.location.href = "./summary_user.html";
}

function checkEmailAndPassword() {
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.querySelector('.error-input-message');
    const actualPasswordValue = passwordInput.dataset.actualValue || '';

    const { userExists, loggedInUser } = validateUser(emailInput.value, actualPasswordValue);
    handleValidationResult(userExists, emailInput, passwordInput, errorMessage);

    if (userExists) {
        handleSuccessfulLogin(loggedInUser, emailInput, passwordInput);
    }
}

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

/*function toggleAutocomplete() {
    const rememberMeCheckbox = document.getElementById('rememberCheckbox');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');

    if (rememberMeCheckbox.checked) {
        emailInput.setAttribute('autocomplete', 'on');             ### ?? für den moment in html auf off 
        passwordInput.setAttribute('autocomplete', 'on');
    } else {
        emailInput.setAttribute('autocomplete', 'off');
        passwordInput.setAttribute('autocomplete', 'off');
    }
}*/ 












