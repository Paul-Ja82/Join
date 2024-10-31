
/*#############*/
/*## INCLUDE ##*/
/*#############*/

async function include() {
    let containers= document.querySelectorAll('[data-include]');
    for (let containerI of containers) {
        let url= containerI.dataset.include;
        let content= await fetch(url).then(res=>res.text());
        containerI.innerHTML= content;
    }
}

/*##########################*/
/*## SHOW / HIDE ELEMENTS ##*/
/*##########################*/

function showElem(elemId) {
    let elem = document.getElementById(elemId);
    elem.classList.remove('d-none');
}

function hideElem(elemId) {
    let elem = document.getElementById(elemId);
    elem.classList.add('d-none');
}

/*############*/
/*## COLORS ##*/
/*############*/

function getRandomColorHex() {
    let red = getRandomColorHexComponent();
    let green = getRandomColorHexComponent();
    let blue = getRandomColorHexComponent();
    return '#' + red + green + blue;
}

function getRandomColorHexComponent() {
    let comp = Math.floor(Math.random() * 256).toString(16);
    if (comp.length == 2)
        return comp;
    else {
        return '0' + comp;
    }
}

function isColorLight(colorHex) {
    let r = parseInt(colorHex.substring(1, 3), 16);
    let g = parseInt(colorHex.substring(3, 5), 16);
    let b = parseInt(colorHex.substring(5, 7), 16);
    let luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance >= 128;
}

