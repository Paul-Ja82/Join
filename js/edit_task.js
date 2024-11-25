// let taskForEdit;

// async function editTask(e, keyToOpen) {
//     e.stopPropagation();
//     let path = `tasks/${keyToOpen}/`
//     taskForEdit = await getTaskForEdit(path);
//     console.log(taskForEdit);
//     // showContactsEditTask()
//     // console.log(taskForEdit.tasks[keyToOpen].currentStatus);
//     if (window.innerWidth < 400) {
//         window.open("add_task.html", "_self");
//       } else {
//         document.getElementById("backgroundId").classList.add("showIt");

//         document.getElementById("dialogBox").innerHTML = renderFormEditTask(taskForEdit.currentStatus, taskForEdit, keyToOpen);
//         selectPrio(taskForEdit.priority);
//         // await getIdAndDataForAddTask((pathData = ""));
//         const contactList = document.getElementById("insertContactList");
//         contactList.innerHTML = taskForEdit.assigned_to;
        
//         // contactList.classList.add("d-none");
//       }
//     return taskForEdit
// }

// function renderFormEditTask(selectedProcessCategory, taskForEdit, keyToOpen) {
//     console.log(taskForEdit);
//     return `
//     <div class="overAllFormAddTask">
//     <form id="formAddTasks" class="formAddTasks">
//         <div class="seperateSendButtons">
//             <div class="titleSectionAddTask">
//                 <h2 class="titleAddTask">Edit Task</h2>
//                 <div class="iconImage">
//                     <img onclick="closeDialog()" src="assets/icons/close.svg">
//                 </div>
//             </div>
//             <div class="overInputFields">
//                 <div class="fillOut">
//                     <div class="overField">
//                         <label for="title">
//                             Title
//                             <span style="color: #ff8190">*</span>
//                         </label>
//                         <input
//                             type="text"
//                             id="title"
//                             class="fieldInput"
//                             placeholder="Enter a Title" 
//                             value="${taskForEdit.title}"
//                         />
//                         <div id="errorTitle" class="errorMessage">
//                             This field is required.
//                         </div>
//                     </div>
//                     <div class="overField marginTop">
//                         <label for="description">Description</label>
//                         <textarea
//                             type="text"
//                             name="description"
//                             id="description"
//                             placeholder="Enter a Description" 
//                             value=""
//                         >
//                             ${taskForEdit.description}
//                         </textarea>
//                     </div>
//                     <div class="overField">
//                         <label for="inputAssignedTo">Assigned to</label>
//                         <div id="setBackground" class="overaddAssignedTo">
//                         <div class="overInputAssignedTo">
//                             <input
//                                 id="inputAssignedTo"
//                                 class="fieldInput inputAssignedTo"
//                                 type="text"
//                                 onclick="toggleContactList()"
//                                 oninput="filterContacts()"
//                                 placeholder="Assigned To"
//                             />
//                             <div class="changeSymboles">
//                                 <img id="arrowDropdown" src="assets/icons/arrowDropdown.svg" alt="" onclick="toggleContactList()"/>
//                             </div>
//                         </div>
//                         <ul id="insertContactList" class="listContacts">

