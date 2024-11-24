let itemMarkClass = 'conlist-item-marked';
let itemHoverClass = 'conlist-item-hover';
let shownContactInfoId;

// let nameInput;
// let emailInput;
// let phoneInput;

// let emailAvailableContactFlag = false;

// let mediaDesktop = window.matchMedia('(768px < width)');
let mediaDesktop = window.matchMedia('(1010px < width)');
mediaDesktop.addEventListener('change', mediaChangeHandler);

/*##########*/
/*## INIT ##*/
/*##########*/

async function initContact() {
    await initJoin();
    initForms();
    include()
        .then(initHeaderJs);
    mediaChangeHandler();
    generateContactList();
    addListItemClickHandlers();
}

function addListItemClickHandlers() {
    let listItems = document.querySelectorAll('.conlist-item');
    for (itemI of listItems) {
        itemI.addEventListener('click', listItemClickHandler);
    }
}

/*##############*/
/*## DATABASE ##*/
/*##############*/

function saveContacts() {
    saveData(CONTACTS_PATH, contacts);
}

/*###########################*/
/*## GENERATE CONTACT LIST ##*/
/*###########################*/

function generateContactList() {
    let contactListContainer = document.getElementById('contactListContainer');
    let content = '';
    let currentLetter = '@';
    sortContactsByName();
    for (let contactI of contacts) {
        let contactLetter = getFirstLetter(contactI.name).toUpperCase();
        if (contactLetter > currentLetter) {
            currentLetter = contactLetter.toUpperCase();
            content += `<h3 class="conlist-heading">${currentLetter}</h3>`;
        }
        content += contactToListItemHTML(contactI, 'conlistItem' + contactI.id);
    }
    contactListContainer.innerHTML = content;
}

// contact: {email, name, phone, color}
function contactToListItemHTML(contact, elemId) {
    let personIconColor = isColorLight(contact.color) ? 'black' : 'white';
    let contactMonogram = getMonogram(contact.name);
    return `
        <div id="${elemId}" class="conlist-item conlist-item-hover flex-row h-pointer" data-contactid="${contact.id}">
            <div class="person-icon conlist-person-icon" style="background-color:${contact.color};color:${personIconColor}">
                <p>${contactMonogram}</p>
            </div>
            <div class="conlist-name-wrapper">
                <p class="conlist-name">${contact.name}</p>
                <p class="conlist-email">${contact.email}</p>
            </div>
        </div> 
    `;
}



/*##################*/
/*## CONTACT LIST ##*/
/*##################*/

function listItemClickHandler(event) {
    shownContactInfoId = event.currentTarget.dataset.contactid;
    if (mediaDesktop.matches) displayInfoDesktop(event);
    else displayInfoMobile(event);
}

function addHoverClassAllListItems() {
    let listItems = document.querySelectorAll('.conlist-item');
    for (itemI of listItems) {
        itemI.classList.add(itemHoverClass);
    }
}

/*##################*/
/*## INFO SECTION ##*/
/*##################*/

function showInfo(contactId) {
    setInfo(contactId);
    let infoContainer = document.getElementById('infoContainer');
    infoContainer.classList.add('show-info');
}

function hideInfo() {
    let infoContainer = document.getElementById('infoContainer');
    infoContainer.classList.remove('show-info');
}

function setInfo(contactId) {
    let contact = getContactById(contactId);
    let personIconFontColor = isColorLight(contact.color) ? 'black' : 'white';
    let personIconStyle = `background-color:${contact.color};color:${personIconFontColor}`;
    document.getElementById('coninfoPersonIcon').style = personIconStyle;
    document.getElementById('coninfoMonogram').innerHTML = getMonogram(contact.name);
    document.getElementById('coninfoName').innerHTML = contact.name;
    document.getElementById('coninfoEmail').innerHTML = contact.email;
    document.getElementById('coninfoPhone').innerHTML = contact.phone;
}

function displayInfoMobile(event) {
    let contactId = event.currentTarget.dataset.contactid;
    setInfo(contactId);
    showElem('detailContainer');
    document.getElementById('contentContainer').style.overflowY= 'hidden';
    document.getElementById('listContainer').style.height= '100%';
    document.getElementById('contactListContainer').style.overflowY= 'hidden';
    document.getElementById('contactListContainer').style.height= '100%';
    showContactInfoButtonMobile();
}

