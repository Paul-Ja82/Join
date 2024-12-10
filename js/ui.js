/**
 * Dynamically includes HTML content into elements with a `data-include` attribute.
 * Fetches the content from the URL specified in the `data-include` attribute and injects it into the element.
 * @async
 */
async function include() {
    let containers = document.querySelectorAll('[data-include]');
    for (let containerI of containers) {
        let url = containerI.dataset.include;
        let content = await fetch(url).then(res => res.text());
        containerI.innerHTML = content;
    }
}

/**
 * Displays an element by removing the 'd-none' class.
 * @param {string} elemId - The ID of the element to display.
 */
function showElem(elemId) {
    let elem = document.getElementById(elemId);
    elem.classList.remove('d-none');
}

/**
 * Hides an element by adding the 'd-none' class.
 * @param {string} elemId - The ID of the element to hide.
 */
function hideElem(elemId) {
    let elem = document.getElementById(elemId);
    elem.classList.add('d-none');
}

/**
 * Generates a random color in hexadecimal format.
 * @returns {string} A hexadecimal color string (e.g., '#A1B2C3').
 */
function getRandomColorHex() {
    let red = getRandomColorHexComponent();
    let green = getRandomColorHexComponent();
    let blue = getRandomColorHexComponent();
    return '#' + red + green + blue;
}

/**
 * Generates a random hexadecimal component for a color.
 * @returns {string} A two-character hexadecimal string representing a color component.
 */
function getRandomColorHexComponent() {
    let comp = Math.floor(Math.random() * 256).toString(16);
    return comp.length == 2 ? comp : '0' + comp;
}

/**
 * Converts a number to a hexadecimal color component.
 * @param {number|string} number - The number to convert to a two-character hexadecimal string.
 * @returns {string} A two-character hexadecimal string representing the color component.
 */
function getColorHexComponent(number) {
    let comp = parseInt(number).toString(16);
    return comp.length == 2 ? comp : '0' + comp;
}

/**
 * Determines whether a color in hexadecimal format is light based on its luminance.
 * @param {string} colorHex - The hexadecimal color string (e.g., '#A1B2C3').
 * @returns {boolean} True if the color is light, otherwise false.
 */
function isColorLight(colorHex) {
    let r = parseInt(colorHex.substring(1, 3), 16);
    let g = parseInt(colorHex.substring(3, 5), 16);
    let b = parseInt(colorHex.substring(5, 7), 16);
    let luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance >= 128;
}

/**
 * Converts RGB values to a hexadecimal color string.
 * @param {number} r - The red component (0-255).
 * @param {number} g - The green component (0-255).
 * @param {number} b - The blue component (0-255).
 * @returns {string} The hexadecimal color string (e.g., '#A1B2C3').
 */
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

/**
 * Converts an RGB string (e.g., 'rgb(255, 255, 255)') to a hexadecimal color string.
 * @param {string} rgbString - The RGB string to convert.
 * @returns {string} The hexadecimal color string (e.g., '#FFFFFF').
 */
function rgbStringToHex(rgbString) {
    let rgbStringMod = rgbString.split('(')[1];
    rgbStringMod = rgbStringMod.split(')')[0];
    rgbStringMod = rgbStringMod.split(',');
    let rComp = getColorHexComponent(rgbStringMod[0]);
    let gComp = getColorHexComponent(rgbStringMod[1]);
    let bComp = getColorHexComponent(rgbStringMod[2]);
    return '#' + rComp + gComp + bComp;
}

/**
 * Adds a specified class to an element and optionally executes additional functions.
 * @param {string} elemId - The ID of the element to mark.
 * @param {string} className - The class to add to the element.
 * @param {Function[]} [functions] - An optional array of functions to execute after marking the element.
 */
function markElem(elemId, className, functions) {
    let elem = document.getElementById(elemId);
    elem.classList.add(className);
    if (functions) {
        for (let functionI of functions) {
            functionI();
        }
    }
}

/**
 * Removes a specified class from an element and optionally executes additional functions.
 * @param {string} elemId - The ID of the element to unmark.
 * @param {string} className - The class to remove from the element.
 * @param {Function[]} [functions] - An optional array of functions to execute after unmarking the element.
 */
function demmarkElem(elemId, className, functions) {
    let elem = document.getElementById(elemId);
    elem.classList.remove(className);
    if (functions) {
        for (let functionI of functions) {
            functionI();
        }
    }
}

/**
 * Removes a specified class from all elements that have it.
 * @param {string} className - The class to remove from all elements.
 */
function demarkAllElems(className) {
    let elems = document.querySelectorAll(`.${className}`);
    for (let elemI of elems) {
        demmarkElem(elemI.id, className);
    }
}

/**
 * Checks if an element has a specified class.
 * @param {string} elemId - The ID of the element to check.
 * @param {string} className - The class to check for.
 * @returns {boolean} True if the element has the specified class, otherwise false.
 */
function isMarked(elemId, className) {
    let elem = document.getElementById(elemId);
    return elem.classList.contains(className);
}

/**
 * Generates a monogram (two initials) from a given name.
 * @param {string} name - The name from which to generate the monogram.
 * @returns {string} The generated monogram, consisting of the first two initials in uppercase.
 */
function getMonogram(name) {
    let words = name.split(' ');
    let monogram = '';
    words.reverse();
    while (words.length > 0) {
        monogram += words.pop().charAt(0).toUpperCase();
    }
    return monogram.slice(0, 2);
}


