
const LOGGEDIN_SESSIONSTORAGE_KEY= 'loggedIn';
const REMEMBERME_LOCALSTORAGE_KEY= 'rememberMe';

// const INDEXPAGE_URL= './sign_up.html';
// const INDEXPAGE_URL= './log_in.html';
const INDEXPAGE_URLS= ['./log_in.html', './sign_up.html'];
// const STARTPAGE_URL= './summary_user.html';
const STARTPAGE_URL= './contact.html';
const FAVICON_DARK_BG_URL= './assets/img/logo-darkBG.svg';

const SUMMARY_URL= './summary_user.html';
const ADDTASK_URL= './add_tasklhtml';
const BOARD_URL= './board.html';
const CONTACT_URL= './contact.html';

/*##########*/
/*## INIT ##*/
/*##########*/

function initMPA() {
    if (isDarkMode()) setFavicon(FAVICON_DARK_BG_URL);
    if (isIndexPage()) initIndexMPA();
    else initPageMPA();
}

function initIndexMPA() {
    let loggedIn= getLoggedIn();
    let rememberMe= getRememberMe();
    if (loggedIn || rememberMe) {
        loadPage(STARTPAGE_URL);
    }
}

function initPageMPA() {
    let rememberMe= getRememberMe();
    let loggedIn= getLoggedIn();
    if (rememberMe) setLoggedIn(rememberMe);
    if (!loggedIn) loadPage(INDEXPAGE_URLS[0]);
}

function isIndexPage() {
    console.log('isIndexPage()'); ///DEBUG
    let currentURL= window.location.href;
    let currentFilename= getFilenameFromURL(currentURL);
    // let indexFilename= getFilenameFromURL(INDEXPAGE_URL);
    let indexFilenames= [];
    for (let indexPageURL of INDEXPAGE_URLS) {
        indexFilenames.push(getFilenameFromURL(indexPageURL));
    }
    // return currentFilename == indexFilename;
    return indexFilenames.includes(currentFilename);
}

/*##################*/
/*## USER LOGGING ##*/
/*##################*/

function loginMPA(loggedInItem, rememberMeItem) {
    setLoggedIn(loggedInItem);
    if(rememberMeItem) setRememberMe(rememberMeItem);
    loadPage(STARTPAGE_URL);
}

function logoutMPA() {
    clearLoggedIn();
    clearRememberMe();
    loadPage(INDEXPAGE_URLS[0]);
}

function setLoggedIn(item) {
    let itemMod;
    if (isObject(item)) itemMod= JSON.stringify(item);
    else itemMod= item;
    sessionStorage.setItem(LOGGEDIN_SESSIONSTORAGE_KEY, itemMod);
}

function getLoggedIn() {
    let item= sessionStorage.getItem(LOGGEDIN_SESSIONSTORAGE_KEY);
    return parseJSONmpa(item);
}

function clearLoggedIn() {
    sessionStorage.removeItem(LOGGEDIN_SESSIONSTORAGE_KEY);
}

/*#################*/
/*## REMEMBER ME ##*/
/*#################*/

function setRememberMe(item) {
    let itemMod;
    if (isObject(item)) itemMod= JSON.stringify(item);
    else itemMod= item;
    localStorage.setItem(REMEMBERME_LOCALSTORAGE_KEY, itemMod);
}

function getRememberMe() {
    let item= localStorage.getItem(REMEMBERME_LOCALSTORAGE_KEY);
    return parseJSONmpa(item);
}

function clearRememberMe() {
    localStorage.removeItem(REMEMBERME_LOCALSTORAGE_KEY);
}

/*#############*/
/*## FAVICON ##*/
/*#############*/

//works if only one icon is set in the html file
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

function isDarkMode() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/*################*/
/*## NAVIGATION ##*/
/*################*/

function loadPage(url) {
    window.location.href = url;
}

/*##########*/
/*## MISC ##*/
/*##########*/

function isObject(item) {
    return typeof item == 'object';
}

function parseJSONmpa(item) {
    let parsedItem;
    try {
        parsedItem= JSON.parse(item);
    } catch(err) {
        if (err.name == 'SyntaxError') {
            parsedItem= item;
            return parsedItem;
        }
        else throw err;
    }
    return parsedItem;
}

function getFilenameFromURL(url) {
    let splitSlash= url.split('/');
    return splitSlash.pop().split('?')[0];
}

