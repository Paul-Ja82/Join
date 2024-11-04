let nameInput;
let emailInput;
let phoneInput;

let emailAvailableContactFlag= false;

let mediaDesktop = window.matchMedia('(768px < width)');
mediaDesktop.addEventListener('change', mediaChangeHandler);

/*##########*/
/*## INIT ##*/
/*##########*/

function initContact() {
    console.log('intitContact()'); ///DEBUG
    initJoin();
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

    showElem('detailContainer');
    showContactInfoButtonMobile();
}

/*##################*/
/*## INFO SECTION ##*/
/*##################*/

function showInfo() {
    console.log('showInfo()'); ///DEBUG
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

/*####################*/
/*## CONTACT DETAIL ##*/
/*####################*/

function closeDetailButtonHandler() {
    hideElem('detailContainer');
    hideContactInfoButtonMobile();
}

function showContactInfoButtonMobile() {
    hideElem('newContactButton');
    showElem('contactInfoButtonMobile');
}

function hideContactInfoButtonMobile() {
    hideElem('contactInfoButtonMobile');
    showElem('newContactButton');
}

/*#################*/
/*## ADD CONTACT ##*/
/*#################*/

function createContactHandler() {
    loadInputValuesAddContact();
    checkEmailAvailableContact();
    if (emailAvailableContactFlag) {
        addContact();
        // Toast anzeigen
        // Dialog schließen
    } else {
        console.warn('Contact mit dieser mail existiert bereits');
    }
}

function loadInputValuesAddContact() {
    nameInput = document.getElementById('nameInputElem').value;
    emailInput= document.getElementById('emailInputElem').value;
    phoneInput= document.getElementById('phoneInputElem').value;
}

function checkEmailAvailableContact() {
    let contact= contacts.find(contactI => contactI.email == emailInput);
    if (contact) emailAvailableContactFlag= false;
    else return emailAvailableContactFlag= true;
}

async function addContact() {
    let newId = await getId();
    let path = CONTACTS_PATH + currentUser.id + '/' + newId;
    let colorHex= getRandomColorHex();
    let newContact = {
        id: newId,
        name: nameInput,
        email: emailInput,
        phone: phoneInput,
        color: colorHex
    };
    saveData(path, newContact);
    contacts.push(newContact);
    //TODO Show Toast
    console.log('addContact(): Contact wird angelegt.', newContact); ///DEBUG
}

/*########################*/
/*## ADD CONTACT DIALOG ##*/
/*########################*/

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
    addSubmitHandler('contactForm', createContactHandler);
}

function setButtonsAdd() {
    let submitButtonText= document.getElementById('CDsubmitButtonText');
    submitButtonText.innerHTML= 'Create contact';
    hideElem('cdDeleteButton');
    showElem('cdCancelButton');
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





/*###########*/
/*## DEBUG ##*/
/*###########*/

function tuEsContact() {

}

function logVarsContact() {
    console.log(nameInput); ///DEBUG
    console.log(emailInput); ///DEBUG
    console.log(phoneInput); ///DEBUG
}