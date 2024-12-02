let validations = [];
let submitHandlers = [];
let defaultVsmgs= [];

let invalidStyleClass= 'validate-input';

/*##########*/
/*## INIT ##*/
/*##########*/

/**
 * Initializes forms by setting up form tracking, adding submit and input event handlers,
 * and preparing validation messages.
 */
function initForms() {
    graspForms();
    addMainSubmitHandlers();
    addInputHandlers();
    graspVmsgs();
}

/**
 * Adds submit event handlers to all forms, attaching the main submit handler.
 */
function addMainSubmitHandlers() {
    let forms = document.forms;
    for (let i = 0; i < forms.length; i++) {
        forms.item(i).addEventListener('submit', mainSubmit);
    }
}

/**
 * Collects all forms and initializes their validation and submit handler structures.
 */
function graspForms() {
    let formsCol = document.forms;
    let formId;
    for (let i = 0; i < formsCol.length; i++) {
        formId = formsCol.item(i).id;
        validations[formId] = [];
        submitHandlers[formId] = [];
    }
}

/**
 * Adds input event handlers to all input elements, enabling validation and form validation checks on input.
 */
function addInputHandlers() {
    let inputs = document.querySelectorAll('input');
    for (let inputI of inputs) {
        inputI.addEventListener('input', event => {
            let form = document.querySelector(`form:has(#${inputI.id})`);
            inputI.classList.add(invalidStyleClass); 
            validateInput(inputI);
            isFormValidBuiltIn(form.id);
        });
    }
}

/**
 * Adds focus event handlers to all input elements, triggering the addition of invalid styles on focus.
 */
function addFocusHandlers() {
    let inputs = document.querySelectorAll('input');
    for (let inputI of inputs) {
        inputI.addEventListener('focus', addInvalidStyles);
    }
}

/**
 * Removes focus event handlers from all input elements.
 */
function removeFocusHandlers() {
    let inputs = document.querySelectorAll('input');
    for (let inputI of inputs) {
        inputI.removeEventListener('focus', addInvalidStyles);
    }
}

/**
 * Collects all validation message elements and stores their default content.
 */
function graspVmsgs() {
    let vmsgElems = document.querySelectorAll('p.validation-message');
    for (let elemI of vmsgElems) {
        defaultVsmgs[elemI.id] = elemI.innerHTML;
    }
}

/**
 * Adds invalid style classes to all input elements and validates their content.
 * Removes focus handlers after applying styles.
 */
function addInvalidStyles() {
    let inputs = document.querySelectorAll('input');
    for (let inputI of inputs) {
        inputI.classList.add(invalidStyleClass);
        validateInput(inputI);
    }
    removeFocusHandlers();
}


/*############*/
/*## SUBMIT ##*/
/*############*/

/**
 * Handles the main submit event for a form, preventing default submission,
 * validating the form, and executing associated submit handlers if valid.
 * @param {Event} event - The submit event triggered by the form.
 * @async
 */
async function mainSubmit(event) {
    event.preventDefault();
    let formId = event.srcElement.id;
    if (isFormValidBuiltIn(formId) && await isFormValid(formId)) {
        for (let submitHandlerI of submitHandlers[formId]) {
            await submitHandlerI();
        }
    }
}

/**
 * Adds a custom submit handler function to a specified form.
 * @param {string} formId - The ID of the form.
 * @param {Function} handlerFunction - The submit handler function to add.
 */
function addSubmitHandler(formId, handlerFunction) {
    submitHandlers[formId].push(handlerFunction);
}

/**
 * Removes a specific submit handler function from a specified form.
 * @param {string} formId - The ID of the form.
 * @param {Function} handlerFunc - The submit handler function to remove.
 */
function removeSubmitHandler(formId, handlerFunc) {
    let arrayIndex = submitHandlers[formId].indexOf(handlerFunc);
    submitHandlers[formId].splice(arrayIndex, 1);
}

/**
 * Validates a form by executing all associated validation rules asynchronously.
 * @param {string} formId - The ID of the form to validate.
 * @returns {Promise<boolean>} True if the form is valid, otherwise false.
 * @async
 */
async function isFormValid(formId) {
    let isFormValid = true;
    for (let validationI of validations[formId]) {
        isFormValid = isFormValid && await validate(validationI);
    }
    return isFormValid;
}

