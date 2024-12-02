/* 
#################
TABLE OF CONTENTS
#################
01.) ## INIT ##
02.) ## DATABASE ##
03.) ## GENERATE CONTACT LIST ##
04.) ## CONTACT LIST ##
05.) ## INFO SECTION ##
06.) ## CONTACT DETAIL ##
07.) ## ADD CONTACT ##
08.) ## ADD CONTACT DIALOG ##
09.) ## EDIT CONTACT ##
10.) ## DELETE CONTACT ##
11.) ## MEDIA ##
*/

const USER_COLOR= '#2A3647';
const USER_PHONE= '';

let itemMarkClass = 'conlist-item-marked';
let itemHoverClass = 'conlist-item-hover';
let shownContactInfoId;

let mediaDesktop = window.matchMedia('(1010px < width)');
mediaDesktop.addEventListener('change', mediaChangeHandler);


/*##########*/
/*## INIT ##*/
/*##########*/

/**
 * Initializes the contact page by loading user data, setting up forms, and generating the contact list.
 * @async
 */
async function initContact() {
    await initJoin();
    await loadCurrentUserContact();
    initForms();
    include().then(initHeaderJs);
    mediaChangeHandler();
    generateContactList();
    addListItemClickHandlers();
    colorForContact = getRandomColorHex();
}

/**
 * Attaches click event handlers to each contact list item.
 */
function addListItemClickHandlers() {
    let listItems = document.querySelectorAll('.conlist-item');
    for (itemI of listItems) {
        itemI.addEventListener('click', listItemClickHandler);
    }
}

/**
 * Loads the current user's contact data from the session storage and adds it to the contacts list.
 * @async
 */
async function loadCurrentUserContact() {
    let userId = window.sessionStorage.getItem('loggedInUserId');
    currentUser = await getData(USERS_PATH + userId);
    if (currentUser) {
        if (!currentUser.color) currentUser.color = USER_COLOR;
        if (!currentUser.phone) currentUser.phone = USER_PHONE;
        contacts.push(currentUser);
    }
}


/*##############*/
/*## DATABASE ##*/
/*##############*/

/**
 * Saves the current contacts data to the specified storage path.
 */
function saveContacts() {
    saveData(CONTACTS_PATH, contacts);
}


/*###########################*/
/*## GENERATE CONTACT LIST ##*/
/*###########################*/

/**
 * Generates the contact list by sorting contacts alphabetically, grouping them by initial letters, 
 * and rendering them into the contact list container.
 */
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
    if (currentUser) markUserContactItem();
}
// contact: {email, name, phone, color}
/**
 * Generates the HTML for a contact list item with the provided contact data and element ID.
 * @param {Object} contact - The contact object containing details like name, email, and color.
 * @param {string} elemId - The unique ID for the HTML element.
 * @returns {string} The generated HTML string for the contact list item.
 */
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

/**
 * Highlights the current user's contact item in the contact list by adding a specific CSS class.
 */
function markUserContactItem() {
    let elemId = 'conlistItem' + currentUser.id;
    let listItem = document.getElementById(elemId);
    listItem.classList.add('userListItem');
}


/*##################*/
/*## CONTACT LIST ##*/
/*##################*/

/**
 * Handles the click event for a contact list item, retrieves the contact's details,
 * sets the contact's color, and displays the contact info based on the current media query.
 * @param {Event} event - The click event object.
 */
function listItemClickHandler(event) {
    shownContactInfoId = event.currentTarget.dataset.contactid;
    let contact = getContactById(shownContactInfoId);
    colorForContact = contact.color;
    if (mediaDesktop.matches) displayInfoDesktop(event);
    else displayInfoMobile(event);
}

/**
 * Adds a hover effect class to all contact list items.
 */
function addHoverClassAllListItems() {
    let listItems = document.querySelectorAll('.conlist-item');
    for (itemI of listItems) {
        itemI.classList.add(itemHoverClass);
    }
}


/*##################*/
/*## INFO SECTION ##*/
/*##################*/

/**
 * Displays the contact information by setting the contact details and showing the info container.
 * @param {string} contactId - The ID of the contact to display.
 */
