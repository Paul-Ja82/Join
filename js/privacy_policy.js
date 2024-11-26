
/* TU ES
Markieren von aktuellen MenüEinträgen
*/

let mediaDesktop = window.matchMedia('(1010px < width)');

/*##########*/
/*## INIT ##*/
/*##########*/

function initPrivacy() {
    include()
        .then(() => {
            initHeaderJs();
            hideUserMenu();
            if (!isLoggedIn()) hideMenu();
            document.getElementById('');
        });
}

function isLoggedIn() {
    console.log('isLoggedIn()'); ///DEBUG
    console.log(getLoggedIn() ? true : false); ///DEBUG
    return getLoggedIn() ? true : false;
}

function hideUserMenu() {
    let navHeader= document.querySelector('.nav-header');
    navHeader.classList.add('d-none');
    // hideElem('nav-header');
}

/*
function hideMenu() {
    let menuContainer= document.getElementById('menuContainer');
    // let menuNavContainer= document.getElementById('menuNavContainer');
    if (mediaDesktop.matches) {
        hideElem('menuNavContainer');
        menuContainer.style.minWidth= '30%';
    }
    else hideElem('menuContainer');
}
*/

function hideMenu() {
    let menuContainer= document.getElementById('menuContainer');
    hideElem('menuNavContainer');
    menuContainer.style.minWidth= '220px';
}
