
/*############*/
/*## TOASTS ##*/
/*############*/

/*** Init ***/
/************/


function initToastPlay() {
    addTransitionEndHandler();
}

function addTransitionEndHandler() {
    let toastElems = document.querySelectorAll('.toast');
    for (let toastI of toastElems) {
        toastI.addEventListener('transitionend', endTransitionHandler);
    }
}

function endTransitionHandler(event) {
    console.log('endTransitionHandler(event)'); ///DEBUG
    if (event.propertyName == 'bottom') {
        let toastElem = event.target;
        let duration = toastElem.dataset.duration;
        let afterFunctionName= toastElem.dataset.afterfunc;
        let afterFunction= window[afterFunctionName];
        setTimeout(() => {
            hideToast(toastElem);
            if (afterFunction) afterFunction();
        }, duration);
    }
}
// function endTransitionHandler(event) {
//     if (event.propertyName == 'bottom') {
//         let toastElem = event.target;
//         let duration = toastElem.dataset.duration;
//         setTimeout(() => { hideToast(toastElem); }, duration);
//     }
// }

/*** Show / Hide ***/
/*******************/

function showToast(elemId, func) {
    let toastElem= document.getElementById(elemId);
    let duration= parseInt(toastElem.dataset.duration);
    showElem('toastBg');
    setTimeout(()=>{toastElem.classList.add('show-toast');},100);
    setTimeout(()=>{
        hideToast(toastElem);
        if (func) func();
    },duration);
}

function hideToast(toastElem) {  
    hideElem('toastBg');
    toastElem.classList.remove('show-toast');
}

/*** Misc ***/
/************/

function getCSSvarValue(key) {
    let rootElem= document.querySelector(':root');
    let rootElemStyle= window.getComputedStyle(rootElem); 
    return rootElemStyle.getPropertyValue(key);
}

function getMsValue(text) {
    let textMatch= text.match(/(?<number>(^\d*\.?\d*))(?<unit>(s|ms))$/);
    let number= textMatch.groups.number;
    let unit= textMatch.groups.unit;
    if (unit=='s') return number*1000;
    else return number;
}

/*#############*/
/*## DIALOGS ##*/
/*#############*/

// document.addEventListener('DOMContentLoaded', initDialog);

/*** Init ***/
/************/

function initDialog() {
    addBgClickHandlers();
}

function addBgClickHandlers() {
    let dialogs = document.querySelectorAll('.dialog');
    for (let dialogI of dialogs) {
        let dialogId = dialogI.id;
        addDialogBgClickHandler(dialogId);
    }
}

function addDialogBgClickHandler(dialogId) {
    let dialogElem;
    let dialogBG = document.getElementById('dialogBg');
    dialogBG.addEventListener('click', (event) => {
        dialogElem = document.querySelector('.dialog:not(.d-none)');
        if (!dialogElem.contains(event.target)) {
            closeDialog();
        }
    });
}

/*** Show / Hide ***/
/*******************/

function openDialog(elemId) {
    showElem('dialogBg');
    hideDialogs();
    showElem(elemId);
}

function closeDialog() {
    hideElem('dialogBg');
}

function hideDialogs() {
    let dialogs = document.querySelectorAll('.dialog');
    for (let dialogI of dialogs) {
        hideElem(dialogI.id);
    }
}

function placeDialog(elemId, x, y) {
    let dialog = document.getElementById(elemId);
    dialog.style.top = y + 'px';
    dialog.style.left = x + 'px';
}