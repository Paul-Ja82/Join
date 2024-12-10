/**
 * Validates the title field for the form submission.
 * @function
 * @returns {boolean} True if there is an error, otherwise false.
 */
function titleLengthForSubmit() {
  const title = document.getElementById("title").value.trim();
  if (title.length === 0) {
    document.getElementById("title").style.border = "1px solid #FF8190";
    document.getElementById("errorTitle").style.display = "block";
    return true;
  } else {
    document.getElementById("title").style.border = "none";
    document.getElementById("errorTitle").style.display = "none";
    return false;
  }
}

/**
 * Validates the due date field for the form submission.
 * @function
 * @returns {boolean} True if there is an error, otherwise false.
 */
function validateDueDate() {
  const dueDate = document.getElementById("date").value;
  if (!dueDate) {
    document.getElementById("date").style.border = "1px solid #FF8190";
    document.getElementById("errorDate").style.display = "block";
    return true;
  } else {
    document.getElementById("date").style.border = "none";
    document.getElementById("errorDate").style.display = "none";
    return false;
  }
}

/**
 * Validates the category field for the form submission.
 * @function
 * @returns {boolean} True if there is an error, otherwise false.
 */
function validateCategory() {
  const category = document.getElementById("showSelectedCategory").value;
  if (category.length === 0) {
    document.getElementById("showSelectedCategory").style.border = "1px solid #FF8190";
    document.getElementById("errorCategory").style.display = "block";
    return true;
  } else {
    document.getElementById("showSelectedCategory").style.border = "none";
    document.getElementById("errorCategory").style.display = "none";
    return false;
  }
}

/**
 * Validates and submits the form data after checking errors.
 * @async
 * @function
 * @param {string} selectedProcessCategory - The selected category for the process.
 */
async function submitForm(selectedProcessCategory) {
  let hasError = false;

  hasError = titleLengthForSubmit() || hasError;
  hasError = validateDueDate() || hasError;
  hasError = validateCategory() || hasError;

  if (!hasError) {
    await collectDataFromAddTask(selectedProcessCategory, selectedContacts);
    confirmationOfSendedTask();
  }
}
