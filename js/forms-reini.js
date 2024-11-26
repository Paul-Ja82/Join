let validations = [];
let submitHandlers = [];
let defaultVsmgs= [];

let invalidStyleClass= 'validate-input';

/*##########*/
/*## INIT ##*/
/*##########*/

function initForms() {
    graspForms();
    addMainSubmitHandlers();
    addInputHandlers();
    addFocusHandlers();
    graspVmsgs();
}

function addMainSubmitHandlers() {
    let forms = document.forms;
    for (let i = 0; i < forms.length; i++) {
        forms.item(i).addEventListener('submit', mainSubmit);
    }
}

function graspForms() {
    let formsCol = document.forms;
    let formId;
    for (let i = 0; i < formsCol.length; i++) {
        formId = formsCol.item(i).id;
        validations[formId] = [];
        submitHandlers[formId] = [];
    }
}

// Bei jeder Eingabe in ein Input-Feld wird überprüft ob es valid ist, sonst wird vmsg angezeigt
// Es wird überprüft ob alle Felder sind, dann wird submit-Button aktiviert
function addInputHandlers() {
    let inputs = document.querySelectorAll('input');
    for (let inputI of inputs) {
        inputI.addEventListener('input', event => {
            let form= document.querySelector(`form:has(#${inputI.id})`);
            validateInput(inputI);
            isFormValidBuiltIn(form.id);
        });
    }
}

// Nach dem Laden der Seite werden keine Styles angewendet wenn ein Feld invalid ist. Das passiert erst nachdem der User ein beliebiges Feld fokusiert hat.
function addFocusHandlers() {
    let inputs = document.querySelectorAll('input');
    for (let inputI of inputs) {
        inputI.addEventListener('focus', addInvalidStyles);
        // validateInput(inputI);
    }
}

// Nach dem ersten mal Fukusieren eines Felds in einem Formular, werden alle Focushandler wieder gelöscht damit sie nicht bei jedem weiteren Fokusieren feuern
function removeFocusHandlers() {
    let inputs = document.querySelectorAll('input');
    for (let inputI of inputs) {
        inputI.removeEventListener('focus', addInvalidStyles);
    }
}

function graspVmsgs() {
    let vmsgElems= document.querySelectorAll('p.validation-message');
    for (let elemI of vmsgElems) {
        defaultVsmgs[elemI.id]= elemI.innerHTML;
    }
}

function addInvalidStyles() {
    let inputs= document.querySelectorAll('input');
    for (let inputI of inputs) {
        inputI.classList.add(invalidStyleClass);
        validateInput(inputI);
    }
    removeFocusHandlers();
}

/*############*/
/*## SUBMIT ##*/
/*############*/

// wird beim submit ausgeführt
// überprüft ob alle felder valid sind und führt dann alle dem Formular zugehörigen submit-Funktionen aus
// mit addSubmitHandler kann man Submit-Funktionen zu einem Formular hinzufügen
async function mainSubmit(event) {
    event.preventDefault();
    let formId = event.srcElement.id;
    if (isFormValidBuiltIn(formId) && await isFormValid(formId)) {
        for (let submitHandlerI of submitHandlers[formId]) {
            await submitHandlerI();
        }
    }
}

function addSubmitHandler(formId, handlerFunction) {
    submitHandlers[formId].push(handlerFunction);
}

function removeSubmitHandler(formId, handlerFunc) {
    let arrayIndex= submitHandlers[formId].indexOf(handlerFunc);
    submitHandlers[formId].splice(arrayIndex, 1);
}

//überpfüft die vom user hinzugefügten validationen
async function isFormValid(formId) {
    let isFormValid = true;
    for (let validationI of validations[formId]) {
        isFormValid = isFormValid && await validate(validationI);
    }
    return isFormValid;
}

//überprüft die standard-validationen, die mit den html-attributen gesetzt wurden für alle felder des Formulars
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

function addValidation(formId, validFunc, vmsgId, vmsg) {
    let vmsgElem = document.getElementById(vmsgId);
    let validation = {
        'validFunc': validFunc,
        'vmsgElem': vmsgElem,
        'vmsg': vmsg
    }
    validations[formId].push(validation);
}

function removeValidation(formId, validFunc) {
    let validationsArray= validations[formId];
    let arrayIndex= validationsArray.findIndex(validationI => validationI.validFunc==validFunc);
    validations[formId].splice(arrayIndex, 1);
}

//überprüft die standard-validationen, die mit den html-attributen gesetzt wurden für ein bestimmtes feld
//wenn nicht valid wird vmsg angezeigt
function validateInput(input) {
    let vmsgElemId = input.dataset.validationmessageid;
    let vmsg = defaultVsmgs[vmsgElemId];
    if (input.validity.valid) {
        if (vmsgElemId) hideValidationMessage(vmsgElemId, vmsg);
        return true;
    }
    else {
        showValidationMessage(vmsgElemId, vmsg);
        return false;
    }
}

//überprüft die eine vom user hinzugefügte validation
//wenn nicht valid wird vmsg angezeigt
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

function showValidationMessage(elemId, msg) {
    let vmsgElem = document.getElementById(elemId);
    vmsgElem.innerHTML = msg;
    vmsgElem.classList.remove('v-hidden');
}

function hideValidationMessage(elemId) {
    document.getElementById(elemId).classList.add('v-hidden');
}

function enableButton(buttonId) {
    let button = document.getElementById(buttonId);
    button.disabled = false;
}

function disableButton(buttonId) {
    let button = document.getElementById(buttonId);
    button.disabled = true;
}

function resetForm(formId) {
    let inputs= document.querySelectorAll(`#${formId} .${invalidStyleClass}`);
    for (let inputI of inputs) {
        inputI.classList.remove(invalidStyleClass);
    }
}

function resetVsmgs(formId) {
    let vsmgs= document.querySelectorAll(`#${formId} .validation-message`);
    for (let vsmgI of vsmgs) {
        let elemId= vsmgI.id;
        vsmgI.innerHTML= defaultVsmgs[elemId];
        hideValidationMessage(elemId);
    }
}