function showInfo(contactId) {
    setInfo(contactId);
    let infoContainer = document.getElementById('infoContainer');
    infoContainer.classList.add('show-info');
}

/**
 * Hides the contact information by removing the visibility class from the info container.
 */
function hideInfo() {
    let infoContainer = document.getElementById('infoContainer');
    infoContainer.classList.remove('show-info');
}

/**
 * Updates the contact information details in the info container.
 * @param {string} contactId - The ID of the contact whose details are to be displayed.
 */
function setInfo(contactId) {
    let contact = getContactById(contactId);
    let personIconFontColor = isColorLight(contact.color) ? 'black' : 'white';
    let personIconStyle = `background-color:${contact.color};color:${personIconFontColor}`;
    document.getElementById('coninfoPersonIcon').style = personIconStyle;
    document.getElementById('coninfoMonogram').innerHTML = getMonogram(contact.name);
    document.getElementById('coninfoName').innerHTML = contact.name;
    document.getElementById('coninfoEmail').innerHTML = contact.email;
    document.getElementById('coninfoPhone').innerHTML = contact.phone;
    document.getElementById('coninfoPhone').href = 'tel:' + contact.phone;
}

/**
 * Displays contact information in a mobile view by updating the layout and showing the detail container.
 * @param {Event} event - The event triggered by the user's interaction.
 */
function displayInfoMobile(event) {
    let contactId = event.currentTarget.dataset.contactid;
    setInfo(contactId);
    showElem('detailContainer');
    document.getElementById('contentContainer').style.overflowY = 'hidden';
    document.getElementById('listContainer').style.height = '100%';
    document.getElementById('contactListContainer').style.overflowY = 'hidden';
    document.getElementById('contactListContainer').style.height = '100%';
    showContactInfoButtonMobile();
}

/**
 * Displays contact information in a desktop view by marking the selected item,
 * updating the layout, and toggling the visibility of the info container.
 * @param {Event} event - The event triggered by the user's interaction.
 */
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

/**
 * Handles the close button action for the detail view, hiding the detail container 
 * and resetting the layout to its default state.
 */
function closeDetailButtonHandler() {
    hideElem('detailContainer');
    hideContactInfoButtonMobile();
    document.getElementById('contentContainer').style.overflowY = '';
    document.getElementById('listContainer').style.height = '';
    document.getElementById('contactListContainer').style.overflowY = '';
    document.getElementById('contactListContainer').style.height = '';
}

/**
 * Shows the contact information button in mobile view and updates the button container's style.
 */
function showContactInfoButtonMobile() {
    hideElem('newContactButton');
    showElem('contactInfoButtonMobile');
    let newContactButtonContainer = document.getElementById('newContactButtonContainer');
    newContactButtonContainer.style.backgroundColor = 'var(--clr-bg-main)';
}

/**
 * Hides the contact information button in mobile view and restores the default button container style.
 */
function hideContactInfoButtonMobile() {
    hideElem('contactInfoButtonMobile');
    showElem('newContactButton');
    document.getElementById('newContactButtonContainer').classList.remove('bg-clr-main');
    let newContactButtonContainer = document.getElementById('newContactButtonContainer');
    newContactButtonContainer.style.backgroundColor = '';
}


/*#################*/
/*## ADD CONTACT ##*/
/*#################*/

/**
 * Handles the creation of a new contact by adding the contact, updating the contact list,
 * and showing a confirmation toast.
 */
function createContactHandler() {
    addContact().then(generateContactList);
    showToast('newContactToast', afterToastHandlerCreateContact);
}

/**
 * Checks if the email entered in the input field is available by searching the contacts list.
 * @returns {boolean} True if the email is available, otherwise false.
 */
function isEmailAvailable() {
    let emailInput = document.getElementById('emailInputElem').value;
    let contact = contacts.find(contactI => contactI.email == emailInput);
    return !contact;
}

/**
 * Adds a new contact to the contact list by gathering input values, creating a new contact object,
 * saving it to storage, and updating the global contacts array.
 * @async
 */
