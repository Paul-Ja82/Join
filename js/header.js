/**
 * Toggles the visibility of the navigation menu based on screen size and updates the background color of the initials circle.
 */
function openNavWindowFrame() {
    const isSmallScreen = window.innerWidth <= 960;

    const navMenuFrame = document.querySelector(isSmallScreen ? '.nav-menu-resp-frame' : '.nav-menu-frame');
    const initialsCircle = document.getElementById('navCircle'); 

    if (navMenuFrame.style.display === 'none' || navMenuFrame.style.display === '') {
        navMenuFrame.style.display = 'block'; 
        initialsCircle.style.backgroundColor = 'rgba(12, 46, 98, 0.12)'; 
    } else {
        navMenuFrame.style.display = 'none'; 
        initialsCircle.style.backgroundColor = ''; 
    }
}

/**
 * Ensures that the responsive navigation menu is hidden when the screen size exceeds 960 pixels.
 */
window.addEventListener('resize', function() {
    const navMenuRespFrame = document.querySelector('.nav-menu-resp-frame');
    if (window.innerWidth > 960 && navMenuRespFrame) {
        navMenuRespFrame.style.display = 'none';
    }
});

/**
 * Ensures that the standard navigation menu is hidden when the screen size is less than 960 pixels.
 */
window.addEventListener('resize', function() {
    const navMenu = document.querySelector('.nav-menu-frame');
    if (window.innerWidth < 960 && navMenu) {
        navMenu.style.display = 'none';
    }
});

/**
 * Sets the greeted name in the header based on the "loggedInUserName" stored in the session storage.
 * If no name is found, the function does nothing.
 */
async function setGreetedName() { 
    const storedName = sessionStorage.getItem('loggedInUserName');
    if (storedName) {
        console.log('Retrieved Name:', storedName); 

        const greetedNameElements = document.querySelectorAll('#greetedName');
        greetedNameElements.forEach(element => {
            element.textContent = storedName;
        });
    } 
}

/**
 * Generates a monogram (initials) from the given full name.
 * @param {string} name - The full name of the user.
 * @returns {string} The generated monogram in uppercase.
 */
function getMonogramHeader(name) {
    let words = name.split(' ').filter(Boolean); 
    let monogram = '';
    for (let i = 0; i < Math.min(2, words.length); i++) {
        if (words[i].length > 0) {
            monogram += words[i][0]; 
        }
    }

    return monogram.toUpperCase(); 
}

/**
 * Updates the user's monogram (initials) in the navigation circle based on the "loggedInUserName" stored in localStorage or sessionStorage.
 * Defaults to 'G' if no name is available.
 */
async function updateUserMonogram() {
    await setGreetedName();
    let storedName;
    if (localStorage.getItem('loggedInUserName')) {
        storedName = localStorage.getItem('loggedInUserName');
    } else storedName = sessionStorage.getItem('loggedInUserName');

    const navCircleElement = document.getElementById('navCircle');

    if (navCircleElement) {
        if (storedName) {
            const monogram = getMonogramHeader(storedName);
            navCircleElement.textContent = monogram;
            navCircleElement.classList.remove('guest-monogram');
        } else {
            navCircleElement.textContent = 'G';
            navCircleElement.classList.add('guest-monogram'); 
        }
    }
}

/**
 * Initializes the header by updating the user's monogram and greeted name.
 */
function initHeaderJs() {
    updateUserMonogram();
}