function displayInfoDesktop(event) {
    let itemId = event.currentTarget.id;
    let itemElem = document.getElementById(itemId);
    let contactId = event.currentTarget.dataset.contactid;
    if (isMarked(itemId, itemMarkClass)) {
        demmarkElem(itemId, itemMarkClass);
        itemElem.classList.add(itemHoverClass);
        hideInfo();
    } else {
        demarkAllElems(itemMarkClass);
        addHoverClassAllListItems();
        markElem(itemId, itemMarkClass);
        itemElem.classList.remove(itemHoverClass);
        showInfo(contactId);
    }
}


/*####################*/
/*## CONTACT DETAIL ##*/
/*####################*/

function closeDetailButtonHandler() {
    // showElem('listContainer');
    hideElem('detailContainer');
    hideContactInfoButtonMobile();
    document.getElementById('contentContainer').style.overflowY= '';
    document.getElementById('listContainer').style.height= '';
    document.getElementById('contactListContainer').style.overflowY= '';
    document.getElementById('contactListContainer').style.height= '';
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
    // loadInputValuesAddContact();
    // checkEmailAvailableContact();
    addContact().then(generateContactList);
    showToast('newContactToast', afterToastHandlerCreateContact);
}
/* 
function createContactHandler() {
    loadInputValuesAddContact();
    // checkEmailAvailableContact();
    if (emailAvailableContactFlag) {
        addContact().then(generateContactList);
        showToast('newContactToast', afterToastHandlerCreateContact);
    } else {
        console.warn('Contact mit dieser mail existiert bereits');
    }
} 
*/

/*
function loadInputValuesAddContact() {
    nameInput = document.getElementById('nameInputElem').value;
    emailInput = document.getElementById('emailInputElem').value;
    phoneInput = document.getElementById('phoneInputElem').value;
}
*/

/* function checkEmailAvailableContact() {
    let contact = contacts.find(contactI => contactI.email == emailInput);
    if (contact) emailAvailableContactFlag = false;
    else return emailAvailableContactFlag = true;
} */

function isEmailAvailable() {
    let emailInput= document.getElementById('emailInputElem').value;
    let contact = contacts.find(contactI => contactI.email == emailInput);
    if (contact) return false;
    else return true;
}

async function addContact() {
    let newId = await getId();
    // let colorHex = getRandomColorHex();
    let colorHex = colorForContact;
    console.log(colorHex); ///DEBUG
    let nameInput= document.getElementById('nameInputElem').value;
    let emailInput= document.getElementById('emailInputElem').value;
    let phoneInput= document.getElementById('phoneInputElem').value;
    let newContact = {
        id: newId,
        name: nameInput,
        email: emailInput,
        phone: phoneInput,
        color: colorHex
    };
    let path= CONTACTS_PATH + newContact.id;
    saveData(path, newContact);
    contacts.push(newContact);
    //TODO Show Toast
}

function afterToastHandlerCreateContact() {
    addListItemClickHandlers();
    closeDialog();
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
    let nameInputElem = document.getElementById('nameInputElem');
    let emailInputElem = document.getElementById('emailInputElem');
    let phoneInputElem = document.getElementById('phoneInputElem');
    nameInputElem.value = '';
    emailInputElem.value = '';
    phoneInputElem.value = '';
    resetForm('contactForm');
    addFocusHandlers();
}

function setContactDialogAdd() {
    let headline = document.getElementById('CDheadline');
    headline.innerHTML = 'Add contact';
    showElem('CDtagline');
    cdSetPersonIconAdd();
    setFormAdd();
}

function cdSetPersonIconAdd() {
    let personIcon = document.getElementById('cdPersonIcon');
    personIcon.style.backgroundColor = '#D1D1D1';
    hideElem('cdMonogram');
    showElem('cdPersonIconAdd');
}

function setFormAdd() {
    setInputsAdd();
    setButtonsAdd();
    addValidation('contactForm', isEmailAvailable, 'emailVmsg', 'You already added a contact with this email');
    removeSubmitHandler('contactForm', createContactHandler);
    addSubmitHandler('contactForm', createContactHandler);
}

