
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

function getColorHexComponent(number) {
    let comp = parseInt(number).toString(16);
    console.log(comp); ///DEBUG
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

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function rgbStringToHex(rgbString) {
    let rgbStringMod= rgbString.split('(')[1];
    rgbStringMod= rgbStringMod.split(')')[0];
    rgbStringMod= rgbStringMod.split(','); 
    let rComp= getColorHexComponent(rgbStringMod[0]);
    let gComp= getColorHexComponent(rgbStringMod[1]);
    let bComp= getColorHexComponent(rgbStringMod[2]);
    return '#' + rComp + gComp + bComp;
}

/*###################*/
/*## MARK ELEMENTS ##*/
/*###################*/

function markElem(elemId, className, functions) {
    let elem= document.getElementById(elemId);
    elem.classList.add(className);
    if (functions) {
        for (let functionI of functions) {
            functionI();
        }
    }
}

function demmarkElem(elemId, className, functions) {
    let elem= document.getElementById(elemId);
    elem.classList.remove(className);
    if (functions) {
        for (let functionI of functions) {
            functionI();
        }
    }
}

function demarkAllElems(className) {
    let elems= document.querySelectorAll(`.${className}`);
    for (let elemI of elems) {
        demmarkElem(elemI.id, className);
    }
}

function isMarked(elemId, className) {
    let elem= document.getElementById(elemId);
    return elem.classList.contains(className);
}

/*##########*/
/*## MISC ##*/
/*##########*/

function getMonogram(name) {
    let words= name.split(' ');
    let word;
    let monogram= '';
    words.reverse();
    while (words.length > 0) {
        monogram += words.pop().charAt(0).toUpperCase();
    }
    return monogram.slice(0,2);
}
/*
function getMonogram(name) {
    //the first letters of the two first words
    let regex = /^(\w)\w*\b(\s+(\w)\w*\b)?/
    let match = name.match(regex);
    let letter1 = match[1];
    let letter2 = match[3];
    let monogram = '';
    if (letter1) monogram += letter1;
    if (letter2) monogram += letter2;
    // return monogram;
    return monogram.toUpperCase();
}
*/