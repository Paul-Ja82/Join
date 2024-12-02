/**
 * Validates the form fields and submits the form data if all fields are valid.
 * 
 * This function checks if the title, due date, and category fields have valid values. 
 * If any of the fields are invalid, an error message is displayed and the form is not submitted.
 * If all fields are valid, it proceeds to collect the data and send the task information.
 * 
 * @param {string} selectedProcessCategory - The category of the selected process for the task.
 * @returns {Promise<void>} A promise that resolves when the form submission process is completed.
 */
async function submitForm(selectedProcessCategory) {
    let hasError = false;
    const title = document.getElementById("title").value.trim();
    const dueDate = document.getElementById("date").value;
    const category = document.getElementById("showSelectedCategory").value;
  
    if (title.length === 0) {
      document.getElementById("title").style.border = "1px solid #FF8190";
      document.getElementById("errorTitle").style.display = "block";
      hasError = true;
    } else {
      document.getElementById("title").style.border = "none";
      document.getElementById("errorTitle").style.display = "none";
    }
  
    if (!dueDate) {
      document.getElementById("date").style.border = "1px solid #FF8190";
      document.getElementById("errorDate").style.display = "block";
      hasError = true;
    } else {
      document.getElementById("date").style.border = "none";
      document.getElementById("errorDate").style.display = "none";
    }
  
    if (category.length === 0) {
      document.getElementById("showSelectedCategory").style.border =
        "1px solid #FF8190";
      document.getElementById("errorCategory").style.display = "block";
      hasError = true;
    } else {
      document.getElementById("showSelectedCategory").style.border = "none";
      document.getElementById("errorCategory").style.display = "none";
    }
  
    if (!hasError) {
      await collectDataFromAddTask(selectedProcessCategory, selectedContacts); 
      confirmationOfSendedTask();
    }
  }