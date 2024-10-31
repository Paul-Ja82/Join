function animateLogo() {
    const logo = document.querySelector(".j-logo-img");
    logo.classList.add("animate-logo");
}

function showDivsDelayed() {
    const logIn = document.querySelector(".log-in-div");
    const signUpDiv = document.querySelector(".sign-up-under-div");

    setTimeout(() => {
        logIn.style.opacity = "1";
        logIn.style.visibility = "visible";
        signUpDiv.style.opacity = "1";
        signUpDiv.style.visibility = "visible";
    }, 400);
}