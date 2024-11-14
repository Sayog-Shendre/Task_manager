document.addEventListener("DOMContentLoaded", () => {
    const taskTitleInput = document.getElementById("task-title");
    const taskDescriptionInput = document.getElementById("task-description");
    const taskDueDateInput = document.getElementById("task-due-date");
    const taskPriorityInput = document.getElementById("task-priority");
    const addTaskButton = document.getElementById("add-task");
    const searchInput = document.getElementById("search");
    const upcomingTasksList = document.getElementById("upcoming-tasks");
    const overdueTasksList = document.getElementById("overdue-tasks");
    const completedTasksList = document.getElementById("completed-tasks");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function renderTasks() {
        upcomingTasksList.innerHTML = "";
        overdueTasksList.innerHTML = "";
        completedTasksList.innerHTML = "";

        const now = new Date();

        tasks.forEach(task => {
            const taskElement = document.createElement("li");
            taskElement.textContent = `${task.title} - ${task.description} - Due: ${task.dueDate} - Priority: ${task.priority}`;

            const completeButton = document.createElement("button");
            completeButton.textContent = task.completed ? "Undo" : "Complete";
            completeButton.className = "toggle-complete";
            completeButton.onclick = () => toggleComplete(task.id);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-task";
            deleteButton.onclick = () => deleteTask(task.id);

            taskElement.appendChild(completeButton);
            taskElement.appendChild(deleteButton);

            const dueDate = new Date(task.dueDate);
            if (task.completed) {
                taskElement.classList.add("completed");
                completedTasksList.appendChild(taskElement);
            } else if (dueDate < now) {
                overdueTasksList.appendChild(taskElement);
            } else {
                upcomingTasksList.appendChild(taskElement);
            }
        });
    }

    function addTask() {
        const title = taskTitleInput.value;
        const description = taskDescriptionInput.value;
        const dueDate = taskDueDateInput.value;
        const priority = taskPriorityInput.value;

        if (title && dueDate) {
            const newTask = {
                id: Date.now(),
                title,
                description,
                dueDate,
                priority,
                completed: false,
            };
            tasks.push(newTask);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks();
            clearInputs();
        } else {
            alert("Please fill in the title and due date.");
        }
    }

    function toggleComplete(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks();
        }
    }

    function deleteTask(taskId) {
        tasks = tasks.filter(t => t.id !== taskId);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    }

    function clearInputs() {
        taskTitleInput.value = "";
        taskDescriptionInput.value = "";
        taskDueDateInput.value = "";
        taskPriorityInput.value = "Medium";
    }

    addTaskButton.addEventListener("click", addTask);
    searchInput.addEventListener("input", renderTasks); // Optional: Implement search functionality

    renderTasks(); // Initial rendering of tasks
});
