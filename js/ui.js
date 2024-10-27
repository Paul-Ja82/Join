
/*#############*/
/*## INCLUDE ##*/
/*#############*/

async function include() {
    let containers= document.querySelectorAll('[data-include]');
    for (let containerI of containers) {
        let url= containerI.dataset.include;
        let content= await fetch(url).then(res=>res.text());
        containerI.innerHTML= content;
    }
}

/*##########################*/
/*## SHOW / HIDE ELEMENTS ##*/
/*##########################*/

function showElem(elemId) {
    let elem = document.getElementById(elemId);
    elem.classList.remove('d-none');
}

function hideElem(elemId) {
    let elem = document.getElementById(elemId);
    elem.classList.add('d-none');
}