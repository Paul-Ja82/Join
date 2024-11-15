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
    if (window.innerWidth > 1050 && navMenuRespFrame) {
        navMenuRespFrame.style.display = 'none';
    }
});

window.addEventListener('resize', function() {
    const navMenu = document.querySelector('.nav-menu-frame');
    if (window.innerWidth < 1050 && navMenu) {
        navMenu.style.display = 'none';
    }
});

async function setGreetedName() { 
    const storedName = localStorage.getItem('loggedInUserName');
    let greetednameText = "";

    if (storedName) {
        console.log('Retrieved Name:', storedName); 

        const greetedNameElements = document.querySelectorAll('#greetedName');
        for (let i = 0; i < greetedNameElements.length; i++) {
            greetedNameElements[i].textContent = storedName;
        }
    } else {
        console.error('No name found in Local Storage.');
    }
}

async function updateUserMonogram() {
    await setGreetedName(); 
    const storedName = localStorage.getItem('loggedInUserName');

    if (storedName) {
        const monogram = getMonogram(storedName);
        const navCircleElement = document.getElementById('navCircle');
        if (navCircleElement) {
            navCircleElement.textContent = monogram;
        }
    } else {
        console.error('No name found in Local Storage.');
    }
}

updateUserMonogram();