/**
 * Validates a form using built-in HTML validation rules, enables the submit button if valid,
 * and disables it otherwise.
 * @param {string} formId - The ID of the form to validate.
 * @returns {boolean} True if the form is valid based on built-in rules, otherwise false.
 */
function isFormValidBuiltIn(formId) {
    let inputs = document.querySelectorAll(`#${formId} input`);
    let submitButtonId = document.querySelector(`#${formId} button[type=submit]`).id;
    let isFormValidBuiltIn = true;
    for (let inputI of inputs) {
        isFormValidBuiltIn = isFormValidBuiltIn && inputI.validity.valid;
    }
    if (isFormValidBuiltIn) enableButton(submitButtonId);
    else disableButton(submitButtonId);
    return isFormValidBuiltIn;
}


/*#################*/
/*## VALIDATIONS ##*/
/*#################*/

/**
 * Adds a custom validation function to a specified form, along with its validation message.
 * @param {string} formId - The ID of the form to which the validation is added.
 * @param {Function} validFunc - The validation function to execute.
 * @param {string} vmsgId - The ID of the validation message element.
 * @param {string} vmsg - The validation message to display if invalid.
 */
function addValidation(formId, validFunc, vmsgId, vmsg) {
    let vmsgElem = document.getElementById(vmsgId);
    let validation = {
        'validFunc': validFunc,
        'vmsgElem': vmsgElem,
        'vmsg': vmsg
    };
    validations[formId].push(validation);
}

/**
 * Removes a specific validation function from a form.
 * @param {string} formId - The ID of the form from which the validation is removed.
 * @param {Function} validFunc - The validation function to remove.
 */
function removeValidation(formId, validFunc) {
    let validationsArray = validations[formId];
    let arrayIndex = validationsArray.findIndex(validationI => validationI.validFunc == validFunc);
    validations[formId].splice(arrayIndex, 1);
}

/**
 * Validates an input element using built-in HTML validation and updates its validation message.
 * @param {HTMLElement} input - The input element to validate.
 * @returns {boolean} True if the input is valid, otherwise false.
 */
function validateInput(input) {
    let vmsgElemId = input.dataset.validationmessageid;
    let vmsg = defaultVsmgs[vmsgElemId];
    if (input.validity.valid) {
        if (vmsgElemId) hideValidationMessage(vmsgElemId, vmsg);
        return true;
    } else {
        showValidationMessage(vmsgElemId, vmsg);
        return false;
    }
}

/**
 * Executes a custom validation function and updates its validation message.
 * @param {Object} validation - An object containing the validation function and message details.
 * @returns {Promise<boolean>} True if the custom validation function returns valid, otherwise false.
 */
async function validate(validation) {
    let isValid = await validation.validFunc();
    if (isValid) {
        return true;
    } else {
        showValidationMessage(validation.vmsgElem.id, validation.vmsg);
        return false;
    }
}


/*########*/
/*## UI ##*/
/*########*/

/**
 * Displays a validation message by updating the element's content and removing its hidden state.
 * @param {string} elemId - The ID of the element where the validation message will be displayed.
 * @param {string} msg - The validation message to display.
 */
function showValidationMessage(elemId, msg) {
    let vmsgElem = document.getElementById(elemId);
    vmsgElem.innerHTML = msg;
    vmsgElem.classList.remove('v-hidden');
}

/**
 * Hides a validation message by adding a hidden state to the element.
 * @param {string} elemId - The ID of the element where the validation message will be hidden.
 */
function hideValidationMessage(elemId) {
    document.getElementById(elemId).classList.add('v-hidden');
}

/**
 * Enables a button by removing its disabled state.
 * @param {string} buttonId - The ID of the button to enable.
 */
function enableButton(buttonId) {
    let button = document.getElementById(buttonId);
    button.disabled = false;
}

/**
 * Disables a button by setting its disabled state.
 * @param {string} buttonId - The ID of the button to disable.
 */
function disableButton(buttonId) {
    let button = document.getElementById(buttonId);
    button.disabled = true;
}

/**
 * Resets all validation messages within a form to their default state and hides them.
 * @param {string} formId - The ID of the form whose validation messages will be reset.
 */
function resetVsmgs(formId) {
    let vsmgs = document.querySelectorAll(`#${formId} .validation-message`);
    for (let vsmgI of vsmgs) {
        let elemId = vsmgI.id;
        vsmgI.innerHTML = defaultVsmgs[elemId];
        hideValidationMessage(elemId);
    }
}


