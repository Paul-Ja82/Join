let mediaDesktop = window.matchMedia('(768px < width)');
mediaDesktop.addEventListener('change', mediaChangeHandler);

/*##########*/
/*## INIT ##*/
/*##########*/

function initContact() {
    console.log('intitContact()'); ///DEBUG
    include();
    mediaChangeHandler();
    addListItemClickHandlers();
}

function addListItemClickHandlers() {
    let listItems= document.querySelectorAll('.conlist-item'); 
    for (itemI of listItems) {
        itemI.addEventListener('click', listItemClickHandler);
    }
}

/*##################*/
/*## CONTACT LIST ##*/
/*##################*/

function listItemClickHandler() {
    console.log('listItemClickHandler()'); ///DEBUG
    hideInfo();
    showInfo();
}

/*##################*/
/*## INFO SECTION ##*/
/*##################*/

function showInfo() {
    setInfo();
    let infoContainer= document.getElementById('infoContainer');
    infoContainer.classList.add('show-info');
}

function hideInfo() {
    let infoContainer= document.getElementById('infoContainer');
    infoContainer.classList.remove('show-info');
}

function setInfo() {
    console.log('setInfo()'); ///DEBUG
}

/*###########*/
/*## MEDIA ##*/
/*###########*/

function mediaChangeHandler() {
    if (mediaDesktop.matches) {
        showElem('detailContainer');
        hideContactInfoButtonMobile();
    }
    else hideElem('detailContainer');
}