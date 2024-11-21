function openNavWindowFrame() {
    const isSmallScreen = window.innerWidth <= 1050;

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

window.addEventListener('resize', function() {
    const navMenuRespFrame = document.querySelector('.nav-menu-resp-frame');
    if (window.innerWidth > 960 && navMenuRespFrame) {
        navMenuRespFrame.style.display = 'none';
    }
});

window.addEventListener('resize', function() {
    const navMenu = document.querySelector('.nav-menu-frame');
    if (window.innerWidth < 960 && navMenu) {
        navMenu.style.display = 'none';
    }
});

async function setGreetedName() { 
    const storedName = sessionStorage.getItem('loggedInUserName');
    let greetednameText = "";

    if (storedName) {
        console.log('Retrieved Name:', storedName); 

        const greetedNameElements = document.querySelectorAll('#greetedName');
        for (let i = 0; i < greetedNameElements.length; i++) {
            greetedNameElements[i].textContent = storedName;
        }
    } else {
        // console.error('No name found in Session Storage.');
    }
}

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

function initHeaderJs() {
    updateUserMonogram();
}
