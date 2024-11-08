function initSummary() {
    initMPA();
}

function toggleGreetingsDisplay() {
    if (window.innerWidth <= 1260) {
        const greetingsFrame = document.querySelector('.greetings-frame-responsive');
        const titleAndMainDisplay = document.querySelector('.title-and-main-display-resposive');
        
        if (greetingsFrame && titleAndMainDisplay) {
            greetingsFrame.style.display = 'block';
            titleAndMainDisplay.style.display = 'none';

            setTimeout(() => {
                greetingsFrame.style.display = 'none';
                titleAndMainDisplay.style.display = 'block';
            }, 2000);
        }
    }
}

function setGreeting() {
    const greetingElements = document.querySelectorAll('#greetingSummary');
    const currentHour = new Date().getHours();
    let greetingText = "";

    if (currentHour >= 5 && currentHour < 13) {
        greetingText = "Good morning,";
    } else if (currentHour >= 13 && currentHour < 18) {
        greetingText = "Good afternoon,";
    } else if (currentHour >= 18 && currentHour < 23) {
        greetingText = "Good evening,";
    } else {
        greetingText = "Good night,";
    }

    for (let i = 0; i < greetingElements.length; i++) {
        greetingElements[i].textContent = greetingText;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    setGreeting();
});

const dummyDatabase = [
    {
        "name": "Max Mustermann",
        "email": "user2@example2.com",
        "password": "password321"
    }
];

localStorage.setItem('dummyDatabase', JSON.stringify(dummyDatabase));
console.log(localStorage.getItem('dummyDatabase'));

function setGreetedName() {
    const storedDatabase = JSON.parse(localStorage.getItem('dummyDatabase'));
    let greetednameText = "";

    if (storedDatabase && Array.isArray(storedDatabase) && storedDatabase.length > 0) {
        const name = storedDatabase[0].name;
        console.log('Abgerufener Name:', name); 

        const greetedNameElements = document.querySelectorAll('#greetedName');
        for (let i = 0; i < greetedNameElements.length; i++) {
            greetedNameElements[i].textContent = name;
        }
    } else {
        console.error('No data found in Local Storage or data is invalid.');
    }
}






document.addEventListener("DOMContentLoaded", function () {
    let amountElements = document.querySelectorAll('.amount');

    for (let i = 0; i < amountElements.length; i++) {
        let element = amountElements[i];
        let value = Number(element.textContent);
        if (!isNaN(value) && value > 99) {
            element.innerHTML = '99<span class="plus-sign">+</span>';
        }
    }
});





