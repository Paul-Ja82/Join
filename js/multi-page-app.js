/*
When used in a Multi-Page-App:
On initialization:
-) setFaviconDarkBgURL(url)

On initialization of any Page (not index-page):
-) setIndexpage(url)

On initialization of the index-page:
-) setStartpage(url)
*/

const LOGGEDIN_SESSIONSTORAGE_KEY= 'loggedIn';
const REMEMBERME_LOCALSTORAGE_KEY= 'rememberMe';

let indexPageURL;
let startPageURL;
let faviconDarkBgURL;

/*##########*/
/*## INIT ##*/
/*##########*/

function initMPA() {
    if (isDarkMode()) setFavicon(faviconDarkBgURL);
    if (isIndexPage()) initIndexMPA();
    else initPageMPA();
}

function initIndexMPA() {
    console.log('initIndexMPA()'); ///DEBUG
    let loggedIn= getLoggedIn();
    let rememberMe= getRememberMe();
    if (loggedIn || rememberMe) {
        if (startPageURL) loadPage(startPageURL);
        else console.error('keine Startpage-URL deniniert');
    }
}

function initPageMPA() {
    let rememberMe= getRememberMe();
    let loggedIn= getLoggedIn();
    if (rememberMe) setLoggedIn(rememberMe);
    if (!loggedIn) loadPage(indexPageURL);
}

function isIndexPage() {
    let url= window.location.href;
    let filename= url.substring(url.lastIndexOf('/')+1); 
    return filename=='index.html' ? true : false;
}

/*##################*/
/*## USER LOGGING ##*/
/*##################*/

function loginMPA(loggedInItem, rememberMeItem) {
    setLoggedIn(loggedInItem);
    if(rememberMeItem) setRememberMe(rememberMeItem);
    loadPage(startPageURL);
}

function logoutMPA() {
    clearLoggedIn();
    clearRememberMe();
    loadPage(indexPageURL);
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

function setFaviconDarkBgURL(url) {
    faviconDarkBgURL= url;
}

/*################*/
/*## NAVIGATION ##*/
/*################*/

function loadPage(url) {
    console.log('loadPage(url)', url); ///DEBUG
    window.location.href = url;
}

function setStartPage(url) {
    startPageURL= url;
}

function setIndexPage(url) {
    indexPageURL= url;
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

