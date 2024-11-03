let currentDraggedElementID;
let currentDraggedElement;
let clonedElementForMoving;

function cloneElement(id, e) {
    currentDraggedElementID = `single_task_ctn${id}`;
    console.log(currentDraggedElementID);
    console.log(e);
    
    currentDraggedElement = document.getElementById(currentDraggedElementID);
    clonedElementForMoving = currentDraggedElement.cloneNode(true);
    clonedElementForMoving.id = 'clonedElement';
}

function whileDragging(e) {
    // console.log(e);
    clonedElementForMoving.style.left = `${e.pageX - 430}px`;
    clonedElementForMoving.style.top = `${e.pageY}px`
}

function startDragging(e) {
    let rect = currentDraggedElement.getBoundingClientRect();
    console.log(rect);
    console.log(e);
    styleClonedElement(rect, event)
    currentDraggedElement.classList.add("hide_original_task");
    document.body.appendChild(clonedElementForMoving);
    clonedElementForMoving.classList.add("show_cloned_task")
    e.dataTransfer.setDragImage(new Image(), 0, 0); // Offset für das Drag-Bild
}

function styleClonedElement(rect,e) {
    clonedElementForMoving.style.height = `${rect.height}px`
    clonedElementForMoving.style.left = `${e.pageX - 430}px`;
    clonedElementForMoving.style.top = `${e.pageY}px`
    clonedElementForMoving.style.width = `${rect.width}px`
    clonedElementForMoving.style.right = `${rect.right}px`
    clonedElementForMoving.style.position = 'absolute';
    clonedElementForMoving.style.zIndex = 100;
}

function endDragging() {
    if (clonedElementForMoving) {
        currentDraggedElement.style.opacity = "1"; // Originalelement wieder sichtbar machen
        clonedElementForMoving.remove(); // Entferne das geklonte Element
        clonedElementForMoving = null; // Setze die Variable zurück
        // Entferne die Event-Listener, um das Dragging zu beenden
        // document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', endDragging);
    }
}

let dragAndDropSections = [
    'to_do_tasks',
    'in_progress_tasks',
    'await_feedback_tasks',
    'done_tasks'
]

function checkDraggableArea(e) {
    console.log(e);
    let cursorX = e.clientX;
    let cursorY = e.clientY;
    let idFromSectionToDrop = checkIdFromSectionToDrop(cursorX, cursorY); 
    let newSection = checkNewSection(idFromSectionToDrop);
    console.log(newSection);
    
    if (newSection == 'noDropArea') {
        endDragging()
        removeShadow(id)
        return  
    } else {
        console.log(newSection);
        moveTo(newSection)
        endDragging()
    }
    // nothingTodoOrDone()
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
        console.log(document.getElementById(`${dragAndDropSections[i]}`).getBoundingClientRect());
        let sectionLeft = document.getElementById(`${dragAndDropSections[i]}`).getBoundingClientRect().left;
        let sectionRight = document.getElementById(`${dragAndDropSections[i]}`).getBoundingClientRect().right;
        let sectionTop = document.getElementById(`${dragAndDropSections[i]}`).getBoundingClientRect().top;
        let sectionBottom = document.getElementById(`${dragAndDropSections[i]}`).getBoundingClientRect().bottom;
        console.log('x: ', cursorX, 'l: ', sectionLeft, 'r: ', sectionRight, 'y: ', cursorY, 't: ', sectionTop, 'b: ', sectionBottom);
        if ((cursorX > sectionLeft && cursorX < sectionRight) && (cursorY > sectionTop && cursorY < sectionBottom)) {
            idFromSectionToDrop = dragAndDropSections[i]
        }
    }
    console.log(idFromSectionToDrop);
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
    // document.getElementById(id).style.display = "none";
    document.getElementById('shadow_move_to_to_do_tasks').style.display = "none";
    document.getElementById('shadow_move_to_in_progress_tasks').style.display = "none";
    document.getElementById('shadow_move_to_await_feedback_tasks').style.display = "none";
    document.getElementById('shadow_move_to_done_tasks').style.display = "none";
}

async function moveTo(newSection) {
    console.log("Dropping into category:", newSection);
    console.log("Current dragged element:", currentDraggedElementID)
    let keyForPath = checkIndexOfTaskToMove(currentDraggedElementID, allTasks, allKeys)
    let path = `tasks/${keyForPath}/currentStatus`;
    document.body.removeChild(clonedElementForMoving);
    await putNewCategory(path, newSection);
    await getIdAndData(pathData='')
}

function checkCategory(category) {
    console.log(category.id);
    if (category.id.includes("todo")) {
        category = 'todo'
    } else if (category.id.includes("progress")) {
        category = 'inProgress'
    } else if (category.id.includes("feedback")) {
        category = 'awaitFeedback'
    } else if (category.id.includes("done")) {
         category = 'done'
    }
    return category
}

function openAddTaskForm() {
    window.location.href = "/add_task.html"
}

function checkIndexOfTaskToMove(currentDraggedElementID, allTasks, allKeys) {
    debugger;
    let id = currentDraggedElementID.slice(15);
    // console.log("id", id);
    // console.log(allKeys);
    let keytoChangeCategory;
    
    for (let i = 0; i < allKeys.length; i++) {
        if (allTasks[`${allKeys[i]}`].single_ID == id) {
            console.log(i, allKeys[i])
            keytoChangeCategory = allKeys[i]
        }
    }
    return keytoChangeCategory
}
