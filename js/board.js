let flyingElement = document.createElement("div")
flyingElement.classList.add('flying_element_ctn');
flyingElement.id = 'flying_element_ctn';
let elementIsFlying = false; 
let currentDraggedElementID;
let currentDraggedElement;
let clonedElementForMoving;
let dragAndDropSections = [
    'to_do_tasks',
    'in_progress_tasks',
    'await_feedback_tasks',
    'done_tasks'
]
let sectionToSaveTask;

function cloneElement(id, e) {
    currentDraggedElementID = `single_task_ctn${id}`;
    currentDraggedElement = document.getElementById(currentDraggedElementID);
    clonedElementForMoving = currentDraggedElement.cloneNode(true);
    clonedElementForMoving.id = 'clonedElement';
    document.getElementById('board_body').appendChild(flyingElement)
    elementIsFlying = true;
    return elementIsFlying
}

function startDragging(e) {
    let rect = currentDraggedElement.getBoundingClientRect();
    styleClonedElement(rect, event)
    currentDraggedElement.classList.add("hide_original_task");
    flyingElement.appendChild(clonedElementForMoving);
    flyingElement.style.position = "absolute";
    clonedElementForMoving.style.position = 'absolute';
    e.dataTransfer.setDragImage(new Image(), 0, 0);
}

function styleClonedElement(rect,e) {
    clonedElementForMoving.style.left = `0px`;
    clonedElementForMoving.style.top = `0px`;
    clonedElementForMoving.style.right = `0px`;
    clonedElementForMoving.style.bottom = `0px`;
    clonedElementForMoving.style.height = `${rect.height}px`;
    clonedElementForMoving.style.width = `${rect.width}px`;
}

function whileDragging(e) {
    let width = window.innerWidth;
    let xStart;
    if (width >= 1440) {
         xStart = width / 2 - 720 
    } else {
        xStart = 0;
    }
    flyingElement.style.left = e.pageX - xStart + 'px';
    flyingElement.style.top = e.pageY + 'px';
}

function endDragging() {
    if (elementIsFlying == true) {
        flyingElement.removeChild(clonedElementForMoving)
        clonedElementForMoving.remove();
        document.getElementById('board_body').removeChild(flyingElement)
    }
    return elementIsFlying = false
}

async function checkDraggableArea(e) {
    let cursorX = e.clientX;
    let cursorY = e.clientY;
    let idFromSectionToDrop = checkIdFromSectionToDrop(cursorX, cursorY); 
    let newSection = checkNewSection(idFromSectionToDrop);    
    if (newSection == 'noDropArea') {
        endDragging()
        removeShadow(id)
        return  
    } else {
        moveTo(newSection)
        endDragging()
    }
}

function checkNewSection(idFromSectionToDrop) {
    if (idFromSectionToDrop == 'to_do_tasks') {
        newSection = 'todo';
    } else if (idFromSectionToDrop == 'in_progress_tasks') {
        newSection = 'inProgress';
    } else if (idFromSectionToDrop == 'await_feedback_tasks') {
        newSection = 'awaitFeedback'
    } else if (idFromSectionToDrop == 'done_tasks') {
        newSection = 'done'
    } else {
        newSection = 'noDropArea'
    }
    return newSection
}

function checkIdFromSectionToDrop(cursorX, cursorY) {
    let idFromSectionToDrop = 'noDropArea';
    for (let i = 0; i < dragAndDropSections.length; i++) {
        let sectionLeft = document.getElementById(`${dragAndDropSections[i]}`).getBoundingClientRect().left;
        let sectionRight = document.getElementById(`${dragAndDropSections[i]}`).getBoundingClientRect().right;
        let sectionTop = document.getElementById(`${dragAndDropSections[i]}`).getBoundingClientRect().top;
        let sectionBottom = document.getElementById(`${dragAndDropSections[i]}`).getBoundingClientRect().bottom;
        if ((cursorX > sectionLeft && cursorX < sectionRight) && (cursorY > sectionTop && cursorY < sectionBottom)) {
            idFromSectionToDrop = dragAndDropSections[i]
        }
    }
    return idFromSectionToDrop
}

function allowDrop(e) {
    e.preventDefault();
}

function showShadow(id) {
    document.getElementById('shadow_move_to_to_do_tasks').style.display = "none";
    document.getElementById('shadow_move_to_in_progress_tasks').style.display = "none";
    document.getElementById('shadow_move_to_await_feedback_tasks').style.display = "none";
    document.getElementById('shadow_move_to_done_tasks').style.display = "none";
    document.getElementById(id).style.display = "flex";
}

function removeShadow(id) {
    document.getElementById('shadow_move_to_to_do_tasks').style.display = "none";
    document.getElementById('shadow_move_to_in_progress_tasks').style.display = "none";
    document.getElementById('shadow_move_to_await_feedback_tasks').style.display = "none";
    document.getElementById('shadow_move_to_done_tasks').style.display = "none";
}

async function moveTo(newSection) {
    let keyForPath = checkIndexOfTaskToMove(currentDraggedElementID, allTasks, allKeys)
    let path = `tasks/${keyForPath}/currentStatus`;
    await putNewSection(path, newSection);
    await getIdAndData(pathData='')
}

function openAddTaskForm(section) {
    sectionToSaveTask = section;
    console.log(section);
    window.location.href = "/add_task.html"
    return sectionToSaveTask
}

function checkIndexOfTaskToMove(currentDraggedElementID, allTasks, allKeys) {
    let id = currentDraggedElementID.slice(15);
    let keytoChangeCategory;
    for (let i = 0; i < allKeys.length; i++) {
        if (allTasks[`${allKeys[i]}`].single_ID == id) {
            // console.log(i, allKeys[i])
            keytoChangeCategory = allKeys[i]
        }
    }
    return keytoChangeCategory
}

function openCloseMenuMovingTask(e, single_ID, currentStatus) {
    e.stopPropagation()
    single_ID = single_ID
    currentStatus = currentStatus
    let menuForMoving = document.getElementById(`move_task_menu_${single_ID}`)
    menuForMoving.classList.toggle("visible");
    if(menuForMoving.classList.contains('visible')) {
        document.getElementById(`single_task_ctn${single_ID}`).style.filter = "grayscale(0.75)";
    } else {
        document.getElementById(`single_task_ctn${single_ID}`).style.filter = "grayscale(0)";
    }

    enableCurrentSection(currentStatus, single_ID)
}

function enableCurrentSection(currentStatus, single_ID) {
    let moveToID = `move_${single_ID}_to_${currentStatus}`
    document.getElementById(`move_${single_ID}_to_todo`).style.color = "black";
    document.getElementById(`move_${single_ID}_to_inProgress`).style.color = "black";
    document.getElementById(`move_${single_ID}_to_awaitFeedback`).style.color = "black";
    document.getElementById(`move_${single_ID}_to_done`).style.color = "black";
    document.getElementById(`${moveToID}`).style.color = "lightgray";
}

function checkKeyToMove(allTasks, allKeys, id) {
    let keytoChangeSection;
    for (let i = 0; i < allKeys.length; i++) {
        if (allTasks[`${allKeys[i]}`].single_ID == id) {
            console.log(i, allKeys[i])
            keytoChangeSection = allKeys[i]
        }
    }
    return keytoChangeSection
}

async function moveTaskWithMenu(id, toSection) {
    let keytoChangeSection = checkKeyToMove(allTasks, allKeys, id)
    let path = `tasks/${keytoChangeSection}/currentStatus`;
    await putNewSection(path, toSection)
    await getIdAndData(pathData='')
}