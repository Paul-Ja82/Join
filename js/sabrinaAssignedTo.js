async function initAssignedTo() {
    await getIdAndDataForAddTask(pathData='')
    console.log(allContactsForTasks);
    checkAssignToContacts(allContactsForTasks)
}

const input = document.getElementById('inputAssignedTo');
const dropdown = document.getElementById('dropdown');
const showPersonCtn = document.getElementById("showPersons");

// Zeigt das Dropdown an, wenn in das Input-Feld geklickt wird
input.addEventListener('focus', () => {
  dropdown.style.display = 'block';
});

// Fügt ausgewählte Werte ins Eingabefeld ein
dropdown.addEventListener('change', () => {
  const selectedAssignedTo = Array.from(dropdown.querySelectorAll('input:checked'))
    .map(checkbox => checkbox.value)
    // .join(', ');
//   input.value = selected;
  console.log(selectedAssignedTo);
  addInitialsIcon(selectedAssignedTo)
  styleCheckedName(selectedAssignedTo)
});

function addInitialsIcon(selectedAssignedTo) {
    // console.log(filteredContactsForTasks);
    showPersonCtn.innerHTML = "";
    for (let i = 0; i < selectedAssignedTo.length; i++) {
        let selectedName = selectedAssignedTo[i];
        // console.log(selectedName);     
        for (let i = 0; i < filteredContactsForTasks.length; i++) {
            if (filteredContactsForTasks[i].name == selectedName) {
                const initials = getInitials(filteredContactsForTasks[i].name);
                console.log(filteredContactsForTasks[i].name);
                showPersonCtn.innerHTML += `
                <div class="initialsImg" style="background-color:${filteredContactsForTasks[i].color}">
                    ${initials}
                </div>
            `
            }
        }
    }
}

// Schließt das Dropdown, wenn außerhalb geklickt wird
document.addEventListener('click', (e) => {
  if (!input.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.style.display = 'none';
  }
});

function checkAssignToContacts(allContactsForTasks) {
    const contactsArray = Object.values(allContactsForTasks);
    console.log(contactsArray);

    filteredContactsForTasks = [];
    for (let i = 0; i < contactsArray.length; i++) {
        if (contactsArray[i] !== null) {filteredContactsForTasks.push(contactsArray[i]);}
    }
    let contactListTemplate = createContactsTemplateAssignedTo(filteredContactsForTasks);
    console.log(contactListTemplate);
}

function createContactsTemplateAssignedTo(filteredContactsForTasks) {
    dropdown.innerHTML = '';
    if (filteredContactsForTasks.length === 0) {
        dropdown.innerHTML = `<li class='emptyListMessage'>Ganz schön leer hier! :(</li>`;
    } else {
        for (let i = 0; i < filteredContactsForTasks.length; i++) {
        // let isSelected = '';
        let listPersonId = filteredContactsForTasks[i].id;
        const initials = getInitials(filteredContactsForTasks[i].name);
        let contact = renderAssignedToList(listPersonId, initials, filteredContactsForTasks, i);
        // console.log(contact);
        
        dropdown.innerHTML += contact;
        }
    }
    return dropdown
}

function styleCheckedName(selectedAssignedTo) {
      // Alle Stile auf den ursprünglichen Zustand zurücksetzen
    resetStyleAssignedTo(filteredContactsForTasks)
    for (let i = 0; i < selectedAssignedTo.length; i++) {
        let selectedName = selectedAssignedTo[i];   
        for (let i = 0; i < filteredContactsForTasks.length; i++) {
            if (filteredContactsForTasks[i].name == selectedName) {
                document.getElementById(`checkboxNotCheckedId${filteredContactsForTasks[i].id}`).style.display = "none";
                document.getElementById(`checkboxCheckedId${filteredContactsForTasks[i].id}`).style.display = "block";
                document.getElementById(`labelAssignedTo${filteredContactsForTasks[i].id}`).style.backgroundColor = "orange"
            }
        }
    }
}

function resetStyleAssignedTo(filteredContactsForTasks) {
    for (let contact of filteredContactsForTasks) {
        const checkboxNotChecked = document.getElementById(`checkboxNotCheckedId${contact.id}`);
        const checkboxChecked = document.getElementById(`checkboxCheckedId${contact.id}`);
        const label = document.getElementById(`labelAssignedTo${contact.id}`);
        if (checkboxNotChecked) checkboxNotChecked.style.display = "block";
        if (checkboxChecked) checkboxChecked.style.display = "none";
        if (label) label.style.backgroundColor = "";
      }
}

function renderAssignedToList(listPersonId, initials, filteredContactsForTasks, i) {
    return `
        <label id="labelAssignedTo${listPersonId}">
            <div class="initialsImg" id="initialsImg${listPersonId}" style="background-color: ${filteredContactsForTasks[i].color}">
            ${initials}
            </div>
            <div class="contactPerson">${filteredContactsForTasks[i].name}</div>
            <input type="checkbox" value="${filteredContactsForTasks[i].name}" class="contactListCheckbox" 
                id="checkbox${filteredContactsForTasks[i].id}" onchange="">
            <img class="checkboxImg-notChecked" id="checkboxNotCheckedId${listPersonId}" src="assets/icons/checkbox.svg">
            <img class="checkboxImg-checked" id="checkboxCheckedId${listPersonId}" src="assets/icons/checkboxChecked.svg">
        </label>
        `
}