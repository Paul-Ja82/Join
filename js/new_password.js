/**
 * Initializes the new password setup by loading user data, configuring forms,
 * and adding validation and submit handlers.
 */
function initNewPassword() {
    loadUsers()
        .then(loadCurrentUser);
    initForms();
    addValidation('formNewPw', isPasswordConfirm, 'vmsgPwConfirm', 'The passwords dont match');
    addSubmitHandler('formNewPw', updateUserPw);
    addSubmitHandler('formNewPw', afterPwChangeHandler);
}

/**
 * Checks if the new password and confirmation password match.
 * @returns {boolean} True if the passwords match, otherwise false.
 */
function isPasswordConfirm() {
    let pw = document.getElementById('newPassword').value;
    let pwConfirm = document.getElementById('passwordInput').value;
    return pw == pwConfirm;
}

/**
 * Loads the current user based on the ID retrieved from the URL parameters.
 */
function loadCurrentUser() {
    let params = new URLSearchParams(document.location.search);
    currentUser = getUserById(params.get('id'));
}

/**
 * Updates the user's password by saving the new password to the specified storage path.
 */
function updateUserPw() {
    let newPassword = document.getElementById('newPassword').value;
    let path = USERS_PATH + `${currentUser.id}/${'pw'}`;
    saveData(path, newPassword);
}

/**
 * Handles post-password change actions by displaying a confirmation toast
 * and redirecting the user to the index page.
 */
function afterPwChangeHandler() {
    showToast('pwChangeToast', () => loadPage(INDEXPAGE_URLS[0]));
}