async function addContact() {
    let newId = await getId();
    let colorHex = colorForContact;
    let nameInput = document.getElementById('nameInputElem').value;
    let emailInput = document.getElementById('emailInputElem').value;
    let phoneInput = document.getElementById('phoneInputElem').value;
    let newContact = {
        id: newId,
        name: nameInput,
        email: emailInput,
        phone: phoneInput,
        color: colorHex
    };
    let path = CONTACTS_PATH + newContact.id;
    saveData(path, newContact);
    contacts.push(newContact);
}

/**
 * Handles post-toast actions after creating a new contact by re-adding click handlers
 * to the contact list items and closing the dialog.
 */
function afterToastHandlerCreateContact() {
    addListItemClickHandlers();
    closeDialog();
}


/*########################*/
/*## ADD CONTACT DIALOG ##*/
/*########################*/

/**
 * Handles the action of opening the add contact dialog by clearing the form,
 * setting up the dialog for adding a contact, and opening it.
 */
function addContactButtonHandler() {
    clearAddContactForm();
    setContactDialogAdd();
    resetVsmgs('contactForm');
    openDialog('dialogContact');
}

/**
 * Clears the add contact form fields, resets the form state, and sets focus handlers for the inputs.
 */
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

/**
 * Configures the add contact dialog by updating the headline, showing additional elements,
 * and setting the form state for adding a new contact.
 */
function setContactDialogAdd() {
    let headline = document.getElementById('CDheadline');
    headline.innerHTML = 'Add contact';
    showElem('CDtagline');
    cdSetPersonIconAdd();
    setFormAdd();
}

/**
 * Configures the person icon in the add contact dialog by setting its background color
 * and toggling visibility of related elements.
 */
function cdSetPersonIconAdd() {
    let personIcon = document.getElementById('cdPersonIcon');
    personIcon.style.backgroundColor = '#D1D1D1';
    hideElem('cdMonogram');
    showElem('cdPersonIconAdd');
}

/**
 * Sets up the add contact form by configuring inputs, buttons, and validation rules.
 */
function setFormAdd() {
    setInputsAdd();
    setButtonsAdd();
    addValidation('contactForm', isEmailAvailable, 'emailVmsg', 'You already added a contact with this email');
    removeSubmitHandler('contactForm', createContactHandler);
    addSubmitHandler('contactForm', createContactHandler);
}

/**
 * Enables the email input field in the add contact form.
 */
function setInputsAdd() {
    let inputEmail = document.getElementById('emailInputElem');
    inputEmail.disabled = false;
}

/**
 * Configures the buttons in the add contact dialog by setting the submit button text
 * and toggling the visibility of delete and cancel buttons.
 */
function setButtonsAdd() {
    let submitButtonText = document.getElementById('CDsubmitButtonText');
    submitButtonText.innerHTML = 'Create contact';
    hideElem('cdDeleteButton');
    showElem('cdCancelButton');
}


/*##################*/
/*## EDIT CONTACT ##*/
/*##################*/

/**
 * Handles the edit contact button action by setting up the edit contact dialog,
 * resetting validation messages, and reopening the dialog after a brief delay.
 */
function editContactButtonHandler() {
    setContactDialogEdit();
    closeDialog();
    resetVsmgs('contactForm');
    setTimeout(() => { openDialog('dialogContact'); }, 100);
}

/**
 * Configures the edit contact dialog by updating the headline, hiding the tagline,
 * and setting up the form and person icon for editing.
 */
function setContactDialogEdit() {
    let headline = document.getElementById('CDheadline');
    headline.innerHTML = 'Edit contact';
    hideElem('CDtagline');
    setPersonIconEdit();
    setFormEdit();
}

/**
 * Updates the person icon in the edit contact dialog with the current contact's details,
 * including background color, text color, and monogram.
 */
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

/**
 * Configures the form for editing a contact by setting inputs, buttons,
 * updating validation rules, and adding the appropriate submit handler.
 */
function setFormEdit() {
    setInputsEdit();
    setButtonsEdit();
    removeValidation('contactForm', isEmailAvailable);
    removeSubmitHandler('contactForm', addContact);
    removeSubmitHandler('contactForm', submitHandlerEdit);
    addSubmitHandler('contactForm', submitHandlerEdit);
    isFormValidBuiltIn('contactForm');
}

/**
 * Populates the form inputs with the details of the contact being edited
 * and disables the email input field.
 */
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

