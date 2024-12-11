/**
 * Initializes toast functionality by adding transition end event handlers to toast elements.
 */
function initToastPlay() {
    addTransitionEndHandler();
}

/**
 * Adds a transition end event handler to all toast elements.
 */
function addTransitionEndHandler() {
    let toastElems = document.querySelectorAll('.toast');
    for (let toastI of toastElems) {
        toastI.addEventListener('transitionend', endTransitionHandler);
    }
}

/**
 * Handles the end of a transition for a toast element, hides the toast after a specified duration,
 * and executes an optional callback function.
 * @param {Event} event - The transitionend event object.
 */
function endTransitionHandler(event) {
    if (event.propertyName == 'bottom') {
        let toastElem = event.target;
        let duration = toastElem.dataset.duration;
        let afterFunctionName = toastElem.dataset.afterfunc;
        let afterFunction = window[afterFunctionName];
        setTimeout(() => {
            hideToast(toastElem);
            if (afterFunction) afterFunction();
        }, duration);
    }
}

/**
 * Displays a toast notification for a specified duration and executes an optional callback function after hiding the toast.
 * @param {string} elemId - The ID of the toast element to display.
 * @param {Function} [func] - An optional callback function to execute after the toast is hidden.
 */
function showToast(elemId, func) {
    let toastElem = document.getElementById(elemId);
    let duration = parseInt(toastElem.dataset.duration);
    showElem('toastBg');
    setTimeout(() => { toastElem.classList.add('show-toast'); }, 100);
    setTimeout(() => {
        hideToast(toastElem);
        if (func) func();
    }, duration);
}

/**
 * Hides a toast notification and removes its visible state.
 * @param {HTMLElement} toastElem - The toast element to hide.
 */
function hideToast(toastElem) {
    hideElem('toastBg');
    toastElem.classList.remove('show-toast');
}

/**
 * Retrieves the value of a CSS variable from the root element.
 * @param {string} key - The CSS variable name (e.g., '--variable-name').
 * @returns {string} The value of the CSS variable.
 */
function getCSSvarValue(key) {
    let rootElem = document.querySelector(':root');
    let rootElemStyle = window.getComputedStyle(rootElem);
    return rootElemStyle.getPropertyValue(key);
}

/**
 * Converts a time string (e.g., '2s' or '500ms') into milliseconds.
 * @param {string} text - The time string to parse.
 * @returns {number} The time value in milliseconds.
 */
function getMsValue(text) {
    let textMatch = text.match(/(?<number>(^\d*\.?\d*))(?<unit>(s|ms))$/);
    let number = textMatch.groups.number;
    let unit = textMatch.groups.unit;
    if (unit == 's') return number * 1000;
    else return number;
}

/**
 * Initializes dialog functionality by adding background click handlers to all dialogs.
 */
function initDialog() {
    addBgClickHandlers();
}

/**
 * Adds background click handlers to all dialog elements to close the dialog when clicking outside of it.
 */
function addBgClickHandlers() {
    let dialogs = document.querySelectorAll('.dialog');
    for (let dialogI of dialogs) {
        let dialogId = dialogI.id;
        addDialogBgClickHandler(dialogId);
    }
}

/**
 * Adds a click event handler to the dialog background to close the currently visible dialog
 * when clicking outside of the dialog content.
 * @param {string} dialogId - The ID of the dialog to add the background click handler for.
 */
function addDialogBgClickHandler(dialogId) {
    let dialogElem;
    let dialogBG = document.getElementById('dialogBg');
    dialogBG.addEventListener('click', (event) => {
        dialogElem = document.querySelector('.dialog:not(.d-none)');
        if (!dialogElem.contains(event.target)) {
            closeDialog();
        }
    });
}

/**
 * Opens a dialog by showing the dialog background, hiding all other dialogs, and displaying the specified dialog element.
 * @param {string} elemId - The ID of the dialog element to open.
 */
function openDialog(elemId) {
    showElem('dialogBg');
    hideDialogs();
    showElem(elemId);
}

/**
 * Closes the currently open dialog by hiding the dialog background.
 */
function closeDialog() {
    hideElem('dialogBg');
}

/**
 * Hides all dialogs by iterating through elements with the `dialog` class and hiding each one.
 */
function hideDialogs() {
    let dialogs = document.querySelectorAll('.dialog');
    for (let dialogI of dialogs) {
        hideElem(dialogI.id);
    }
}

/**
 * Positions a dialog element at specific coordinates.
 * @param {string} elemId - The ID of the dialog element to position.
 * @param {number} x - The x-coordinate (left position) in pixels.
 * @param {number} y - The y-coordinate (top position) in pixels.
 */
function placeDialog(elemId, x, y) {
    let dialog = document.getElementById(elemId);
    dialog.style.top = y + 'px';
    dialog.style.left = x + 'px';
}