function setInputsAdd() {
    let inputEmail = document.getElementById('emailInputElem');
    inputEmail.disabled= false;
}

function setButtonsAdd() {
    let submitButtonText = document.getElementById('CDsubmitButtonText');
    submitButtonText.innerHTML = 'Create contact';
    hideElem('cdDeleteButton');
    showElem('cdCancelButton');
}

/*##################*/
/*## EDIT CONTACT ##*/
/*##################*/


function editContactButtonHandler() {
    // addFocusHandlers();
    setContactDialogEdit();
    closeDialog();
    resetVsmgs('contactForm');
    setTimeout(() => { openDialog('dialogContact') }, 100);
}

function setContactDialogEdit() {
    let headline = document.getElementById('CDheadline');
    headline.innerHTML = 'Edit contact';
    hideElem('CDtagline');
    setPersonIconEdit();
    setFormEdit();
}

function setPersonIconEdit() {
    let contact = getContactById(shownContactInfoId);
    let personIcon = document.getElementById('cdPersonIcon');
    let personIconColor = isColorLight(contact.color) ? 'black' : 'white';
    let monogram = document.getElementById('cdMonogram');
    personIcon.style.backgroundColor = contact.color;
    personIcon.style.color = personIconColor;
    monogram.innerHTML = getMonogram(contact.name);
    showElem('cdMonogram');
    hideElem('cdPersonIconAdd');
}

function setFormEdit() {
    setInputsEdit();
    setButtonsEdit();
    // removeValidation('contactForm', validateContactExisting);
    removeValidation('contactForm', isEmailAvailable);
    removeSubmitHandler('contactForm', addContact);
    removeSubmitHandler('contactForm', submitHandlerEdit);
    addSubmitHandler('contactForm', submitHandlerEdit);
}

function setInputsEdit() {
    let contact = getContactById(shownContactInfoId);
    let inputName = document.getElementById('nameInputElem');
    let inputEmail = document.getElementById('emailInputElem');
    let inputPhone = document.getElementById('phoneInputElem');
    inputName.value = contact.name;
    inputEmail.value = contact.email;
    inputEmail.disabled = true;
    inputPhone.value = contact.phone;
}

function setButtonsEdit() {
    let submitButtonText = document.getElementById('CDsubmitButtonText');
    submitButtonText.innerHTML = 'Save';
    showElem('cdDeleteButton');
    hideElem('cdCancelButton');
}

function submitHandlerEdit() {
    // loadInputValuesAddContact();
    editContact().then(generateContactList);
    showToast('editContactToast', afterToastHandlerEditContact);
}

async function editContact() {
    let path = CONTACTS_PATH + shownContactInfoId;
    let contact = getContactById(shownContactInfoId);
    let nameInput= document.getElementById('nameInputElem').value;
    let phoneInput= document.getElementById('phoneInputElem').value;
    contact.name = nameInput;
    contact.phone = phoneInput;
    // TODO set color
    saveData(path, contact);
}

/*####################*/
/*## DELETE CONTACT ##*/
/*####################*/

function deleteButtonHandler() {
    deleteContact(shownContactInfoId)
        .then(() => {
            showToast('deleteContactToast', afterToastHandlerDeleteContact);
        });
}

async function deleteContact(contactId) {
    let contact= getContactById(contactId);
    let index= contacts.indexOf(contact);
    console.log('index: ', index); ///DEBUG
    contacts.splice(index, 1);
    saveData(CONTACTS_PATH, contacts);
}

async function afterToastHandlerDeleteContact() {
    await loadContacts();
    generateContactList();
    addListItemClickHandlers();
    closeDialog();
    mediaDesktop.matches ? hideInfo() : closeDetailButtonHandler();
}

async function afterToastHandlerEditContact() {
    afterToastHandlerDeleteContact();
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
    getData(CONTACTS_PATH)
}

function logDB() {
    getData('')
        .then(data => console.log(data));
}

function logContactsFromDB() {
    getData(CONTACTS_PATH)
        .then(cons => {
            console.log(cons); ///DEBUG
            console.log(JSON.stringify(cons)); ///DEBUG
        });
}

function deleteContacts() {
    saveData(CONTACTS_PATH, {});
    
}