//                         </ul>
//                     </div>
//                     <div id="showPersons" class="showPersons"></div>
//                 </div>
//             </div>
//             <div class="line"></div>
//             <div class="fillOut">
//                 <div class="overField">
//                     <label for="date">
//                         Due date
//                         <span style="color: #ff8190">*</span>
//                     </label>
//                     <div class="dateWrapper">
//                         <input
//                             type="date"
//                             id="date"
//                             class="fieldInput dateInput"
//                             onchange="checkDateInput()"
//                             value="${taskForEdit.due_date}"
//                         />
//                         <div class="dateIcon" onclick="document.getElementById('date').showPicker();">
//                             <img src="/assets/icons/calendarIcon.svg" alt="Calendar Icon"/>
//                         </div>
//                     </div>
//                     <div id="errorDate" class="errorMessage">
//                     This field is required.
//                     </div>
//                 </div>
//                 <div class="overField marginTop">
//                     <label>Prio</label>
//                     <div class="overPrioButtons">
//                         <button id="urgentButton" class="prioButtons" onclick="selectPrio('urgent')" type="button">
//                             Urgent
//                             <img
//                                 id="urgentButtonImg"
//                                 src="assets/icons/urgent.svg"
//                                 alt=""
//                             />
//                         </button>
//                         <button id="mediumButton" class="prioButtons" onclick="selectPrio('medium')" type="button">
//                             Medium
//                             <img id="mediumButtonImg" src="assets/icons/medium.svg" alt=""/>
//                         </button>
//                         <button id="lowButton" class="prioButtons" onclick="selectPrio('low')" type="button">
//                             Low
//                             <img id="lowButtonImg" src="assets/icons/low.svg" alt="" />
//                         </button>
//                     </div>
//                 </div>
//                 <div class="overField">
//                     <label for="showSelectedCategory">
//                         Category
//                         <span style="color: #ff8190">*</span>
//                     </label>
//                     <div class="arrowCategory">
//                         <img id="categoryDropdown" class="categoryDropdown" src="assets/icons/arrowDropdown.svg" onclick="showMeCategorys()"/>
//                     </div>
//                     <div id="costumSelect" class="costumSelect">
//                         <input
//                             type="text"
//                             id="showSelectedCategory"
//                             class="fieldInput"
//                             readonly
//                             placeholder="Select a task category"
//                             onclick="showMeCategorys()"
//                             value="${taskForEdit.category}"
//                         />
//                         <div id="showCategorys" class="showCategorys d-none">
//                             <div class="categoryItem" onclick="putInput('Technical Task')">
//                                 Technical Task
//                             </div>
//                             <div class="categoryItem" onclick="putInput('User Story')">
//                                 User Story
//                             </div>
//                         </div>
//                     </div>
//                     <div id="errorCategory" class="errorMessage">
//                         This field is required.
//                     </div>
//                 </div>
//                 <div class="overField marginTop">
//                     <label for="subtasks">Subtasks</label>
//                     <div class="overAddSubtasks">
//                         <input
//                             type="text"
//                             id="subtasks"
//                             class="fieldInput"
//                             oninput="changeSymbols()"
//                             placeholder="Add new subtask"
//                         />
//                         <div id="symbolsSubtasks" class="changeSymboles">
//                             <img src="assets/icons/plus.svg" alt="" />
//                         </div>
//                     </div>
//                     <ul id="showSubtasks"></ul>
//                 </div>
//             </div>
//         </div>
//         <div class="overFormButtons">
//             <div class="requiredInformation">
//                 <span style="color: #ff8190">*</span>
//                 This field is required
//             </div>
//             <div class="setButtons">
//                 <div class="overSendButtons">
//                     <button class="formButtons clearButton" type="button" onclick="reloadPage()">
//                         Clear
//                         <div class="iconX"></div>
//                     </button>
//                     <button class="formButtons createButton" type="button" onclick="submitForm('${selectedProcessCategory}')">
//                         Save Task 
//                         <img src="assets/icons/checkWhite.svg" alt="" />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     </form>
// </div>`;
// }

// function showContactsEditTask() {
//     let contactList;
//     let contactsThatAreOK = [];
//     for (let i = 11; i < taskForEdit.contacts.length; i++) {
//         contactsThatAreOK.push(taskForEdit.contacts[i])
//     }
//     console.log(contactsThatAreOK);
// }


// function renderContactList(filteredContacts = contacts) {
  
//     document.getElementById("setBackground").classList.add("whiteBG");
//     const contactList = document.getElementById("insertContactList");
//     contactList.classList.remove("d-none");
  
//     contactList.innerHTML = "";
//     document.getElementById("arrowDropdown").src =
//       "/assets/icons/arrowUpDropdown.svg";
  
//     if (filteredContacts.length === 0) {
//       contactList.innerHTML =
//         "<li class='emptyListMessage'>Ganz schön leer hier! :(</li>";
//       return;
//     }
  
//     filteredContacts.forEach((contact, index) => {
//       const isSelected = selectedContacts.includes(contact);
//       contactList.innerHTML += `
//         <li id="listPerson${index}" class="backgroundOnHover" onclick="changeCheckbox(${index})">
//           <div class="profile">
//             <div id="profilPerson${index}" class="profilePerson"></div>    
//             <div class="contactPerson">${contact}</div>
//           </div>
//           <input type="checkbox" value="${contact}" class="contactListCheckbox" 
//             id="checkbox${index}" onchange="renderAddedPersons()" 
//             onclick="event.stopPropagation()" 
//             ${isSelected ? "checked" : ""}>
//           <img id="checkboxId${index}" src="assets/icons/checkbox.svg">
//         </li>`;
//       showProfilPicture(contact, index);
//       if (isSelected) {
//         document.getElementById(`checkboxId${index}`).src =
//           "assets/icons/checkboxChecked.svg";
//       }
//     });
  
//     document.addEventListener("click", function (event) {
//       const inputAssignedTo = document.getElementById("inputAssignedTo");
//       const contactList = document.getElementById("insertContactList");
//       const arrowDrop = document.getElementById("arrowDropdown");
    
//       if (
//         !inputAssignedTo.contains(event.target) &&
//         !contactList.contains(event.target) &&
//         !arrowDrop.contains(event.target)
//       ) {
//         closeContactList();
//       }
//     });
//     showPersons();
//     colorSelectedContacts();
//   }