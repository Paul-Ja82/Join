let mediaDesktop = window.matchMedia('(1010px < width)');

/**
 * Initializes the privacy page by including header functionality, hiding the user menu,
 * and conditionally hiding the main menu if the user is not logged in.
 */
function initPrivacy() {
    include()
        .then(() => {
            initHeaderJs();
            hideUserMenu();
            if (!isLoggedIn()) hideMenu();
            document.getElementById('');
        });
}

/**
 * Checks if a user is currently logged in.
 * @returns {boolean} True if the user is logged in, otherwise false.
 */
function isLoggedIn() {
    return getLoggedIn() ? true : false;
}

/**
 * Hides the user menu in the navigation header by adding a CSS class.
 */
function hideUserMenu() {
    let navHeader = document.querySelector('.nav-header');
    navHeader.classList.add('d-none');
}

/**
 * Hides the main menu and adjusts the menu container's minimum width.
 */
function hideMenu() {
    let menuContainer = document.getElementById('menuContainer');
    hideElem('menuNavContainer');
    menuContainer.style.minWidth = '220px';
}

