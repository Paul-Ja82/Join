let filteredContactsForTasks = []


/**
 * Filters out null values from the provided contacts and appends a generated contact list template to the DOM.
 *
 * @param {Object} allContactsForTasks - An object containing all contacts, where each contact is associated with a task.
 * @returns {Array} filteredContactsForTasks - An array of contacts excluding null values.
 */
function checkContacts(allContactsForTasks) {
  const contactsArray = Object.values(allContactsForTasks);
  filteredContactsForTasks = [];
  for (let i = 0; i < contactsArray.length; i++) {
    if (contactsArray[i] !== null) { filteredContactsForTasks.push(contactsArray[i]); }
  }
  let contactListTemplate = createContactsTemplate(filteredContactsForTasks);
  document.getElementById("insertContactList").appendChild(contactListTemplate);
  // console.log('es funktioniert immernoch');
}


/**
 * Creates a contact list template based on the provided filtered contacts.
 * If the filtered contact list is empty, a message will be displayed. 
 * For each contact, a list item is created with a checkbox and profile information.
 * 
 * @param {Array} filteredContactsForTasks - An array of contacts to be displayed in the list.
 * @returns {HTMLUListElement} The generated unordered list (ul) element containing the contact list.
 */
function createContactsTemplate(filteredContactsForTasks) {
  let template = document.createElement("ul");
  template.id = "contactListTemplate";

  if (filteredContactsForTasks.length === 0) {
    template.innerHTML = `<li class='emptyListMessage'>Ganz schön leer hier! :(</li>`;
  } else {
    for (let i = 0; i < filteredContactsForTasks.length; i++) {
      let isSelected = '';
      let listPersonId = filteredContactsForTasks[i].id;
      const initials = getInitials(filteredContactsForTasks[i].name);
      let contact = renderShowContacts(listPersonId, initials, isSelected, i);
      template.innerHTML += contact;
    }
  }

  return template;
}


/**
* Renders a list item for each contact in the filtered contacts array.
* Each list item includes the contact's profile, name, initials with a colored background,
* and a checkbox to select/deselect the contact. The checkbox state is pre-filled based on 
* whether the contact is already selected.
*
* @function renderShowContacts
* @returns {string} - A string of HTML that represents the contact list item.
* 
* @description
* This function dynamically creates a list item (`<li>`) for each contact in the `filteredContactsForTasks` array.
* The list item includes:
*  - A profile section with the contact's initials and name.
*  - A background color for the initials, taken from the contact's data.
*  - A checkbox that allows users to select/deselect the contact, with its checked state reflecting if the contact is already selected.
* 
* The checkbox also has event handlers to prevent event bubbling (`event.stopPropagation()`), and to trigger other functions such as `renderAddedPersons()`.
* Additionally, an icon for the checkbox is added at the end of the list item.
* 
* @param {number} listPersonId - The unique ID for each contact in the list.
* @param {Object[]} filteredContactsForTasks - Array of contact objects filtered based on the task.
* @param {boolean} isSelected - Indicates whether the contact is already selected.
* @param {string} initials - The initials of the contact, derived from their name.
*/
function renderShowContacts(listPersonId, initials, isSelected, i) {
  return `<li id="listPerson${listPersonId}" class="backgroundOnHover" onclick="changeCheckbox(${listPersonId})">
            <div class="profile">
              <div class="initialsImg" id="initialsImg${listPersonId}" style="background-color: ${filteredContactsForTasks[i].color}">
                ${initials}
              </div>
              <div id="profilPerson${listPersonId}" class="profilePerson"></div>    
              <div class="contactPerson">${filteredContactsForTasks[i].name}</div>
            </div>
            <input type="checkbox" value="${filteredContactsForTasks[i].name}" class="contactListCheckbox" 
              id="checkbox${filteredContactsForTasks[i].id}" onchange="renderAddedPersons()" 
              onclick="event.stopPropagation()" 
              ${isSelected ? "checked" : ""}
            >
            <img id="checkboxId${listPersonId}" src="assets/icons/checkbox.svg">
          </li>`;
}