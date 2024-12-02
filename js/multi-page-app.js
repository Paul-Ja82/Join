
const LOGGEDIN_SESSIONSTORAGE_KEY= 'loggedIn';
const REMEMBERME_LOCALSTORAGE_KEY= 'loggedInUserName';

const INDEXPAGE_URLS= ['./log_in.html', './sign_up.html'];
const STARTPAGE_URL= './summary_user.html';
const FAVICON_DARK_BG_URL= './assets/img/logo-darkBG.svg';

const SUMMARY_URL= './summary_user.html';
const ADDTASK_URL= './add_task.html';
const BOARD_URL= './board.html';
const CONTACT_URL= './contact.html';

/*##########*/
/*## INIT ##*/
/*##########*/

/**
 * Initializes the multi-page application (MPA) by setting the favicon and determining
 * whether to initialize the index page or another page based on the current URL.
 */
function initMPA() {
    if (isDarkMode()) setFavicon(FAVICON_DARK_BG_URL);
    if (isIndexPage()) initIndexMPA();
    else initPageMPA();
}

/**
 * Initializes the index page by checking the login or remember-me status
 * and redirecting to the start page if necessary.
 */
function initIndexMPA() {
    let loggedIn = getLoggedIn();
    let rememberMe = getRememberMe();
    if (loggedIn || rememberMe) {
        loadPage(STARTPAGE_URL);
    }
}

/**
 * Initializes other pages by checking the remember-me and login status.
 * Redirects to the index page if the user is not logged in.
 */
function initPageMPA() {
    let rememberMe = getRememberMe();
    let loggedIn = getLoggedIn();
    if (rememberMe) setLoggedIn(rememberMe);
    if (!loggedIn) loadPage(INDEXPAGE_URLS[0]);
}

/**
 * Determines if the current page is an index page by comparing the current URL's filename
 * with the filenames in the list of index page URLs.
 * @returns {boolean} True if the current page is an index page, otherwise false.
 */
function isIndexPage() {
    let currentURL = window.location.href;
    let currentFilename = getFilenameFromURL(currentURL);
    let indexFilenames = [];
    for (let indexPageURL of INDEXPAGE_URLS) {
        indexFilenames.push(getFilenameFromURL(indexPageURL));
    }
    return indexFilenames.includes(currentFilename);
}


/*##################*/
/*## USER LOGGING ##*/
/*##################*/

/**
 * Logs the user in by setting the logged-in and remember-me status,
 * and redirects to the start page.
 * @param {string|Object} loggedInItem - The item to set as logged in.
 * @param {string|Object} rememberMeItem - The item to set for remember-me functionality.
 */
function loginMPA(loggedInItem, rememberMeItem) {
    setLoggedIn(loggedInItem);
    if (rememberMeItem) setRememberMe(rememberMeItem);
    loadPage(STARTPAGE_URL);
}

/**
 * Logs the user out by clearing the logged-in and remember-me status,
 * and redirects to the index page.
 */
function logoutMPA() {
    clearLoggedIn();
    clearRememberMe();
    loadPage(INDEXPAGE_URLS[0]);
}

/**
 * Sets the logged-in status in session storage.
 * @param {string|Object} item - The item to store as the logged-in user.
 */
function setLoggedIn(item) {
    let itemMod;
    if (isObject(item)) itemMod = JSON.stringify(item);
    else itemMod = item;
    sessionStorage.setItem(LOGGEDIN_SESSIONSTORAGE_KEY, itemMod);
}

/**
 * Retrieves the logged-in status from session storage.
 * @returns {Object|string|null} The logged-in item, parsed if it's JSON, otherwise null.
 */
function getLoggedIn() {
    let item = sessionStorage.getItem(LOGGEDIN_SESSIONSTORAGE_KEY);
    return parseJSONmpa(item);
}

/**
 * Clears the logged-in status from session storage.
 */
function clearLoggedIn() {
    sessionStorage.removeItem(LOGGEDIN_SESSIONSTORAGE_KEY);
}


/*#################*/
/*## REMEMBER ME ##*/
/*#################*/

/**
 * Sets the remember-me status in local storage.
 * @param {string|Object} item - The item to store for remember-me functionality.
 */
function setRememberMe(item) {
    let itemMod;
    if (isObject(item)) itemMod = JSON.stringify(item);
    else itemMod = item;
    localStorage.setItem(REMEMBERME_LOCALSTORAGE_KEY, itemMod);
}

/**
 * Retrieves the remember-me status from local storage.
 * @returns {Object|string|null} The remember-me item, parsed if it's JSON, otherwise null.
 */
function getRememberMe() {
    let item = localStorage.getItem(REMEMBERME_LOCALSTORAGE_KEY);
    return parseJSONmpa(item);
}

/**
 * Clears the remember-me status from local storage.
 */
function clearRememberMe() {
    localStorage.removeItem(REMEMBERME_LOCALSTORAGE_KEY);
}


/*#############*/
/*## FAVICON ##*/
/*#############*/

/**
 * Sets the favicon of the document to the specified source.
 * @param {string} src - The URL of the favicon to set.
 */
function setFavicon(src) {
    let link = document.createElement('link');
    let oldLink = document.querySelector('link[rel="icon"]');
    link.rel = 'icon';
    link.href = src;
    if (oldLink) {
        document.head.removeChild(oldLink);
    }
    document.head.appendChild(link);
}

/**
 * Checks if the user's system is currently in dark mode.
 * @returns {boolean} True if dark mode is enabled, otherwise false.
 */
function isDarkMode() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}


/*################*/
/*## NAVIGATION ##*/
/*################*/

/**
 * Redirects the browser to the specified URL.
 * @param {string} url - The URL to navigate to.
 */
function loadPage(url) {
    window.location.href = url;
}


/*##########*/
/*## MISC ##*/
/*##########*/

/**
 * Checks if the given item is an object.
 * @param {*} item - The item to check.
 * @returns {boolean} True if the item is an object, otherwise false.
 */
function isObject(item) {
    return typeof item == 'object';
}

/**
 * Parses a JSON string into an object, or returns the original string if parsing fails.
 * @param {string} item - The JSON string to parse.
 * @returns {Object|string} The parsed object or the original string if parsing fails.
 */
function parseJSONmpa(item) {
    let parsedItem;
    try {
        parsedItem = JSON.parse(item);
    } catch (err) {
        if (err.name == 'SyntaxError') {
            parsedItem = item;
            return parsedItem;
        } else throw err;
    }
    return parsedItem;
}

/**
 * Extracts the filename from a given URL, excluding query parameters.
 * @param {string} url - The URL to extract the filename from.
 * @returns {string} The extracted filename.
 */
function getFilenameFromURL(url) {
    let splitSlash = url.split('/');
    return splitSlash.pop().split('?')[0];
}


