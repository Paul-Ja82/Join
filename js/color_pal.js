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
    colorForContact = window.getComputedStyle(e.target).backgroundColor;
    document.getElementById("user_icon_circle").style.backgroundColor = `${colorForContact}`;
    document.getElementById("color_for_contact").innerHTML = `Farbe: ${colorForContact}`;
    return colorForContact
}

function randomColorContact() {
    colorForContact = getRandomColorHex();
    document.getElementById("user_icon_circle").style.backgroundColor = `${colorForContact}`;
    document.getElementById("color_for_contact").innerHTML = `Farbe: ${colorForContact}`;
    return colorForContact;
}