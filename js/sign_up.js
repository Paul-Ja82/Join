let users= [
    {
        userId: 1,
        name: 'Fritz',
        email: 'fritz@irgendwas.test'
    },
    {
        userId: 2,
        name: 'sepp',
        email: 'sepp@irgendwas.test'
    },
];


function signup() {
    console.log('signUp()'); ///DEBUG
    //Kotrolle User existing
    if (isUserExisting) {
        //Fehler anzeigen
    }
    else {
        //User anlagen wenn passt
        //Toast anzeigen
        //login seite laden
    }
}

function isUserExisting() {
    let emailInput= document.getElementById('emailInput').value;
    let user= getUser(emailInput);
    console.log(user); ///DEBUG
    if (user) console.log('Fehler. User existiert'); ///DEBUG
    else console.log('User kann angelegt werden'); ///DEBUG
    return false;
}

function getUser(eMail) {
    return users.find((userI)=>{
        return userI.email == eMail;
    });
}



