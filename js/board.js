let currentDraggedElement;

function startDragging(id, allTasks, allKeys) {
    currentDraggedElement = `single_task_ctn${id}`;
    console.log(currentDraggedElement)
   
}

function allowDrop(e) {
    e.preventDefault();
    
}

function showShadow(id) {
    document.getElementById(id).style.display = "flex";
}

function removeShadow(id) {
    document.getElementById(id).style.display = "none";
}

async function moveTo(category) {
    console.log("Dropping into category:", category);
    console.log("Current dragged element:", currentDraggedElement)
   
    let keyForPath = checkIndexOfTaskToMove(currentDraggedElement, allTasks, allKeys)
    let path = `tasks/${keyForPath}/currentStatus`;
    console.log(path);
    
    await putNewCategory(path, category);
    await getIdAndData(pathData='')
}

function openAddTaskForm() {
    window.location.href = "/add_task.html"
}

function checkIndexOfTaskToMove(currentDraggedElement, allTasks, allKeys) {
    debugger;
    let id = currentDraggedElement.slice(15);
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