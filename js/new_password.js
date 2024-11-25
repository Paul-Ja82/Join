// let currentUser;

/*##########*/
/*## INIT ##*/
/*##########*/

function initNewPassword() {
    loadUsers()
        .then(loadCurrentUser);
    initForms();
    addValidation('formNewPw', isPasswordConfirm, 'vmsgPwConfirm', 'The passwords dont match');
    addSubmitHandler('formNewPw', updateUserPw);
    addSubmitHandler('formNewPw', afterPwChangeHandler);
}

function isPasswordConfirm() {
    let pw= document.getElementById('newPassword').value;
    let pwConfirm= document.getElementById('passwordInput').value;
    return pw == pwConfirm;
}

function loadCurrentUser() {
    let params = new URLSearchParams(document.location.search);
    currentUser= getUserById(params.get('id'));
    console.log(currentUser); ///DEBUG
}

/*#####################*/
/*## UPDATE PASSWORD ##*/
/*#####################*/

function updateUserPw() {
    let newPassword= document.getElementById('newPassword').value;
    let path= USERS_PATH + `${currentUser.id}/${'pw'}`;
    console.log(path); ///DEBUG
    saveData(path, newPassword);
}

function afterPwChangeHandler() {
    showToast('pwChangeToast', ()=> loadPage(INDEXPAGE_URLS[0]));
}