/**
 * Configures the buttons in the edit contact dialog by updating the submit button text
 * and toggling the visibility of the delete and cancel buttons.
 */
function setButtonsEdit() {
    let submitButtonText = document.getElementById('CDsubmitButtonText');
    submitButtonText.innerHTML = 'Save';
    showElem('cdDeleteButton');
    hideElem('cdCancelButton');
}


/**
 * Handles the submission of the edit contact form, determining whether the edited contact
 * is the current user or another contact and processing the appropriate update.
 */
function submitHandlerEdit() {
    if (isUserContact()) {
        editUserContact().then(generateContactList);
    } else {
        editContact().then(generateContactList);
    }
    showToast('editContactToast', afterToastHandlerEditContact);
}

/**
 * Updates the details of a non-user contact and saves the changes to storage.
 * @async
 */
async function editContact() {
    let path = CONTACTS_PATH + shownContactInfoId;
    let contact = getContactById(shownContactInfoId);
    let nameInput = document.getElementById('nameInputElem').value;
    let phoneInput = document.getElementById('phoneInputElem').value;
    contact.name = nameInput;
    contact.phone = phoneInput;
    contact.color = colorForContact;
    saveData(path, contact);
}

/**
 * Updates the details of the current user contact and saves the changes to storage.
 * Updates session storage and UI elements with the new user information.
 * @async
 */
async function editUserContact() {
    let path = USERS_PATH + shownContactInfoId;
    let nameInput = document.getElementById('nameInputElem').value;
    let phoneInput = document.getElementById('phoneInputElem').value;
    currentUser.name = nameInput;
    currentUser.phone = phoneInput;
    currentUser.color = colorForContact;
    saveData(path, currentUser);
    setUserInStorages(currentUser);
    updateUserMonogram();
}

/**
 * Updates the user's name in localStorage and sessionStorage if the user is logged in.
 * @param {Object} user - The user object containing the updated name.
 */
function setUserInStorages(user) {
    let userLocal = localStorage.getItem('loggedInUserName');
    if (userLocal) localStorage.setItem('loggedInUserName', user.name);
    sessionStorage.setItem('loggedInUserName', user.name);
}

/**
 * Checks if the currently selected contact is the logged-in user.
 * @returns {boolean} True if the selected contact is the current user, otherwise false.
 */
function isUserContact() {
    return currentUser ? shownContactInfoId == currentUser.id : false;
}


/*####################*/
/*## DELETE CONTACT ##*/
/*####################*/

/**
 * Handles the delete button action by deleting the selected contact
 * and showing a confirmation toast after the deletion.
 */
function deleteButtonHandler() {
    deleteContact(shownContactInfoId)
        .then(() => {
            showToast('deleteContactToast', afterToastHandlerDeleteContact);
        });
}

/**
 * Deletes the specified contact from the contacts list and storage.
 * @param {string} contactId - The ID of the contact to delete.
 * @async
 */
async function deleteContact(contactId) {
    let contact = await getContactById(contactId);
    let index = contacts.indexOf(contact);
    let path = CONTACTS_PATH + contact.id;
    contacts.splice(index, 1);
    await deleteData(path, contact);
}

/**
 * Handles actions after a contact is deleted, such as reloading the contact list,
 * updating handlers, and closing dialogs.
 * @async
 */
async function afterToastHandlerDeleteContact() {
    await loadContacts();
    await loadCurrentUserContact();
    generateContactList();
    addListItemClickHandlers();
    closeDialog();
    mediaDesktop.matches ? hideInfo() : closeDetailButtonHandler();
}

/**
 * Handles actions after a contact is edited by invoking the delete contact handler actions.
 * @async
 */
async function afterToastHandlerEditContact() {
    await afterToastHandlerDeleteContact();
}


/*###########*/
/*## MEDIA ##*/
/*###########*/

/**
 * Handles changes in media queries by adjusting the layout for desktop or mobile views.
 * Displays or hides the detail container and resets the contact list selection as needed.
 */
function mediaChangeHandler() {
    if (mediaDesktop.matches) {
        closeDetailButtonHandler();
        showElem('detailContainer');
        hideInfo();
        demarkAllElems(itemMarkClass);
    } else {
        hideElem('detailContainer');
    }
}
