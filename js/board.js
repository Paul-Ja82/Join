let currentDraggedElementID;
let currentDraggedElement;
let clonedElementForMoving;

function onMouseDown(id, e) {
    currentDraggedElementID = `single_task_ctn${id}`;
    console.log(currentDraggedElementID);
    console.log(e);
    
    currentDraggedElement = document.getElementById(currentDraggedElementID);
    clonedElementForMoving = currentDraggedElement.cloneNode(true);
    clonedElementForMoving.id = 'clonedElement';
    clonedElementForMoving.style.left = `${e.offsetX - e.screenX}px`;
    clonedElementForMoving.style.top = `${e.offsetY - e.screenY}px`
}

function whileDragging(e) {
    console.log(e);
    clonedElementForMoving.style.left = `${e.x + e.screenX}px`;
    clonedElementForMoving.style.top = `${e.y + e.screenY}px`
}

function startDragging(id, e) {
  
    let rect = currentDraggedElement.getBoundingClientRect();
    console.log(rect);
    console.log(e);
    currentDraggedElement.style.opacity = "0"; // Originalelement unsichtbar machen
  
   
    clonedElementForMoving.style.bottom = `${rect.bottom}px`
    clonedElementForMoving.style.height = `${rect.height}px`
    clonedElementForMoving.style.left = `${rect.left}px`;
    clonedElementForMoving.style.top = `${rect.top}px`
    clonedElementForMoving.style.width = `${rect.width}px`
    clonedElementForMoving.style.right = `${rect.right}px`
    document.body.appendChild(clonedElementForMoving);
    clonedElementForMoving.style.position = 'absolute';
    
    clonedElementForMoving.style.backgroundColor = 'lightblue'; // Beispielhintergrund
    clonedElementForMoving.style.zIndex = 100;
    clonedElementForMoving.style.opacity = '1'; // Opazität auf 1 setzen
    clonedElementForMoving.style.transform = 'rotate(10deg)'; // Rotation hinzufügen

   

    e.dataTransfer.setDragImage(new Image(), 0, 0); // Offset für das Drag-Bild

}




function onMouseMove(event) {
    if (clonedElementForMoving) {
        clonedElementForMoving.style.left = `${event.pageX - 323}px`;
        clonedElementForMoving.style.top = `${event.pageY}px`;
    }
}

function endDragging() {
    if (clonedElementForMoving) {
        currentDraggedElement.style.opacity = "1"; // Originalelement wieder sichtbar machen
        clonedElementForMoving.remove(); // Entferne das geklonte Element
        clonedElementForMoving = null; // Setze die Variable zurück
        // Entferne die Event-Listener, um das Dragging zu beenden
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', endDragging);
    }
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
    document.getElementById(id).style.display = "none";
}

async function moveTo(category) {
    console.log("Dropping into category:", category);
    console.log("Current dragged element:", currentDraggedElementID)
    let keyForPath = checkIndexOfTaskToMove(currentDraggedElementID, allTasks, allKeys)
    let path = `tasks/${keyForPath}/currentStatus`;
    document.getElementById(currentDraggedElementID).classList.remove("rotate_task");
    document.body.removeChild(clonedElementForMoving);
    await putNewCategory(path, category);
    await getIdAndData(pathData='')
}

function openAddTaskForm() {
    window.location.href = "/add_task.html"
}

function checkIndexOfTaskToMove(currentDraggedElementID, allTasks, allKeys) {
    debugger;
    let id = currentDraggedElementID.slice(15);
    console.log("id", id);
    console.log(allKeys);
    let keytoChangeCategory;
    
    for (let i = 0; i < allKeys.length; i++) {
        if (allTasks[`${allKeys[i]}`].single_ID == id) {
            console.log(i, allKeys[i])
            keytoChangeCategory = allKeys[i]
        }
    }
    return keytoChangeCategory
}
