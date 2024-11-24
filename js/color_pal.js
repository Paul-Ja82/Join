let colorForContact = "rgb(209, 209, 209)"

/**
 * Toggles the visibility of the color palette overlay.
 * If the overlay is currently hidden, it becomes visible. If it is already visible, it is hidden.
 */
function openColorPal() {
    document.getElementById("color_pal_overlay").classList.toggle("color_pal_overlay_visible")
}

/**
 * Closes the color palette overlay by removing the visibility class.
 * 
 * @param {Event} e - The event object that triggered the function. The event propagation is stopped to prevent the event from reaching other elements.
 */
function closeColorPal(e) {
    e.stopPropagation();
    document.getElementById("color_pal_overlay").classList.remove("color_pal_overlay_visible")
}

/**
 * Sets the background color for a contact icon based on the color selected from the color palette.
 * The selected color is applied to the icon and the color palette is closed.
 * 
 * @param {Event} e - The event object that triggered the function. Represents the color element that was clicked.
 * @returns {string} The background color of the selected contact color.
 */
function chooseColorForContact(e) {
    e.stopPropagation();
    colorForContact = window.getComputedStyle(e.target).backgroundColor;
    document.getElementById("cdPersonIcon").style.backgroundColor = `${colorForContact}`;
    closeColorPal(event)
    return colorForContact
}

/**
 * Assigns a random background color to the contact icon and closes the color palette.
 * The random color is generated using a helper function `getRandomColorHex` and applied to the icon.
 * 
 * @param {Event} e - The event object that triggered the function (though it's not used directly in the function).
 * @returns {string} The randomly generated color in hexadecimal format applied to the contact icon.
 */
function randomColorContact(e) {
    colorForContact = getRandomColorHex();
    document.getElementById("cdPersonIcon").style.backgroundColor = `${colorForContact}`;
    closeColorPal(event)
    return colorForContact;
}