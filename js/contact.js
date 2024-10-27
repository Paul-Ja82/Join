let mediaDesktop = window.matchMedia('(768px < width)');
mediaDesktop.addEventListener('change', mediaChangeHandler);

/*##########*/
/*## INIT ##*/
/*##########*/

function initContact() {
    console.log('intitContact()'); ///DEBUG
    initForms();
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

/*#################*/
/*## ADD CONTACT ##*/
/*#################*/

function addContactButtonHandler() {
    clearAddContactForm();
    setContactDialogAdd();
    resetVsmgs('contactForm');
    openDialog('dialogContact');
}

function clearAddContactForm() {
    let nameInputElem= document.getElementById('nameInputElem');
    let emailInputElem= document.getElementById('emailInputElem');
    let phoneInputElem= document.getElementById('phoneInputElem');
    nameInputElem.value= '';
    emailInputElem.value= '';
    phoneInputElem.value= '';
}

function setContactDialogAdd() {
    let headline= document.getElementById('CDheadline');
    headline.innerHTML= 'Add contact';
    showElem('CDtagline');
    cdSetPersonIconAdd();
    setFormAdd();
}

function cdSetPersonIconAdd() {
    let personIcon= document.getElementById('cdPersonIcon');
    personIcon.style.backgroundColor= '#D1D1D1';
    hideElem('cdMonogram');
    showElem('cdPersonIconAdd');
}

function setFormAdd() {
    // setInputsAdd();
    setButtonsAdd();
    // addValidation('contactForm', validateContactExisting, 'emailVmsg', 'You already added a contact with this email');
    // removeSubmitHandler('contactForm', submitHandlerEdit);
    addSubmitHandler('contactForm', submitHandlerAdd);
}

function setButtonsAdd() {
    let submitButtonText= document.getElementById('CDsubmitButtonText');
    submitButtonText.innerHTML= 'Create contact';
    hideElem('cdDeleteButton');
    showElem('cdCancelButton');
}

function submitHandlerAdd() {
    console.log('submitHandlerAdd()'); ///DEBUG
}

/*###########*/
/*## MEDIA ##*/
/*###########*/

function mediaChangeHandler() {
    if (mediaDesktop.matches) {
        showElem('detailContainer');
        // hideContactInfoButtonMobile();
    }
    else hideElem('detailContainer');
}