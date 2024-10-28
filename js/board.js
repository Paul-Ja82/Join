function openTaskOverlay(e) {
    document.getElementById(`task_overlay_ctn`).style.right = "0";
    document.body.style.overflow = "hidden"; 
    console.log(e.target);  
}





function closeTaskOverlay(e) {
    if (e.target.id === "task_overlay_ctn" || e.target.id === "close_task_overlay" || e.target.id === "close_task_overlay_svg") {
        // console.log(e.target.id)
        // console.log(e)
        document.getElementById(`task_overlay_ctn`).style.right = "-100%";
    }
     document.body.style.overflow = "";
}

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

















