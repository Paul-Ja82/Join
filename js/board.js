function openTaskOverlay(e) {
    document.getElementById(`task_overlay_ctn`).style.display = "flex";
}

function closeTaskOverlay(e) {
    if (e.target.id === "task_overlay_ctn" || e.target.id === "close_task_overlay" || e.target.id === "close_task_overlay_svg") {
        console.log(e.target.id)
        console.log(e)
        document.getElementById("task_overlay_ctn").style.display = "none";
    }
}