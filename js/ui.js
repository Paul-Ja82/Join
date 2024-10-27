
/*#############*/
/*## INCLUDE ##*/
/*#############*/

async function include() {
    let containers= document.querySelectorAll('[data-include]');
    for (let containerI of containers) {
        let url= containerI.dataset.include;
        let content= await fetch(url).then(res=>res.text());
        console.log(content); ///DEBUG
        containerI.innerHTML= content;
    }
}