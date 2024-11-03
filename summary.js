const spans = document.getElementsByTagName("span");
    for (let i = 0; i < spans.length; i++) {
        spans[i].textContent = spans[i].textContent.slice(0, 6);
    }

function ifElseForApplyHover(amountElement) {
    const width = amountElement.offsetWidth;
    let conditionMet = false;

    if (width > 139) {
        amountElement.classList.add("enable-hover");
        amountElement.classList.add("amount-with-three");
        conditionMet = true;
    } else {
        amountElement.classList.remove("enable-hover");
        amountElement.classList.remove("amount-with-three");
    }

    return conditionMet;
}

function ifElseForNoGap(sectionElement, conditionMet) {
    if (conditionMet) {
        sectionElement.classList.add("no-gap");
    } else {
        sectionElement.classList.remove("no-gap");
    }
}

function applyHoverClass() {
    const amountElements = document.getElementsByClassName("amount");
    let conditionMet = false;

    for (let i = 0; i < amountElements.length; i++) {
        const amountElement = amountElements[i];
        if (ifElseForApplyHover(amountElement)) {
            conditionMet = true;
        }
    }

    const sectionElements = document.getElementsByTagName("section");
    for (let i = 0; i < sectionElements.length; i++) {
        ifElseForNoGap(sectionElements[i], conditionMet);
    }
}


function checkAmountWidth() {
    applyHoverClass();
    window.addEventListener("resize", applyHoverClass);
}
