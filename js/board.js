
let currentDraggedElement;

function startDragging(id) {
    currentDraggedElement = `single_task_ctn${id}`;
    console.log(currentDraggedElement)
}

function allowDrop(e) {
    e.preventDefault();
}

function moveTo(category) {

}

function openAddTaskForm() {
    window.location.href = "/add_task.html"
}