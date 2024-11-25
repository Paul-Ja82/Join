let colorForContact = "rgb(209, 209, 209)"

function openColorPal() {
    document.getElementById("color_pal_overlay").classList.toggle("color_pal_overlay_visible")
}

function closeColorPal(e) {
    e.stopPropagation();
    document.getElementById("color_pal_overlay").classList.remove("color_pal_overlay_visible")
}

function chooseColorForContact(e) {
    e.stopPropagation();
    let rgbString= window.getComputedStyle(e.target).backgroundColor;
    colorForContact = rgbStringToHex(rgbString);
    let cdPersonIcon= document.getElementById("cdPersonIcon");
    cdPersonIcon.style.backgroundColor = `${colorForContact}`;
    cdPersonIcon.style.color = isColorLight(colorForContact) ? 'black' : 'white';
    closeColorPal(event)
    return colorForContact
}

function randomColorContact(e) {
    colorForContact = getRandomColorHex();
    document.getElementById("cdPersonIcon").style.backgroundColor = `${colorForContact}`;
    closeColorPal(event)
    return colorForContact;
}